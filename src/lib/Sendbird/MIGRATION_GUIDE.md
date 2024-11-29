# SendbirdProvider interface change

## What has been changed?

### Dispatchers are removed

There were `sdkDispatcher`, `userDispatcher`, `appInfoDispatcher` and `reconnect` in the `SendbirdSdkContext`.
so you could get them like below

```tsx
const { dispatchers } = useSendbirdSdkContext();
const { sdkDispatcher, userDispatcher, appInfoDispatcher, reconnect } = dispatchers;
```

Now these context are removed, so you can't get the `dispatchers` from now on.

### Actions are added!

However, you don't have to worry! We replace them with `actions`.
```tsx
const { actions } = useSendbirdSdkContext();
```

This is a replacement of `dispatchers`. For example, `connect` replace the `reconnect` of `dispatchers`.
```tsx
actions.connect();
```
