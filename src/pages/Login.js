import { useEthersProvider } from "../context/providerContext.js";
import { useOrbitDb } from "../context/orbitDbContext";
import { Button } from "antd";
import React from "react";

function Login() {
  const provider = useEthersProvider();
  const orbitDb = useOrbitDb();

  function walletConnectComponent() {
    return <Button onClick={provider.connectWallet}>Press to connect!</Button>;
  }

  function initInboxButton() {
    if (!orbitDb.inbox) {
      return <Button onClick={orbitDb.initInbox}>Init Inbox</Button>;
    }
  }

  function sendEmailButtonClick() {
    const recieverAddr = "0x24b9a28CCfa9F4c1f3B8758155dEF332f85026de";
    const email = {
      to: [recieverAddr],
      subject: "This is a test email",
      body: "Hello, I am sending a test email. Love Skylark"
    }

    orbitDb.sendEmail(email)
  }

  function testSendEmail() {
    if (orbitDb.inbox) {
      return (
        <>
          <Button onClick={sendEmailButtonClick}>Test sending email</Button>
        </>
      );
    }
  }

  const handleRequestPersonalSign = React.useCallback(async () => {
    const res = await provider.requestPersonalSign();
    console.log(res);
    console.log(window);
    if (res) {
      const isValidSignature = await provider.validatePersonalSign(res[2], res[0], res[1]);
      console.log(isValidSignature);
      if (isValidSignature) {
        console.log(window);
        // eslint-disable-next-line
        sessionStorage.setItem("lastSessionSignedIn", true);
      }
    }
  }, [provider]);

  function connectedComponent() {
    const inboxAddr = orbitDb.inbox ? orbitDb.inbox.address.toString() : "None";
    return (
      <div>
        <p>Wallet Address: {provider.addr}</p>
        <p>Mailbox OrbitDb Address: {inboxAddr}</p>
        <Button onClick={provider.requestPersonalSign}>Request personal_sign</Button>
        {initInboxButton()}
        {testSendEmail()}
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
