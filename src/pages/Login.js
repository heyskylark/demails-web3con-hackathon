import { useEthersProvider } from "../context/providerContext.js";
import PropTypes from "prop-types";
import { useOrbitDb } from "../context/orbitDbContext";
import { Button } from "antd";
import React from "react";
import Home from "../components/Home";
import OpenRouteTemplate from "../routes/openRoutes/OpenRouteTemplate";
//3rd-party impprts
import Typewriter from "typewriter-effect";
import { Typography } from "antd";

const { Text } = Typography;

function Type({ text }) {
  return (
    <Typewriter
      options={{
        strings: [text],
        autoStart: true,
        loop: true,
        deleteSpeed: 10
      }}
    />
  );
}
Type.propTypes = { text: PropTypes.string };

function Login() {
  const provider = useEthersProvider();
  const orbitDb = useOrbitDb();

  function walletConnectComponent() {
    return (
      <>
        <OpenRouteTemplate>
          <h1>
            Hi,connect to your wallet ! <span className="wave">👋🏻</span>{" "}
          </h1>
          <h4 type="secondary">
            <Type text="To access your private message you have to connect to your favorite wallet." />
          </h4>
          <Button onClick={provider.connectWallet}>Press to connect!</Button>
        </OpenRouteTemplate>
      </>
    );
  }
  function initInboxButton() {
    console.log("initiated");
    if (!orbitDb.inbox) {
      console.log("initiated orbit", orbitDb);
      return (
        <OpenRouteTemplate>
          <Button onClick={orbitDb.initInbox}>Init Inbox</Button>
        </OpenRouteTemplate>
      );
    } else {
      console.log("else initiated orbit");

      return (
        <>
          <Home />{" "}
        </>
      );
    }
  }

  function renderLogin() {
    if (!orbitDb.inbox) {
      return initInboxButton();
    }

    if (provider.addr) {
      return <Home />;
    } else {
      return walletConnectComponent();
    }
  }

  return <>{renderLogin()}</>;
}

export default Login;
