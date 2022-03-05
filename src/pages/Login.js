import { useEthersProvider } from "../context/providerContext.js";

function Login() {
  const provider = useEthersProvider();

  function walletConnectComponent() {
    return <button onClick={provider.connectWallet}>Press to connect!</button>;
  }

  function connectedComponent() {
    return (
      <div>
        <p>{provider.addr}</p>
        <button onClick={provider.requestPersonalSign}>
          Request personal_sign
        </button>
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
