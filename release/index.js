export { default as SendBirdProvider } from './SendbirdProvider.js';
export { default as App } from './App.js';
export { default as ChannelSettings } from './ChannelSettings.js';
export { default as ChannelList } from './ChannelList.js';
export { default as Channel, getAllEmojisFromEmojiContainer, getEmojiCategoriesFromEmojiContainer, getEmojisFromEmojiContainer } from './Channel.js';
import { S as SendbirdSdkContext } from './LocalizationContext-67c61679.js';
export { g as getStringSet, w as withSendBird } from './LocalizationContext-67c61679.js';
export { default as OpenChannel } from './OpenChannel.js';
export { default as OpenChannelSettings } from './OpenChannelSettings.js';
export { default as MessageSearch } from './MessageSearch.js';
export { s as sendBirdSelectors } from './index-4aa4bd3d.js';
import { useContext } from 'react';
import 'prop-types';
import 'sendbird';
import './actionTypes-5adc8175.js';
import 'css-vars-ponyfill';
import './index-9c03380e.js';
import './LeaveChannel-f1ee06cf.js';
import './index-58bfa752.js';
import './index-79e9a805.js';
import './utils-449086f0.js';
import './index-1741f6e9.js';
import './index-f3c95fe9.js';
import './index-73f2c651.js';
import './index-73dad2df.js';
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
