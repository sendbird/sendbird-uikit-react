export { default as SendBirdProvider } from './SendbirdProvider.js';
export { default as App } from './App.js';
export { default as ChannelSettings } from './ChannelSettings.js';
export { default as ChannelList } from './ChannelList.js';
export { default as Channel, getAllEmojisFromEmojiContainer, getEmojiCategoriesFromEmojiContainer, getEmojisFromEmojiContainer } from './Channel.js';
import { S as SendbirdSdkContext } from './LocalizationContext-2964ce67.js';
export { g as getStringSet, w as withSendBird } from './LocalizationContext-2964ce67.js';
export { default as OpenChannel } from './OpenChannel.js';
export { default as OpenChannelSettings } from './OpenChannelSettings.js';
export { default as MessageSearch } from './MessageSearch.js';
export { s as sendBirdSelectors } from './index-cab174e1.js';
import { useContext } from 'react';
import 'prop-types';
import 'sendbird';
import './actionTypes-b7772350.js';
import 'css-vars-ponyfill';
import './index-5d0084ca.js';
import './LeaveChannel-59767525.js';
import './index-5e8200c2.js';
import './index-98351101.js';
import './utils-ac602156.js';
import './index-387a97fa.js';
import './index-82a5fcd2.js';
import './index-f310aed8.js';
import './index-83043401.js';
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
