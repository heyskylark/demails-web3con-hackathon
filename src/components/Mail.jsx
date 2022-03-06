import React from 'react';
import { Skeleton, Switch, Card, Avatar, Typography } from 'antd';
import { Button, Tooltip } from 'antd';
import { SearchOutlined, StarFilled, StarOutlined } from '@ant-design/icons';

const { Meta } = Card;
const { Paragraph, Text, Title } = Typography;

const Mail = () => {
  return (
    <Card
      title={
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Avatar
              style={{
                verticalAlign: 'middle'
              }}
              size="large"
              gap={4}>
              AB
            </Avatar>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                marginLeft: '10px'
              }}>
              <Title
                style={{
                  margin: '0px'
                }}
                level={3}>
                Darrell Steward
              </Title>
              <Text type="secondary">To me, Tom, Jenny</Text>
            </div>
          </div>
          <Text type="secondary">
            {new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        </div>
      }>
      <Skeleton style={{ display: 'flex', flexDirection: 'row' }} loading={false} avatar active>
        SPAs were a mistake Chris Ferdinandi: For years, a trend in our industry has been to build
        single-page apps, or SPAs. With an SPA, the entire site or app lives in a single HTML file.
        After the initial load, everything about the app is handled with JavaScript. This is, in
        theory, supposed to result in web apps that feel as fast and snappy as native apps. Today, I
        want to explore why that’s nonsense. Let’s dig in! I built one of the first big SPAs
        (remember Grooveshark?), but I’ve shied away from them ever since. I do think there are
        cases when they make sense (Trello and GMail come to mind), but overall I think too many
        people chose the architecture too many times because it was the it thing to do vs it was
        actually the best decision for their circumstance. Heck, even Chris’s disclaimer of ‘when
        SPAs make sense’ section at the top is easily defeated by our Turbolinks implementation. But
        I digress… read this post it’s a good one for sure.
      </Skeleton>
    </Card>
  );
};

export default Mail;
