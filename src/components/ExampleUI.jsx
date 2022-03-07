import React from "react";
import { Skeleton, Switch, Card, Avatar, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Button, Tooltip } from "antd";
import { SearchOutlined, StarFilled, StarOutlined } from "@ant-design/icons";

const { Paragraph, Text, Title } = Typography;
const { Meta } = Card;

const ExampleUI = ({ data }) => {
  console.log(data);
  const navigate = useNavigate();
  let date = new Date();
  date.setTime(data?.createdAt);

  const handleClick = React.useCallback(() => {
    navigate(window.location.pathname + "/" + data?.id);
  }, []);

  return (
    <Card onClick={handleClick} hoverable>
      <Skeleton style={{ display: "flex", flexDirection: "row" }} loading={false} avatar active>
        <Meta
          avatar={
            <Avatar
              style={{
                verticalAlign: "middle"
              }}
              size="large"
              gap={4}>
              AB
            </Avatar>
          }
          title={
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <div
                style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    marginLeft: "10px"
                  }}>
                  <Title
                    style={{
                      margin: "0px"
                    }}
                    level={3}>
                    {data?.subject}
                  </Title>
                  <Text type="secondary">from {data?.from}</Text>
                </div>
              </div>
              <Text type="secondary">
                {new Date(date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </Text>
            </div>
          }
          description={
            <>
              <div style={{ display: "flex", flexDirection: "row" }} className="">
                <Text ellipsis style={{ width: "100%" }}>
                  {data?.body}
                </Text>
                {/* <StarOutlined style={{ color: "yellow", fontSize: "1.2rem" }} />{" "} */}
                <StarFilled style={{ color: "yellow", fontSize: "1.2rem", marginLeft: 12 }} />
              </div>
            </>
          }
        />
      </Skeleton>
    </Card>
  );
};

ExampleUI.propTypes = {
  data: PropTypes.object
};

export default ExampleUI;
