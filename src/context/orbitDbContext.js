import * as MailboxJson from "../utils/Mailbox.json";
import { useState, useEffect, useContext, createContext } from "react";
import { useEthersProvider } from "./providerContext.js";
import Identities from "orbit-db-identity-provider";

const { abi } = MailboxJson;
const IPFS = require("ipfs-http-client");
const OrbitDB = require("orbit-db");

const orbitDbContext = createContext();

export function ProvideOrbitDb({ children }) {
  const auth = useProvideOrbitDb();
  return (
    <orbitDbContext.Provider value={auth}>{children}</orbitDbContext.Provider>
  );
}

export const useOrbitDb = () => {
  return useContext(orbitDbContext);
};

const ipfsOptions = {
  EXPERIMENTAL: {
    pubsub: true,
  },
  relay: {
    enabled: true,
    hop: {
      enabled: true,
      active: true,
    },
  },
  host: process.env.REACT_APP_IPFS_HOST,
  port: process.env.REACT_APP_IPFS_PORT,
};

function useProvideOrbitDb() {
  const provider = useEthersProvider();
  // TODO: Move this to dotenv file
  const mailboxContractAddr = "0x8b97C01F447537d9403Eb7eA9395f63a0f59361D";
  const contractABI = abi;

  const [ipfs, setIpfs] = useState(null);
  const [orbitDb, setOrbitDb] = useState(null);
  const [inbox, setInbox] = useState(null);
  const [pendingMailbox, setPendingMailbox] = useState();
  const [mailboxContract, setMailboxContract] = useState(null);

  useEffect(() => {
    function cleanup() {
      if (orbitDb) {
        orbitDb.stop().then(() => {
          console.log("-> Disconnected from OrbitDb");
          setOrbitDb(null);
        });
      }
    }

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

      Identities.createIdentity({
        type: "ethereum",
        signer,
      })
        .then((identity) => {
          OrbitDB.createInstance(tempIpfs, { identity: identity }).then(
            (orbit) => {
              setOrbitDb(orbit);
              console.log("-> OrbitDb instance created");
            }
          );
        })
        .catch((err) => {
          console.log("There was a problem getting the OrbitDb identity", err);
        });

      const contract = provider.connectToContract(
        mailboxContractAddr,
        contractABI
      );
      setMailboxContract(contract);
      contract.pendingInbox().then((pendingMailboxAddr) => {
        setPendingMailbox(pendingMailboxAddr);
      });
    } else {
      cleanup();
    }

    return cleanup();
  }, [provider.signer]);

  useEffect(() => {
    if (provider.addr && provider.signer && orbitDb) {
      fetchInbox(provider.addr, true);
    }
  }, [provider.addr, orbitDb]);

  async function fetchInbox(walletAddr, isUsersInbox) {
    if (provider.signer && orbitDb) {
      mailboxContract.getInbox().then((inboxAddr) => {
        if (inboxAddr !== "<empty string>" && inboxAddr.length !== 0) {
          orbitDb
            .open(inboxAddr)
            .then((inboxDb) => {
              inboxDb.load();

              if (isUsersInbox) {
                setInbox(inboxDb);
              }
            })
            .catch((err) => {
              console.log("Inbox could not be found for this user", err);
            });
        }
      });
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
      const userInbox = await orbitDb.docs(address);
      const inboxAddr = userInbox.address.toString();
      // TODO: Set AccessControl to [*] or else nobody will be able to send to inbox
      mailboxContract
        .addInbox(inboxAddr)
        .then(() => {
          setInbox(userInbox);
          // TODO: move pending emails from pending email DB to new DB
          return userInbox;
        })
        .catch((err) => {
          userInbox.drop();
          console.log("There was a problem initializing the inbox", err);
        });
    } else {
      console.log("User's wallet is not connected");
    }
  }

  /*
  * Need to figure out email body. Is it possible to have types to adhear to in regular JS like TypeScript?
  {
    _id: <hash of all the fields below> (Warning: ID field must be _id as that's what OrbitDb defaults to for id field)
    from: <wallet address>
    to: list(<wallet address>)
    signedMessage: <message signed by personal_sign> *** this can be added in this function below ***
    originalMessage: <message before it was signed by personal_sign> *** this can be added in this function below ***
    subject: <subject string>
    body: <body string>
    createdAt: Date.now()
  }
  */
  async function sendEmail(email) {
    // User needs an init inbox before sending emails
    if (provider.signer) {
      if (!inbox) {
        console.log("User must have an inbox before sending emails");
        return;
      }

      const [signature, message, senderAddress] =
        await provider.requestPersonalSign();
      if (senderAddress !== email.from) {
        console.log("You cannot send an email as another person");
        return;
      }

      email.signedMessage = signature;
      email.originalMessage = message;

      const toEmails = email.to;
      for (let emailIndex = 0; emailIndex < toEmails.length; emailIndex++) {
        const toAddr = toEmails[emailIndex];
        const recievingInboxAddr =
          (await mailboxContract.getInbox()) || pendingMailbox;

        orbitDb
          .open(recievingInboxAddr)
          .then((receivingInbox) => {
            receivingInbox.put(email);
            receivingInbox.close();
          })
          .catch((err) => {
            console.log("Inbox not found, email not sent for" + toAddr, err);
          });
      }
    } else {
      console.log("User's wallet must be connected to send email.");
    }
  }

  // TODO: inbox orbitDb query after first connecting/loading
  // TODO: events to accept new emails
  // TODO: filtering spoofed emails when inbox is query when first connected and also when new emails come in through events

  return {
    inbox,
    fetchInbox,
    initInbox,
    sendEmail,
  };
}
