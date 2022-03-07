import React from "react";
import PropTypes from "prop-types";
import { ExampleUI } from "./index";

const Emails = ({ data }) => {
  console.log("rerendering", data);
  return (
    <>
      {JSON.stringify(data)}
      {data.map((index) => {
        console.log(index);
        return <ExampleUI key={index.createdAt} />;
      })}
    </>
  );
};

Emails.propTypes = { data: PropTypes.Array };

export default Emails;
