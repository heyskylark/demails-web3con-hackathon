import React from "react";
import { Skeleton, Switch, Card, Avatar, Typography } from "antd";
import { Button, Tooltip } from "antd";
import { SearchOutlined, StarFilled, StarOutlined } from "@ant-design/icons";

const { Meta } = Card;
const { Paragraph, Text } = Typography;

const ExampleUI = () => {
  return (
    <Card hoverable>
      <Skeleton style={{ display: "flex", flexDirection: "row" }} loading={false} avatar active>
        <Meta
          avatar={
            <Avatar
              style={{
                verticalAlign: "middle",
              }}
              size="large"
              gap={4}
            >
              AB
            </Avatar>
          }
          title="Card title"
          description={
            <>
              <div style={{ display: "flex", flexDirection: "row" }} className="">
                <Text ellipsis style={{ width: "100%" }}>
                  Ant Design, a design language for background applications, is refined by Ant UED Team. Ant Design, a
                  Ant Design, a design language for background applications, is refined by Ant UED Team. Ant Design, a
                  Ant Design, a design language for background applications, is refined by Ant UED Team. Ant Design, a
                  Ant Design, a design language for background applications, is refined by Ant UED Team. Ant Design, a
                  Ant Design, a design language for background applications, is refined by Ant UED Team. Ant Design, a
                  Ant Design, a design language for background applications, is refined by Ant UED Team. Ant Design, a
                  Ant Design, a design language for background applications, is refined by Ant UED Team. Ant Design, a
                  Ant Design, a design language for background applications, is refined by Ant UED Team. Ant Design, a
                  Ant Design, a design language for background applications, is refined by Ant UED Team. Ant Design, a
                  Ant Design, a design language for background applications, is refined by Ant UED Team. Ant Design, a
                  design Team. design Team. design Team.
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

export default ExampleUI;
