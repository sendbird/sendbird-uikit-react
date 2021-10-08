// sendbird provider component to handle sdk connection and data
export SendBirdProvider from './lib/Sendbird';

// complete app component - If user wants an out of the box solution
export App from './smart-components/App/index';

// Sendbird individual smart components
// export ChannelSettings from './smart-components/ChannelSettings';
// export ChannelList from './smart-components/ChannelList';
// export Channel, {
//   getEmojiCategoriesFromEmojiContainer,
//   getAllEmojisFromEmojiContainer,
//   getEmojisFromEmojiContainer,
// } from './smart-components/Conversation';
// export getStringSet from './ui/Label/stringSet';
// export OpenChannel from './smart-components/OpenchannelConversation';
// export OpenChannelSettings from './smart-components/OpenChannelSettings';
// export MessageSearch from './smart-components/MessageSearch';

// HOC for using ui-kit state
// withBird(MyCustomComponent) will give the sendbird state as props to MyCustomComponent
export withSendBird from './lib/SendbirdSdkContext';
export sendBirdSelectors from './lib/selectors';
export useSendbirdStateContext from './hooks/useSendbirdStateContext';

// Ruangguru's modified comopnent
export Channel from './rogu/smart-components/Conversation';
