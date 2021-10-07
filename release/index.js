export { default as SendBirdProvider } from './SendbirdProvider.js';
export { default as App } from './App.js';
export { default as ChannelSettings } from './ChannelSettings.js';
export { default as ChannelList } from './ChannelList.js';
export { default as Channel, getAllEmojisFromEmojiContainer, getEmojiCategoriesFromEmojiContainer, getEmojisFromEmojiContainer } from './Channel.js';
import { S as SendbirdSdkContext } from './LocalizationContext-2d4f87f4.js';
export { g as getStringSet, w as withSendBird } from './LocalizationContext-2d4f87f4.js';
export { default as OpenChannel } from './OpenChannel.js';
export { default as OpenChannelSettings } from './OpenChannelSettings.js';
export { default as MessageSearch } from './MessageSearch.js';
export { s as sendBirdSelectors } from './index-6583a6eb.js';
import { useContext } from 'react';
import 'prop-types';
import 'sendbird';
import './actionTypes-a6a317df.js';
import 'css-vars-ponyfill';
import './index-b0596939.js';
import './LeaveChannel-abc8ae2a.js';
import './index-954a6f62.js';
import './index-e3cf037f.js';
import './utils-26586e9d.js';
import './index-99169460.js';
import './index-e2a8fee6.js';
import './index-566f58f7.js';
import './index-ec8d4560.js';
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
