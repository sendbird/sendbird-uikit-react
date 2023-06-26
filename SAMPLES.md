# Sendbird UIKit for React samples

![Platform](https://img.shields.io/badge/platform-JAVASCRIPT-orange.svg)
![Languages](https://img.shields.io/badge/language-JAVASCRIPT-orange.svg)
[![npm](https://img.shields.io/npm/v/sendbird.svg?style=popout&colorB=red)](https://www.npmjs.com/package/sendbird)

Sendbird UIKit for React is a development kit with an user interface that enables an easy and fast integration of standard chat features into new or existing client apps.

### More about Sendbird UIKit for React

Find out more about Sendbird UIKit for React at [UIKit for React doc](https://sendbird.com/docs/uikit/v3/react/overview). If you need any help in resolving any issues or have questions, visit [our community](https://community.sendbird.com).

<br />

> Some default attributes of Sendbird's application have been changed, so you might have to check below.
> <br /><br />allow_user_list_from_sdk: off
> <br />allow_user_update_from_sdk: on
> <br />allow_open_channel_create_from_sdk: on
> <br />allow_group_channel_create_from_sdk: on
> <br /><br />In order to use the API, the option must be turned on in the dashboard.

<br />

## UIKit components and ways to customize

These samples are here to help you better understand UIKit for React by going over the core components and ways to customize. On each core component sample, there is an attached StackBlitz link in which you can see the sample codes and alter them to see how the changes are rendered.

<br />

## Before getting started

This section shows you what you need for testing Sendbird UIKit sample app for React sample app.

### Requirements

The minimum requirements for UIKit for React are:

- React 16.8.0+
- React DOM 16.8.0+
- @sendbird/chat v4
- css-vars-ponyfill 2.3.2
- date-fns 2.16.1

### Implement Chat with App component

The `App` component is a collection of all UIKit components you need to implement chat. This is included in all core component samples, so be sure to set your own APP_ID, USER_ID, and NICKNAME in `const.js` in each to customize your sample. On the [StackBlitz](https://stackblitz.com/edit/sendbird-react-uikit-v3-base-app) link, you will see that the props of the `App` component refer to use the values of the correspondings of `const.js` for initialization.

Try setting your own by downloading the Sendbird sample.

```javascript
import SendbirdApp from '@sendbird/uikit-react/App';
```

### Import components to customize UIKit

Here is a list of the essential components that you need to import before you start customizing chat. Note that the names of the components are changed as shown in the code below.

Try [importing components on CodeSandbox](https://codesandbox.io/s/1-2-customization-basic-format-9skqq3).

```javascript
import SBConversation from '@sendbird/uikit-react/Channel';
import SBChannelList from '@sendbird/uikit-react/ChannelList';
import SBChannelSettings from '@sendbird/uikit-react/ChannelSettings';
import withSendBird from '@sendbird/uikit-react/withSendbird';
```

### Referring to CodeSandbox

Each CodeSandbox sample has `App.js` and `CustomizedApp.js` which operate based on the imported `const.js`. CodeSandbox is a code editor that provides an instant live preview. The preview has two buttons placed at the top center. If you click the left button, you will see unaltered `App.js`. If you click the right button, you will see the customized component from `CustomizedApp.js`, and any changes you make on them applied and rendered on the live preview.

If you would like to get a deeper understanding of how CodeSandbox works, refer to **CustomizedMessageItems**, **CustomizedHeader**, **CustomizedMessageInput**, and **CustomizedChannelPreviewItem** which you can find on corresponding CodeSandbox samples.

<br />

## Getting Started

This section explains what you need to know before testing the sample app.

### Message item

The **renderChatItem** is a `ReactElement` prop in the Channel component which you can use to customize `message` by setting a function. This prop provides three arguments: **message**, **onUpdateMessage**, and **onDeleteMessage**. The **message** represents an already sent or received message of an `BaseMessage` object; **onUpdateMessage** and **onDeleteMessage** are callback functions which you can implement with custom code for events related to the corresponding user actions.

Try your [message item on CodeSandbox](https://codesandbox.io/s/2-1-customizing-messageitem-q38cg5).

```javascript
<Channel
    renderChatItem={({
        message,
        onDeleteMessage,
        onUpdateMessage,
        onResendMessage,
        emojiContainer,
    }) => {
        <CustomizedMessageItem />
    }}
>
```

> Note: You can try making your own customized message item by using `<CustomizedMessageItem />` on the CodeSandbox sample.

### Message list params

The **queries.messageListParams** is an `instance` prop in the **channel** component which you can use to retrieve a list of messages by specifying the properties of `MessageListParams`.

Try your [message list params on CodeSandbox](https://codesandbox.io/s/2-2-customizing-messagelistparams-3ipi0g).

> Note: On CodeSandbox’s preview, only the messages you sent will be displayed.

```javascript
// Pass arguments in JSON data input format to the query instance.
const [queries] = useState({
  // use object json type input, don't create sendbird query instance
  // https://sendbird.github.io/core-sdk-javascript/module-model_params_messageListParams-MessageListParams.html
  // https://github.com/sendbird/SendBird-SDK-JavaScript/blob/master/SendBird.d.ts#L488
  messageListParams: {
    senderUserIds: [USER_ID],
    prevResultSize: 30,
    includeReplies: false,
    includeReactions: false,
  },
});

<Channel queries={queries} />;
```

### Message params

The **onBeforeSendUserMessage**, **onBeforeSendFileMessage**, and **onBeforeUpdateUserMessage** are `callback function` props in the **channel** component. The first two execute additional operations for a user message and a file message respectively; the corresponding modified messages are returned through the **text** and the **file** arguments respectively. The **onBeforeUpdateUserMessage** executes additional operations for a user message before updating it.

Try your [message params on CodeSandbox](https://codesandbox.io/s/2-3-customizing-messageparams-606156)

> Note: On the CodeSandbox’s preview, you can send or update a message in highlight.

```javascript
<Channel
    onBeforeSendUserMessage={(text) => {}}
    onBeforeSendFileMessage={(file) => {}}
    onBeforeUpdateUserMessage={handleUpdateUserMessage}
>
```

In order to complete an operation you intend to carry out with each function, you should return `UserMessageParams` and `FileMessageParams` objects.

```javascript
const handleUpdateUserMessage = (text) => {
  const userMessageParams = {};
  userMessageParams.message = text;
  return userMessageParams;
};
```

Find out more about `UserMessageParams` and `FileMessageParams` on the [API reference of Sendbird Chat SDK for JavaScript](https://sendbird.com/docs/chat/v4/javascript/ref/interfaces/_sendbird_chat_message.UserMessageCreateParams.html).

### Chat header

The **renderChatHeader** is a `ReactElement` prop in the **channel** component which you can use to customize the header of `channel` by setting a function. This prop provides two arguments: **channel** and **user**. The channel refers to a `GroupChannel` object which is a collection of properties necessary to render the current channel view. The **user** refers to a `User` object which represents the current user.

Try your [chat header on CodeSandbox](https://codesandbox.io/s/2-4-customizing-chatheader-mi5ijz)

```javascript
<Channel
    renderChannelHeader={() => (
        <CustomizedHeader />
    )}
>
```

> Note: You can try making your own customized chat header item by using `<CustomizedHeader />` on the CodeSandbox sample.

### Message input

The **renderMessageInput** is a `ReactElement` prop in the **Channel** component which allows you to customize the message input by setting a function. This prop provides three arguments: **channel**, **user**, and **disabled**. The **channel** refers to a `GroupChannel` object which is a collection of properties necessary to render the current channel view. The **user** refers to a `User` object which represents the current user. The **disabled** refers to whether to enable the message input box or not.

Try your [message input on CodeSandbox](https://codesandbox.io/s/2-5-customizing-messageinput-forked-or4lm8)

```javascript
<Channel
    renderMessageInput={() => (
        <CustomizedMessageInput />
    )}
>
```

> Note: You can try making your own customized message input item by using `<CustomizedMessageInput />` on the CodeSandbox sample.

### Channel preview item

The **renderChannelPreview** is a `ReactElement` prop in the **ChannelList** component which allows you to customize channel preview by setting a function. This prop provides two arguments: **channel** and **onLeaveChannel**. The **channel** refers to a `GroupChannel` object which is a collection of properties necessary to render the current channel view. The **onLeaveChannel** has a callback function as an argument which can be implemented with custom code for events related to the corresponding user action.

Try your [channel preview item on CodeSandbox](https://codesandbox.io/s/3-1-customizing-channelpreviewitem-7c9xz6)

```javascript
<ChannelList
    renderChannelPreview={({ channel, onLeaveChannel }) => (
        <CustomizedChannelPreviewItem />
    )}
>
```

#### CustomizedChannelPreviewItem.js

You can make your own customized channel preview item component in this file. You can use the **onLeaveChannel** function in the component.

```javascript
const CustomizedChannelPreviewItem = (props) => {
    const { channel } = props;
    const onLeaveChannel = sendbirdSelectors.getLeaveGroupChannel(store);
    ...
    onLeaveChannel(channel);
}
```

### Channel list query

The **queries.channelListQuery** is an `instance` prop in the **ChannelList** component which filters channels by using its options.

Try your [channel list query item on CodeSandbox](https://codesandbox.io/s/3-2-customizing-channellistquery-d0t2l8)

> Note: On the CodeSandbox’s preview, the empty channels that you see means that the channels are successfully created and there are no messages sent by users.

```javascript
// Pass arguments in JSON data input format to the query instance.
  const [queries] = useState({
    channelListQuery: {
      includeEmpty: true,
      limit: 50,
      order: "chronological"
      // channelListQuery
      // https://sendbird.github.io/core-sdk-javascript/module-model_query_groupChannelListQuery-GroupChannelListQuery.html
    },
    applicationUserListQuery: {
      limit: 50
      // ex) userIdsFilter: ["sendbirdian", ...]
      // applicationUserListQuery
      // https://sendbird.github.io/core-sdk-javascript/module-model_query_applicationUserListQuery-ApplicationUserListQuery.html
    }
  });

<ChannelList
    queries={queries}
>
```

Find out more about `ChannelListQuery` and `ApplicationUserListQuery` on the [API reference of Sendbird Chat SDK for JavaScript](https://sendbird.com/docs/chat/v4/javascript/ref/classes/_sendbird_chat_groupChannel.GroupChannelListQuery.html).

### Channel params

The **onBeforeCreateChannel** is a prop of the **ChannelList** component which can be implemented with custom code for events related to the corresponding user actions.

Try your [channel param on CodeSandbox](https://codesandbox.io/s/3-3-customizing-channelparams-vgcgtj)

> Note: you can create a channel using `GroupChannelParams`.

```javascript
<ChannelList
    onBeforeCreateChannel={handleOnBeforeCreateChannel}
>
```

You can get an array of **selectedUsers** in a function argument. In order to complete an operation you intend to carry out with the function, you should return an instance of `GroupChannelCreateParams` object after specifying its properties.

```javascript
const handleOnBeforeCreateChannel = (selectedUsers) => {
  const channelParams: GroupChannelCreateParams = {
    name: 'Hello Sendbird!',
    invitedUserIds: selectedUsers,
    coverUrl: null,
    customType: HIGHLIGHT,
    isDistinct: true,
  };

  return channelParams;
};
```

Find out more about `GroupChannelCreateParams` on the [API reference of Sendbird Chat SDK for JavaScript](https://sendbird.com/docs/chat/v4/javascript/ref/interfaces/_sendbird_chat_groupChannel.GroupChannelCreateParams.html).

## Open Channel Samples

We also provide samples for open channels. Check below to see how you can implement and customize open channels.

### Live Streaming Sample

See how open channel on live stream works on [CodeSandBox](https://codesandbox.io/s/openchannel-1-ykexd3).

### Community Sample

See how you can create community channels on [CodeSandBox](https://codesandbox.io/s/openchannel-2-forked-5kpnqj).
