import { useState, useEffect, useContext, createContext } from "react";
import { useEthersProvider } from "./providerContext.js";
import Identities from "orbit-db-identity-provider";

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
  host: "127.0.0.1",
  port: "5001",
};

function useProvideOrbitDb() {
  const provider = useEthersProvider();
  const [ipfs, setIpfs] = useState(null);
  const [orbitDb, setOrbitDb] = useState(null);
  const [inbox, setInbox] = useState(null);

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
    } else {
      cleanup();
    }

    return cleanup();
  }, [provider.signer]);

  async function fetchInbox() {
    if (provider.signer && orbitDb) {
      // TODO: smart contract to check if for existing wallet
      // orbitDb.open("<addr-from-smrt-ctrt>")
      //   .then((inboxDb) => { setInbox(inboxDb); inboxDb.load(); ... <other logic>})
      //   .catch((err) => {/** Some problem occured, I think this will happen if no DB is found, create-db */})
    } else {
      console.log("User's wallet is not connected");
    }
  }

  async function initInbox() {
    if (provider.signer) {
      if (inbox || (await fetchInbox())) {
        console.log("User already has an inbox");
        return;
      }

      const address = await provider.signer.getAddress();
      const userInbox = await orbitDb.docs(address);
      // TODO: update smart contract with OrbitDb database address: userInbox.address.toString()
      // TODO: move pending emails from pending email DB to new DB

      return userInbox;
    } else {
      console.log("User's wallet is not connected");
    }
  }

  /*
  * Need to figure out email body. Is it possible to have types to adhear to in regular JS like TypeScript?
  {
    id: <hash of all the fields below>
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
        // TODO: Fetch orbitDb inbox address from smart contract toEmails[emailIndex]
        // TODO: if no orbitDb address for email.to, fetch pendingEmails DB address from smart contract
        // TODO: save email to correct DB address
        // orbitDb.open(recievingInboxAddr)
        // .then((recievingInbox) => { recievingInbox.put(email) ... <other logic> ... recievingInbox.close() })
        // .catch((err) => {/** Some problem occured, I think this will happen if no DB is found, email not sent */})
      }
    } else {
      console.log("User's wallet must be connected to send email.");
    }
  }

  // TODO: inbox orbitDb query after first connecting/loading
  // TODO: events to accept new emails
  // TODO: filtering spoofed emails when inbox is query when first connected and also when new emails come in through events

  return {
    fetchInbox,
    initInbox,
    sendEmail,
  };
}
