# Architecture

> Tip: see `src/lib/stories/index.stories.js` for an example

## Main concepts

* We will use a flux architecture using `useReducer` hook. The  sdk, connection, config and user data will be mainly stored in a global store(context) in `SendbirdProvider`(`/src/lib/Sendbird.jsx`)
* ChannelList(`./src/smart-components/ChannelList`) contains list of channels
* Channel(`./src/smart-components/Conversation`) contains list of messages inside a channel
* The store can be accessed down in component heirarchy using `withSendbird (`/src/lib/SendbirdSdkContext.jsx`) as a higherOrderComponent
* Store should be modified and accessed using dux-esque components in `You can find them in /dux whenever applicable`. Each component should have actionType, reducer, thunks, eventListeners and initialState
* SmartComponents(`src/smart-components`) are components that can access the global state and dispatch actions

## Usage

In root of your App, or highest level at which you want sendbird context to live -
declare a
```
<Sendbird userId={} appId={} accessToken={}>
  <ChannelList />
</Sendbird>
```
component

# The store

The sendbird context will give you a store with these information:
```
stores: {
  sdkStore,
  userStore,
},
dispatchers: {
  sdkDispatcher,
  userDispatcher,
},
config: {
  userId,
  appId,
  accessToken,
  theme,
  config: {
    logLevel,
  }
},
```
