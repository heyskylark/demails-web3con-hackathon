import React from "react";
import PropTypes from "prop-types";
import ExampleUI from "./ExampleUI";

const Emails = ({ data }) => {
  console.log("rerendering", data);
  return (
    <>
      {data.map((email) => {
        return <ExampleUI key={email.createdAt} data={email} />;
      })}
    </>
  );
};

Emails.propTypes = { data: PropTypes.Array };

export default Emails;
