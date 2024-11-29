# SendbirdProvider

## How to use SendbirdProvider?

#### Import
Import `SendbirdProvider` and `useSendbirdStateContext`.
```tsx
import { SendbirdProvider, useSendbirdStateContext } from '@sendbird/uikit-react';
```

#### Example
```tsx
const MyComponent = () => {
 const context = useSendbirdStateContext();
 // Use the context
 return (<div>{/* Fill components */}</div>);
};
const MyApp = () => {
  return (
    <SendbirdProvider>
      <MyComponent />
    </SendbirdProvider>
  );
};
```
