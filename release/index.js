export { default as SendBirdProvider } from './SendbirdProvider.js';
export { default as App } from './App.js';
export { default as ChannelSettings } from './ChannelSettings.js';
export { default as ChannelList } from './ChannelList.js';
export { default as Channel, getAllEmojisFromEmojiContainer, getEmojiCategoriesFromEmojiContainer, getEmojisFromEmojiContainer } from './Channel.js';
import { S as SendbirdSdkContext } from './LocalizationContext-c5768cf7.js';
export { g as getStringSet, w as withSendBird } from './LocalizationContext-c5768cf7.js';
export { default as OpenChannel } from './OpenChannel.js';
export { default as OpenChannelSettings } from './OpenChannelSettings.js';
export { default as MessageSearch } from './MessageSearch.js';
export { s as sendBirdSelectors } from './index-d9082a0a.js';
import { useContext } from 'react';
import 'prop-types';
import 'sendbird';
import './actionTypes-2f8cdcc4.js';
import 'css-vars-ponyfill';
import './index-6a3b6a4c.js';
import './LeaveChannel-4f2b02e7.js';
import './index-106dae14.js';
import './index-f6b9f869.js';
import './utils-69421060.js';
import './index-5a627a4a.js';
import './index-fd477f81.js';
import './index-3556a313.js';
import './index-a2f7db5e.js';
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
