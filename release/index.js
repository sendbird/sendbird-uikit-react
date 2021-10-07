export { default as SendBirdProvider } from './SendbirdProvider.js';
export { default as App } from './App.js';
export { default as ChannelSettings } from './ChannelSettings.js';
export { default as ChannelList } from './ChannelList.js';
export { default as Channel, getAllEmojisFromEmojiContainer, getEmojiCategoriesFromEmojiContainer, getEmojisFromEmojiContainer } from './Channel.js';
import { S as SendbirdSdkContext } from './LocalizationContext-d32ae268.js';
export { g as getStringSet, w as withSendBird } from './LocalizationContext-d32ae268.js';
export { default as OpenChannel } from './OpenChannel.js';
export { default as OpenChannelSettings } from './OpenChannelSettings.js';
export { default as MessageSearch } from './MessageSearch.js';
export { s as sendBirdSelectors } from './index-9894e059.js';
import { useContext } from 'react';
import 'prop-types';
import 'sendbird';
import './actionTypes-0bbd0801.js';
import 'css-vars-ponyfill';
import './index-2e1bdf64.js';
import './LeaveChannel-6c8a03d6.js';
import './index-15d79465.js';
import './index-d3c84a23.js';
import './utils-2c62e3a6.js';
import './index-8b10d663.js';
import './index-a98aa91d.js';
import './index-9132a6fb.js';
import './index-06a057e4.js';
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
