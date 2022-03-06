import React from "react";
import { useEthersProvider } from "../context/providerContext.js";
import { useOrbitDb } from "../context/orbitDbContext";

function Login() {
  const provider = useEthersProvider();
  const orbitDb = useOrbitDb();

  function walletConnectComponent() {
    return <button onClick={provider.connectWallet}>Press to connect!</button>;
  }
  const handleRequestPersonalSign = React.useCallback(async () => {
    const res = await provider.requestPersonalSign();
    console.log(res);
    console.log(window);
    if (res) {
      const isValidSignature = await provider.validatePersonalSign(
        res[2],
        res[0],
        res[1]
      );
      console.log(isValidSignature);
      if (isValidSignature) {
        console.log(window);
        // eslint-disable-next-line
        sessionStorage.setItem("lastSessionSignedIn", true);
      }
    }
  }, [provider]);

  function initInboxButton() {
    if (!orbitDb.inbox) {
      return <button onClick={orbitDb.initInbox}>Init Inbox</button>;
    }
  }

  function connectedComponent() {
    const inboxAddr = orbitDb.inbox ? orbitDb.inbox.address.toString() : "None";
    return (
      <div>
        <p>Wallet Address: {provider.addr}</p>
        <p>Mailbox OrbitDb Address: {inboxAddr}</p>
        <button onClick={provider.requestPersonalSign}>
          Request personal_sign
        </button>
        {initInboxButton()}
      </div>
    );
  }

  function renderLogin() {
    if (provider.signer) {
      return connectedComponent();
    } else {
      return walletConnectComponent();
    }
  }

  return <div>{renderLogin()}</div>;
}

export default Login;
