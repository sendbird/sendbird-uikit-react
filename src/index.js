// sendbird provider component to handle sdk connection and data
export SendbirdProvider from './lib/Sendbird';

// complete app component - If user wants an out of the box solution
export App from './smart-components/App/index';

// Individual smart components
export ChannelSettings from './smart-components/ChannelSettings';
export ChannelList from './smart-components/ChannelList';
export Channel from './smart-components/Channel';
export getStringSet from './ui/Label/stringSet';
export OpenChannel from './smart-components/OpenChannel';
export OpenChannelSettings from './smart-components/OpenChannelSettings';
export MessageSearch from './smart-components/MessageSearch';

// HOC for using ui-kit state
// withBird(MyCustomComponent) will give the sendbird state as props to MyCustomComponent
export withSendbird from './lib/SendbirdSdkContext';
export sendbirdSelectors from './lib/selectors';
export useSendbirdStateContext from './hooks/useSendbirdStateContext';
