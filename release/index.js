export { default as SendBirdProvider } from './SendbirdProvider.js';
export { default as App } from './App.js';
export { default as ChannelSettings } from './ChannelSettings.js';
export { default as ChannelList } from './ChannelList.js';
export { default as Channel, getAllEmojisFromEmojiContainer, getEmojiCategoriesFromEmojiContainer, getEmojisFromEmojiContainer } from './Channel.js';
import { S as SendbirdSdkContext } from './LocalizationContext-8085129b.js';
export { g as getStringSet, w as withSendBird } from './LocalizationContext-8085129b.js';
export { default as OpenChannel } from './OpenChannel.js';
export { default as OpenChannelSettings } from './OpenChannelSettings.js';
export { default as MessageSearch } from './MessageSearch.js';
export { s as sendBirdSelectors } from './index-df698c9f.js';
import { useContext } from 'react';
import 'prop-types';
import 'sendbird';
import './actionTypes-7d93f844.js';
import 'css-vars-ponyfill';
import './index-48d5c9c0.js';
import './LeaveChannel-561b8221.js';
import './index-5f3989d7.js';
import './index-b70b7167.js';
import './utils-2cd43fd6.js';
import './index-3a12c1a6.js';
import './index-3b100be7.js';
import './index-e461cf96.js';
import './index-3e92ae87.js';
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
