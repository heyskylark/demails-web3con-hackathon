import React, { useState } from "react";
import { useOrbitDb } from "../../context/orbitDbContext";
import { message } from "antd";
import PropTypes from "prop-types";
import {
  MessageBoxContainer,
  MessageBoxTop,
  MessageBoxTopText,
  MessageBoxTopIcons,
  MessageBoxForm,
  MessageBoxInput,
  MessageTextarea,
  MessageBoxBottom,
  MessageSendButton,
  MessageSendButtonText,
  MessageSendButtonIcon,
  BottomLeftIcons,
  BottomRight,
  BottomRightIcons
} from "./message-box.styles";
import { useNavigate } from "react-router-dom";

const MessageBox = ({ showMessage, shouldMessageShow, addSent }) => {
  const orbitDb = useOrbitDb();

  let monthList = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec"
  ];
  const navigate = useNavigate();
  const formatDate = (item) => {
    if (item < 10) {
      return (item = `0${item}`);
    }
    return item;
  };

  let today = new Date();
  let date = formatDate(today.getDate());
  let month = monthList[today.getMonth()];
  let timeSent = `${month} ${date}`;
  // console.log(month);

  const [messageDetail, updateMessageDetail] = useState({
    to: "",
    subject: "",
    body: "",
    month: timeSent
  });
  const [expanded, setExpanded] = React.useState(false);

  const { to, subject, body } = messageDetail;

  // const [receiver, setTo] = useState("");
  // const [topic, setSubject] = useState("");
  // const [content, setBody] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    updateMessageDetail({ ...messageDetail, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // updateMessageDetail({
    //   to: receiver,
    //   subject: topic,
    //   body: content,
    // });

    console.log(messageDetail);
    if (to !== "" && body !== "" && subject !== "") {
      shouldMessageShow(true);
      addSent(messageDetail);
      const recieverAddr = to;
      const email = {
        to: [recieverAddr],
        subject,
        body
      };

      let res = await orbitDb.sendEmail(email);
      console.log(res);
      if (res) {
        message.success(res.reason);
      } else {
        message.error(res.reason);
      }
    }

    updateMessageDetail({
      to: "",
      subject: "",
      body: "",
      month: timeSent
    });
    handleClose();
  };

  // const handleChange = (event) => {
  //   // const { name, value } = event.target;

  //   updateMessageDetail({ [event.target.name]: event.target.value });
  // };

  const handleClose = () => {
    // shouldMessageShow(true);
    // updateMessageDetail({
    //   to: "",
    //   subject: "",
    //   body: "",
    //   month: timeSent,
    // });
    navigate(window.location.pathname);
  };

  return (
    <MessageBoxContainer expanded={expanded} showMessage={showMessage}>
      <MessageBoxTop>
        <MessageBoxTopText>New Message</MessageBoxTopText>
        <MessageBoxTopIcons>
          <i onClick={() => setExpanded((prev) => !prev)} className="fas fa-expand-alt"></i>
          <i className="fas fa-times close" onClick={handleClose}></i>
        </MessageBoxTopIcons>
      </MessageBoxTop>
      <MessageBoxForm onSubmit={handleSubmit}>
        <MessageBoxInput
          type="text"
          name="to"
          value={to}
          onChange={handleChange}
          placeholder="To"
          required
        />
        <MessageBoxInput
          type="text"
          name="subject"
          value={subject}
          onChange={handleChange}
          placeholder="Subject"
          required
        />
        <MessageTextarea name="body" value={body} onChange={handleChange} rows="15" required />

        <MessageBoxBottom>
          <MessageSendButton type="submit">
            <MessageSendButtonText>Send</MessageSendButtonText>
            <MessageSendButtonIcon>
              <i className="fas fa-caret-down"></i>
            </MessageSendButtonIcon>
          </MessageSendButton>
          <BottomLeftIcons
            src="https://www.gstatic.com/images/icons/material/system/1x/text_format_black_20dp.png"
            alt="icon"
          />

          <BottomLeftIcons
            src="https://www.gstatic.com/images/icons/material/system/1x/attach_file_black_20dp.png"
            alt="icon"
          />

          <BottomLeftIcons
            src="https://www.gstatic.com/images/icons/material/system/1x/insert_link_black_20dp.png"
            alt="icon"
          />

          <BottomLeftIcons
            src="https://www.gstatic.com/images/icons/material/system/1x/insert_emoticon_black_20dp.png"
            alt="icon"
          />

          <BottomLeftIcons
            src="https://www.gstatic.com/images/icons/material/system/1x/drive_black_20dp.png"
            alt="icon"
          />

          <BottomLeftIcons
            src="https://www.gstatic.com/images/icons/material/system/1x/insert_photo_black_20dp.png"
            alt="icon"
          />

          <BottomLeftIcons
            src="https://www.gstatic.com/images/icons/material/system/1x/lock_clock_black_20dp.png"
            alt="icon"
          />
          <BottomRight>
            <BottomRightIcons
              src="https://www.gstatic.com/images/icons/material/system/1x/more_vert_black_20dp.png"
              alt="icon"
            />

            <BottomRightIcons
              src="https://www.gstatic.com/images/icons/material/system/1x/delete_black_20dp.png"
              alt="icon"
            />
          </BottomRight>
        </MessageBoxBottom>
      </MessageBoxForm>
    </MessageBoxContainer>
  );
};

MessageBox.propTypes = {
  // You can declare that a prop is a specific JS primitive. By default, these
  // are all optional.
  showMessage: PropTypes.bool,
  shouldMessageShow: PropTypes.func,
  addSent: PropTypes.func
};
export default MessageBox;
