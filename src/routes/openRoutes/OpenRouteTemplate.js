//3rd-party impprts
import PropTypes from "prop-types";
import Typewriter from "typewriter-effect";
import { Typography } from "antd";
import { Particles } from "../../components";
import polygon from "../../polygon.svg";

const { Text } = Typography;

function Type() {
  return (
    <Typewriter
      options={{
        strings: ["To access your private message you have to connect to your favorite wallet."],
        autoStart: true,
        loop: true,
        deleteSpeed: 10
      }}
    />
  );
}

export default function AuthLayout(props) {
  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          position: "relative"
        }}
        className="Signin">
        <Particles />
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            width: "100%",
            height: "100%"
          }}>
          {props.children}
          <img
            style={{
              position: "absolute",
              bottom: "30px",
              right: "30px",
              zIndex: 5,
              width: "200px"
            }}
            src={polygon}
            alt=""
          />
        </div>
      </div>
    </>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.node
};
