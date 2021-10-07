export { default as SendBirdProvider } from './SendbirdProvider.js';
export { default as App } from './App.js';
export { default as ChannelSettings } from './ChannelSettings.js';
export { default as ChannelList } from './ChannelList.js';
export { default as Channel, getAllEmojisFromEmojiContainer, getEmojiCategoriesFromEmojiContainer, getEmojisFromEmojiContainer } from './Channel.js';
import { S as SendbirdSdkContext } from './LocalizationContext-0bd08445.js';
export { g as getStringSet, w as withSendBird } from './LocalizationContext-0bd08445.js';
export { default as OpenChannel } from './OpenChannel.js';
export { default as OpenChannelSettings } from './OpenChannelSettings.js';
export { default as MessageSearch } from './MessageSearch.js';
export { s as sendBirdSelectors } from './index-1e7efcaa.js';
import { useContext } from 'react';
import 'prop-types';
import 'sendbird';
import './actionTypes-923abee8.js';
import 'css-vars-ponyfill';
import './index-f1fc6f50.js';
import './LeaveChannel-7e01fdfa.js';
import './index-61bf322a.js';
import './index-f57972db.js';
import './utils-895e86c1.js';
import './index-fb132cac.js';
import './index-37b0fed9.js';
import './index-10bc8098.js';
import './index-751b6685.js';
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
