import { useEthersProvider } from "../context/providerContext.js";
import { useOrbitDb } from "../context/orbitDbContext";
import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const provider = useEthersProvider();
  const orbitDb = useOrbitDb();
  const navigate = useNavigate();
  function walletConnectComponent() {
    return <Button onClick={provider.connectWallet}>Press to connect!</Button>;
  }

  function initInboxButton() {
    if (!orbitDb.inbox) {
      return <Button onClick={orbitDb.initInbox}>Init Inbox</Button>;
    } else {
      navigate("/logged-in/inbox");
    }
  }

  function connectedComponent() {
    const inboxAddr = orbitDb.inboxAddr ? orbitDb.inboxAddr : "None";
    return (
      <>
        <p>Wallet Address: {provider.addr}</p>
        <p>Mailbox OrbitDb Address: {inboxAddr}</p>
        {initInboxButton()}
      </>
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
