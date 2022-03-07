import React from "react";
import { Helmet } from "react-helmet";
import { useOrbitDb } from "../context/orbitDbContext";
import Emails from "./Emails";
import { ExampleUI } from "./index";
const Home = () => {
  const orbitDb = useOrbitDb();
  const [emails, setEmails] = React.useState([]);

  React.useEffect(() => {
    console.log(orbitDb);
    let mails = orbitDb.emails;
    if (Array.isArray(mails)) {
      mails.shift();
      console.log(mails);
      setEmails(mails);
    } else {
      setEmails([]);
    }
  }, [orbitDb]);

  return (
    <div className="ant-mail-cover">
      <Helmet>
        <title>loggedin | emailDAO</title>
      </Helmet>
      {JSON.stringify(emails)}

      <Emails data={emails} />
    </div>
  );
};

export default Home;
