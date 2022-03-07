import * as MailboxJson from "../utils/Mailbox.json";
import { useState, useEffect, useContext, createContext } from "react";
import { useEthersProvider } from "./providerContext.js";
import Identities from "orbit-db-identity-provider";
import PropTypes from "prop-types";

const { abi } = MailboxJson;
const IPFS = require("ipfs-http-client");
const OrbitDB = require("orbit-db");

import Gun from "gun/gun";

const orbitDbContext = createContext();

export function ProvideOrbitDb({ children }) {
  const auth = useProvideOrbitDb();
  return <orbitDbContext.Provider value={auth}>{children}</orbitDbContext.Provider>;
}

ProvideOrbitDb.propTypes = {
  children: PropTypes.node
};

export const useOrbitDb = () => {
  return useContext(orbitDbContext);
};

const ipfsOptions = {
  EXPERIMENTAL: {
    pubsub: true
  },
  relay: {
    enabled: true,
    hop: {
      enabled: true,
      active: true
    }
  },
  host: "localhost",
  port: 5001
};

function useProvideOrbitDb() {
  const provider = useEthersProvider();
  // TODO: Move this to dotenv file
  const mailboxContractAddr = "0xcAac6E79b814c46A019A29784840A187DECc2478";
  const contractABI = abi;

  const [ipfs, setIpfs] = useState(null);
  const [gun, setGun] = useState(null);
  const [orbitDb, setOrbitDb] = useState(null);
  const [inbox, setInbox] = useState(null);
  const [inboxAddr, setInboxAddr] = useState(null);
  const [pendingMailbox, setPendingMailbox] = useState();
  const [mailboxContract, setMailboxContract] = useState(null);
  const [emails, setEmails] = useState(null);

  useEffect(() => {
    function cleanup() {
      if (orbitDb) {
        orbitDb.stop().then(() => {
          console.log("-> Disconnected from OrbitDb");
          setOrbitDb(null);
        });
      }
    }

    async function databaseSetup() {
      const signer = provider.signer;
      if (provider.signer) {
        let tempIpfs;
        if (ipfs) {
          tempIpfs = ipfs;
        } else {
          tempIpfs = IPFS.create(ipfsOptions);
          setIpfs(tempIpfs);
        }
        console.log("-> IPFS node connected");

        const gun = Gun({
          peers: ["https://gun-manhattan.herokuapp.com/gun"] // Put the relay node that you want here
        });
        setGun(gun);
        console.log("-> Gun instance created");

        // const identity = await Identities.createIdentity({
        //   type: "ethereum",
        //   signer
        // });
        // const orbit = await OrbitDB.createInstance(tempIpfs, { identity: identity });
        // setOrbitDb(orbit);
        // console.log("-> OrbitDb instance created");

        const contract = provider.connectToContract(mailboxContractAddr, contractABI);
        setMailboxContract(contract);
        const pendingMailboxAddr = await contract.pendingInbox();
        setPendingMailbox(pendingMailboxAddr);
      } else {
        cleanup();
      }
    }

    databaseSetup().catch((err) => console.log("Error setting up database", err));

    return cleanup();
  }, [provider.signer]);

  useEffect(() => {
    if (mailboxContract && provider.addr && provider.signer && gun) {
      fetchInbox(provider.addr, true).catch((err) =>
        console.log("There was a problem fetching and loading the inbox", err)
      );
    }
  }, [mailboxContract, provider.addr, orbitDb]);

  async function fetchInbox(walletAddr, isUsersInbox) {
    if (mailboxContract && provider.signer && gun) {
      const inboxAddr = await mailboxContract.getInbox(walletAddr);
      if (inboxAddr !== "<empty string>" && inboxAddr.length !== 0) {
        const inboxDb = gun.get(inboxAddr).get("public").get("emails");

        console.log("Get gun myInbox", inboxDb);

        if (isUsersInbox) {
          getMyInbox(inboxAddr);
          setInbox(inboxDb);
          setInboxAddr(inboxAddr);
        }
      }
    } else {
      console.log("User's wallet is not connected");
    }
  }

  // Useful DocStore documentation: https://github.com/orbitdb/orbit-db-docstore
  async function initInbox() {
    if (provider.signer) {
      if (inbox) {
        console.log("User already has an inbox");
        return;
      }

      const address = await provider.signer.getAddress();
      const userInbox = await gun.get(address).get("public").get("emails");

      try {
        await mailboxContract.addInbox(address);
        setInbox(userInbox);
        setInboxAddr(address);
        // TODO: move pending emails from pending email DB to new DB

        return userInbox;
      } catch (err) {
        console.log("There was a problem instatiating the inbox in the contract", err);
      }
    } else {
      console.log("User's wallet is not connected");
    }
  }

  /*
  * Need to figure out email body. Is it possible to have types to adhear to in regular JS like TypeScript?
  {
    _id: <hash of all the fields below> (Warning: ID field must be _id as that's what OrbitDb defaults to for id field)
    from: <wallet address> *** this can be added in this function below ***
    to: list(<wallet address>)
    signedMessage: <message signed by personal_sign> *** this can be added in this function below ***
    originalMessage: <message before it was signed by personal_sign> *** this can be added in this function below ***
    subject: <subject string>
    body: <body string>
    createdAt: Date.now() <message before it was signed by personal_sign> *** this can be added in this function below ***
  }
  */
  async function sendEmail(email) {
    // User needs an init inbox before sending emails
    if (provider.signer) {
      if (!inbox) {
        console.log("User must have an inbox before sending emails");
        return;
      }

      const [signature, message, senderAddress] = await provider.requestPersonalSign();

      email.from = senderAddress;
      email.signedMessage = signature;
      email.originalMessage = message;
      email.createdAt = Date.now();

      const toEmails = email.to;
      for (let emailIndex = 0; emailIndex < toEmails.length; emailIndex++) {
        const toAddr = toEmails[emailIndex];
        const receivingInboxAddr = (await mailboxContract.getInbox(toAddr)) || pendingMailbox;

        if (!receivingInboxAddr) {
          console.log("Could not find inbox to send to");
          return;
        } else {
          console.log("Sending to inbox", receivingInboxAddr);
        }

        email.id = email.from + "." + toAddr + "." + email.createdAt;
        email.to = receivingInboxAddr;
        let receiver = gun.get(receivingInboxAddr).get("public").get("emails");
        console.log("email being sent", email);
        receiver.get(email.id).put(email);
      }
    } else {
      console.log("User's wallet must be connected to send email.");
    }
  }

  async function getMyInbox(inboxAddr) {
    function callback(data) {
      if (data) {
        const tempEmails = [];
        for (const [, value] of Object.entries(data)) {
          console.log(data);
          gun.get(value["#"]).once((d) => tempEmails.push(d));
        }

        const filter = function (element) {
          return element;
        };
        const filtered = tempEmails.filter(filter);
        console.log("filtered", filtered);
        console.log(tempEmails);
        setEmails(tempEmails);
      }
    }

    gun.get(inboxAddr).get("public").get("emails").once(callback, true);
  }
  // TODO: filtering spoofed emails when inbox is query when first connected and also when new emails come in through events

  return {
    emails,
    inbox,
    inboxAddr,
    fetchInbox,
    initInbox,
    sendEmail,
    getMyInbox
  };
}
