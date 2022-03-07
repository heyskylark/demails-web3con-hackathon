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
          <p
            style={{
              "margin-top": "10px"
            }}
          >Polygon Mumbai: 0xcAac6E79b814c46A019A29784840A187DECc2478</p>
        </div>
      </div>
    </>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.node
};
