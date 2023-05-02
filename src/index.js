// sendbird provider component to handle sdk connection and data
export SendBirdProvider from './lib/Sendbird';

// complete app component - If user wants an out of the box solution
export App from './modules/App/index';

// Individual smart components
export ChannelSettings from './modules/ChannelSettings';
export ChannelList from './modules/ChannelList';
export Channel from './modules/Channel';
export getStringSet from './ui/Label/stringSet';
export OpenChannel from './modules/OpenChannel';
export OpenChannelSettings from './modules/OpenChannelSettings';
export MessageSearch from './modules/MessageSearch';

// HOC for using ui-kit state
// withBird(MyCustomComponent) will give the sendbird state as props to MyCustomComponent
export withSendBird from './lib/SendbirdSdkContext';
export sendbirdSelectors from './lib/selectors';
// for legacy parity, slowly remove
export sendBirdSelectors from './lib/selectors';
export useSendbirdStateContext from './hooks/useSendbirdStateContext';
