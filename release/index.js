export { default as SendBirdProvider } from './SendbirdProvider.js';
export { default as App } from './App.js';
export { default as ChannelSettings } from './ChannelSettings.js';
export { default as ChannelList } from './ChannelList.js';
export { default as Channel, getAllEmojisFromEmojiContainer, getEmojiCategoriesFromEmojiContainer, getEmojisFromEmojiContainer } from './Channel.js';
import { S as SendbirdSdkContext } from './LocalizationContext-73398a14.js';
export { g as getStringSet, w as withSendBird } from './LocalizationContext-73398a14.js';
export { default as OpenChannel } from './OpenChannel.js';
export { default as OpenChannelSettings } from './OpenChannelSettings.js';
export { default as MessageSearch } from './MessageSearch.js';
export { s as sendBirdSelectors } from './index-516d7fed.js';
import { useContext } from 'react';
import 'prop-types';
import 'sendbird';
import './actionTypes-9fa2c873.js';
import 'css-vars-ponyfill';
import './index-c5ac5612.js';
import './LeaveChannel-d1c7c62f.js';
import './index-a7d2d399.js';
import './index-e4487fe8.js';
import './utils-0de3e9d3.js';
import './index-82155b40.js';
import './index-072b7c41.js';
import './index-b3c5f5b9.js';
import './index-260054d5.js';
import 'react-dom';

/**
 * Example:
 * const MyComponent = () => {
 *  const context = useSendbirdStateContext();
 *  const sdk = sendbirdSelectors.getSdk(context);
 *  return (<div>...</div>);
 * }
 */

function useSendbirdStateContext() {
  var context = useContext(SendbirdSdkContext);
  return context;
}

export { useSendbirdStateContext };
//# sourceMappingURL=index.js.map
