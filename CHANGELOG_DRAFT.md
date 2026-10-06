### Features
- Added a countdown modal shown while the server delays the connection

  When the server is busy, it can delay a connection and tell the SDK how long to wait (`ConnectionHandler.onConnectionDelayed`). The SDK then reconnects on its own. `SendbirdProvider` (and `App`) now shows a modal with the estimated waiting time (`MM:SS`) during that wait. It counts down every second, cannot be dismissed, and closes once the SDK reconnects. When the countdown reaches zero, the time is hidden until the SDK reconnects.

  The modal is shown by default and covers the screen above the other UIKit overlays. If that does not fit your layout, replace it with `renderConnectionDelayedModal` (below).

- Added `renderConnectionDelayedModal` to `SendbirdProvider` and `App` to replace the modal

  It receives `retryAfter`, the number of seconds until the SDK retries, and is called again with the new value whenever the SDK reports a new delay. `retryAfter` does not tick by itself, so count it down in your component if you want a live timer. Return `null` to show nothing.

  The returned element is rendered inside the provider, before its children, so position it yourself. For example, as a banner:

  ```tsx
  import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';

  <SendbirdProvider
    appId={APP_ID}
    userId={USER_ID}
    renderConnectionDelayedModal={({ retryAfter }) => (
      <div className="my-reconnect-banner">Reconnecting in about {retryAfter} seconds…</div>
    )}
  >
    {/* ... */}
  </SendbirdProvider>
  ```

  To keep the modal look, use `Modal` from `@sendbird/uikit-react/ui/Modal`. It stacks like any other UIKit modal, so an open image viewer or menu can cover it. Give it a `className` with a higher `z-index` (the default modal uses `100100`) if it must stay on top. `Modal` shows a close button unless you pass `renderHeader`; handle it with `onClose` if users may dismiss it.

  ```tsx
  import Modal from '@sendbird/uikit-react/ui/Modal';

  <SendbirdProvider
    appId={APP_ID}
    userId={USER_ID}
    renderConnectionDelayedModal={({ retryAfter }) => (
      <Modal
        className="my-delay-modal"
        hideFooter
        renderHeader={() => <div className="sendbird-modal__header">Reconnecting…</div>}
      >
        Retrying in about {retryAfter} seconds.
      </Modal>
    )}
  >
    {/* ... */}
  </SendbirdProvider>
  ```

  ```css
  .my-delay-modal {
    z-index: 100100;
  }
  ```

- Added the `MODAL__CONNECTION_DELAYED__TITLE` and `MODAL__CONNECTION_DELAYED__ESTIMATED_WAITING_TIME` StringSet keys

  They hold the default modal's texts: the title (`Something went wrong.\nYou'll be reconnected shortly.`, where `\n` starts a new line) and the label shown before the waiting time (`Estimated waiting time:`). Apps that use another language should set both keys; otherwise the English defaults are shown.

  ```tsx
  <SendbirdProvider
    appId={APP_ID}
    userId={USER_ID}
    stringSet={{
      MODAL__CONNECTION_DELAYED__TITLE: 'We are reconnecting you.\nPlease wait a moment.',
      MODAL__CONNECTION_DELAYED__ESTIMATED_WAITING_TIME: 'Estimated wait:',
    }}
  >
    {/* ... */}
  </SendbirdProvider>
  ```

### Fixes
- `SendbirdProvider` now finishes initializing once a delayed connection succeeds

  When the first connection is delayed, `eventHandlers.connection.onFailed` is still called with `SendbirdErrorCode.DELAYED_CONNECTING` (800221), as before. The provider then waits, and once the SDK reconnects as the same user, it finishes initializing and calls `onConnected`. Previously the provider stayed uninitialized even after the SDK had reconnected.

  There is no need to retry from `onFailed` for this error. Retrying, for example by remounting the provider, does not connect any sooner: it only restarts the provider while the SDK is still waiting out the delay. If your app retries from `onFailed`, skip this error:

  ```tsx
  import { SendbirdErrorCode } from '@sendbird/chat';
  import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';

  <SendbirdProvider
    appId={APP_ID}
    userId={USER_ID}
    eventHandlers={{
      connection: {
        onFailed: (error) => {
          if (error.code === SendbirdErrorCode.DELAYED_CONNECTING) return;
          scheduleRetry();
        },
        onConnected: () => cancelRetry(),
      },
    }}
  >
    {/* ... */}
  </SendbirdProvider>
  ```
