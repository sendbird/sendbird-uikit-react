# sendbird uikit react router sample

This is a complex sample involving the use of [react-router](https://reactrouter.com/) with Sendbird UIKit for React

This is just one of the many ways to use Sendbird UIKit for React with react-router
in a responsive way.

We split layout into mobile and desktop layouts.
Mobile layout only shows a component at a time.
Desktop layout shows ChannelList and Channel at the same time.
  ChannelSettings and MessageSearch are conditionally rendered.

Similar concepts can be applied to implement ThreadedMessageList.
CreateChannel can also be conditionally rendered on a URL,
for this, you have to render custom header on channel list.
And create a new route for CreateChannel. Where, you can render
the create channel modal(for desktop) or seperate page(for mobile).
You can make use of `@sendbird/uikit-react/CreateChannel` component for this.

## How to run

Clone only this sub directory
Donot download the entire UIKit for React repository

Set desired appId in `src/App.tsx`

Make sure you have nodejs@18 installed

```bash
npm install
npm run dev
```

