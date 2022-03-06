import React from "react";
import { useEthersProvider } from "../context/providerContext.js";

function Login() {
  const provider = useEthersProvider();
  // eslint-disable-next-line
  sessionStorage.setItem("DFgfg", 5645);

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
  function connectedComponent() {
    return (
      <div>
        <p>{provider.addr}</p>
        <button onClick={handleRequestPersonalSign}>
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
