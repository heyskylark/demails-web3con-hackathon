import React from "react";
import { Helmet } from "react-helmet";
import { useOrbitDb } from "../context/orbitDbContext";
import Emails from "./Emails";
import { Button } from "antd";
import { ExampleUI } from "./index";
const Home = () => {
  const orbitDb = useOrbitDb();
  const [emails, setEmails] = React.useState([]);

  React.useEffect(() => {
    orbitDb.getMyInbox(orbitDb.inboxAddr);
    let mails = orbitDb.emails;
    if (Array.isArray(mails)) {
      console.log("Mails", mails);
      // mails.shift(); 
      setEmails(mails);
    } else {
      setEmails([]);
    }
  }, []);

  function refresh() {
    orbitDb.getMyInbox(orbitDb.inboxAddr);
    setEmails(orbitDb.emails)
  }

  return (
    <div className="ant-mail-cover">
      <Helmet>
        <title>loggedin | emailDAO</title>
      </Helmet>
      <Button onClick={refresh}>refresh</Button>

      <Emails data={emails} />
    </div>
  );
};

export default Home;
