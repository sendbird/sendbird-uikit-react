import React from 'react';
import UserProfile from '../index.tsx';
import SendbirdProvider from '../../../lib/Sendbird'

const description = `
  \`import UserProfile from "@sendbird/uikit-react/ui/UserProfile";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/UserProfile',
  component: UserProfile,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

const getUser = () => (
  {
    userId: 'userid-1userid-1userid-1userid-1userid-1userid-1userid-1',
    nickname: 'My long random name My long random name',
    profileUrl: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
  }
);

export const WithControl = (arg) => (
  <SendbirdProvider>
    <UserProfile user={getUser()} {...arg} />
  </SendbirdProvider>
);

export const myUserProfile = () => (
  <SendbirdProvider>
    <UserProfile user={getUser()} currentUserId={getUser().userId} />;
  </SendbirdProvider>
);
