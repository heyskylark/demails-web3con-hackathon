import { useState, useEffect, useContext, createContext } from "react";
import { useEthersProvider } from "../context/providerContext.js";
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

  async function createDocumentStore(dbName) {
    if (orbitDb) {
      return await orbitDb.docs(dbName);
    } else {
      console.log("OrbitDb is not initialized");
    }
  }

  return {
    createDocumentStore,
  };
}
