import React from "react";
import PropTypes from "prop-types";
import { ExampleUI } from "./index";

const Emails = ({ data }) => {
  // console.log("rerendering", data);
  return (
    <>
      {data.map((index) => {
        return <ExampleUI key={index.createdAt} />;
      })}
    </>
  );
};

Emails.propTypes = { data: PropTypes.Array };

export default Emails;
