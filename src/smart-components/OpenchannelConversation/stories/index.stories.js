import React, { useState } from 'react';
import Sendbird from '../../../lib/Sendbird';
import OpenchannelConversation from '../index';
import { MenuRoot } from '../../../ui/ContextMenu';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import sendbirdSelectors from '../../../lib/selectors';

export default { title: 'OpenChannel' };

const appId = process.env.STORYBOOK_APP_ID;
const userId = 'hoon002';

export const defaultConversation = () => {
  return (
    <Sendbird
      appId={appId}
      userId={userId}
      config={{ logLevel: 'all' }}
    >
      <div style={{ height: '90vh' }}>
        <OpenchannelConversation
          // channelUrl="sendbird_open_channel_63320_46eece3fc56ca57374420c6cfc3c5bd7b2cd64b9"
          channelUrl="sendbird_open_channel_63320_f89be4498288aaca2d1aacda7f3f7351b679d1f3"
        />
      </div>
      <MenuRoot />
    </Sendbird>
  );
};

const CustomInput = (params) => {
  const { channel } = params;
  const [inputText, setInputText] = useState("");
  const context = useSendbirdStateContext();
  const sdk = sendbirdSelectors.getSdk(context);
  const sendUserMessage = sendbirdSelectors.getOpenChannelSendUserMessage(context);

  return (
    <div>
      <input value={inputText} onChange={(event) => {
        setInputText(event.target.value);
      }}/>
      <button onClick={() => {
        const params = new sdk.UserMessageParams();
        params.message = inputText;
        sendUserMessage(channel.url, params)
          .then((message) => {
            console.log(message);
            setInputText("");
          })
          .catch((error) => {
            console.log(error.message);
          });
      }}>send</button>
    </div>
  );
}

export const RenderCustomMessage = () => {
  return (
    <Sendbird
      appId={appId}
      userId={userId}
      config={{ logLevel: 'all' }}
    >
      <div style={{ height: '90vh' }}>
        <OpenchannelConversation
          // channelUrl="sendbird_open_channel_63320_46eece3fc56ca57374420c6cfc3c5bd7b2cd64b9"
          channelUrl="sendbird_open_channel_63320_f89be4498288aaca2d1aacda7f3f7351b679d1f3"
          renderCustomMessage={(message, channel) => {
            if (message.messageType === 'user') {
              return () => (
                <div style={{ color: 'red' }}>{message.message}</div>
              )
            }
          }}
          renderMessageInput={(props) => {
            return (<CustomInput {...props} />);
          }}
        />
      </div>
      <MenuRoot />
    </Sendbird>
  );
};

// If you want to see place holders activate _isLoading and _isInvalid props
export const placeHolders = () => {
  return [
    <Sendbird
      appId={appId}
      userId={userId}
    >
      <div style={{ height: '90vh' }}>
        <OpenchannelConversation
          channelUrl=''
        />
      </div>
    </Sendbird>,
  ]
};
