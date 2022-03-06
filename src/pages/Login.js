import { useEthersProvider } from '../context/providerContext.js';
import { useOrbitDb } from '../context/orbitDbContext';
import { Button } from 'antd';

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

  function connectedComponent() {
    const inboxAddr = orbitDb.inbox ? orbitDb.inbox.address.toString() : 'None';
    return (
      <div>
        <p>Wallet Address: {provider.addr}</p>
        <p>Mailbox OrbitDb Address: {inboxAddr}</p>
        <Button onClick={provider.requestPersonalSign}>Request personal_sign</Button>
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
