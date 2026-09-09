### Features
- `renderUserProfile` now also applies to the profile popup opened by clicking an `@mention`

  Previously the `@mention` popup always showed the default UI and ignored `renderUserProfile` (unlike avatar clicks). It now honors `renderUserProfile`, so a custom renderer applies to the mention popup too. This only affects apps that already provide `renderUserProfile`.
- Added `onBeforeStartDirectMessage` to customize the 1:1 channel created from the profile popup's **Message** button

  This optional prop on `SendbirdProvider` (and `App`) runs right before the **default** profile popup creates the channel, so you can adjust the creation parameters — for example set `isDistinct: true` or attach `data` / `customType`. The callback also receives the target `users`.

  ```tsx
  import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';

  <SendbirdProvider
    appId={APP_ID}
    userId={USER_ID}
    onBeforeStartDirectMessage={(channelParams, users) => ({
      ...channelParams,
      isDistinct: true,
      data: JSON.stringify({ source: 'mention' }),
    })}
  >
    {/* ... */}
  </SendbirdProvider>
  ```

  Whether `onBeforeStartDirectMessage` runs together with `renderUserProfile` depends on whether your custom popup keeps the built-in `<UserProfile>`.

  Wrapping the built-in popup — `onBeforeStartDirectMessage` still runs, because `<UserProfile>` (and its Message button) is still rendered:

  ```tsx
  import UserProfile from '@sendbird/uikit-react/ui/UserProfile';

  <SendbirdProvider
    appId={APP_ID}
    userId={USER_ID}
    onBeforeStartDirectMessage={(channelParams) => ({ ...channelParams, isDistinct: true })}
    renderUserProfile={({ user, currentUserId, close }) => (
      <MyCard>
        <MyHeader />
        <UserProfile user={user} currentUserId={currentUserId} onSuccess={close} />
      </MyCard>
    )}
  >
    {/* ... */}
  </SendbirdProvider>
  ```

  Fully replacing the popup — `<UserProfile>` is not rendered, so `onBeforeStartDirectMessage` does not run; create the channel yourself with the `getCreateGroupChannel` selector:

  ```tsx
  import { useSendbird, sendbirdSelectors } from '@sendbird/uikit-react';
  import type { User } from '@sendbird/chat';

  // A custom popup replaces the default one, so it creates the channel itself.
  function MyProfileCard({ user, currentUserId, close }: { user: User; currentUserId: string; close: () => void }) {
    const { state } = useSendbird();
    const createChannel = sendbirdSelectors.getCreateGroupChannel(state);

    const startDirectMessage = async () => {
      close();
      await createChannel({
        isDistinct: true,
        invitedUserIds: [user.userId],
        operatorUserIds: [currentUserId],
        data: JSON.stringify({ source: 'profile-popup' }),
      });
    };

    return (
      <div>
        <img src={user.profileUrl} alt="" />
        <span>{user.nickname}</span>
        <button onClick={startDirectMessage}>Message</button>
      </div>
    );
  }

  <SendbirdProvider appId={APP_ID} userId={USER_ID} renderUserProfile={(props) => <MyProfileCard {...props} />}>
    {/* ... */}
  </SendbirdProvider>
  ```

### Fixes
- Fixed an issue introduced in v3.18.3 where `initializeThreadFetcher`, `fetchPrevThreads`, and `fetchNextThreads` from `useThreadContext()` returned `undefined` — so `await` / `.then()` on them threw — and passed the entire accumulated reply list to their callback instead of the newly fetched page
- Fixed failed file and voice messages in a thread keep their local file preview
- Changed `sendMultipleFilesMessage` from `useThreadContext()` rejects on fewer than two files or a missing channel, instead of resolving `null`
- Changed `sendFileMessage` from `useThreadContext()` rejects when no channel is available, instead of resolving `null`
- Fixed a bug where the `GroupChannel` message list could fail to load for around two and a half minutes when the provider remounted while the network was stalled
