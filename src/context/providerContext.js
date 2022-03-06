import { useEffect, useState, useContext, createContext } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

const ethersProviderContext = createContext();

export function ProvideEthersProvider({ children }) {
  const auth = useProvideEthersProvider();
  return (
    <ethersProviderContext.Provider value={auth}>
      {children}
    </ethersProviderContext.Provider>
  );
}

export const useEthersProvider = () => {
  return useContext(ethersProviderContext);
};

function useProvideEthersProvider() {
  const [signer, setSigner] = useState(null);
  const [addr, setAddr] = useState(null);

  let provider;
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
  } else {
    provider = null;
  }

  useEffect(() => {
    if (provider) {
      setupConnectEvents();
      provider.listAccounts().then((accounts) => {
        if (accounts.length > 0) {
          const sign = provider.getSigner();
          if (sign) {
            setSigner(sign);
            sign.getAddress().then((addr) => {
              setAddr(addr);
            });
          }
        }
      });
    }
  }, []);

  async function connectWallet() {
    if (provider && !signer) {
      provider
        .send("eth_requestAccounts", [])
        .then(() => {
          const sign = provider.getSigner();
          setSigner(sign);
          sign.getAddress().then((addr) => {
            setAddr(addr);
          });
        })
        .catch((err) => {
          console.log("There was a problem connecting the wallet", err);
        });
    } else {
      console.log("Cannot connect wallet, already connected");
    }
  }

  async function requestPersonalSign() {
    let res;
    if (provider) {
      if (addr) {
        console.log("Requesting personal signature");
        const message =
          "This message will be used to validate you are the email sender! " +
          Date.now();
        window.ethereum
          .request({
            method: "personal_sign",
            params: [message, addr],
          })
          .then((signature) => {
            console.log("Original address:", addr);
            console.log("Signed message:", signature);
            console.log(
              "Original address is proven to be the actual sender:",
              validatePersonalSign(addr, signature, message)
            );

            return [signature, message, addr];
          })
          .catch((err) => {
            console.log(
              "There was a problem retrieving the personal_sign",
              err
            );
          });
        return res;
      } else {
        console.log("Cannot request personal_sign without a connected wallet");
      }
    }
  }

  function validatePersonalSign(senderAddr, signature, originalMessage) {
    const recoveredAddr = ethers.utils.verifyMessage(
      originalMessage,
      signature
    );

    console.log("Recovered addr using ecrover:", recoveredAddr);

    return recoveredAddr === senderAddr;
  }

  function disconnectWallet() {
    setSigner(null);
    setAddr(null);
  }

  function setupConnectEvents() {
    if (provider) {
      provider.provider.on("accountsChanged", (code) => {
        const accountSwitch = code[0];
        if (accountSwitch) {
          const sign = provider.getSigner();
          setSigner(sign);
          sign.getAddress().then((addr) => {
            setAddr(addr);
          });
        } else {
          disconnectWallet();
        }
      });
    }
  }

  function connectToContract(contractAddr, contractABI) {
    return new ethers.Contract(contractAddr, contractABI, signer || provider);
  }

  return {
    signer,
    addr,
    connectWallet,
    requestPersonalSign,
    connectToContract,
  };
}
