import React from 'react';
import UserProfile from '../index.tsx';

import SendbirdProvider from '../../../lib/Sendbird'

export default { title: 'UI Components/UserProfile' };

const getUser = () => (
  {
    userId: 'userid-1userid-1userid-1userid-1userid-1userid-1userid-1',
    nickname: 'My long random name My long random name',
    profileUrl: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
  }
);

export const otherUserProfile = () => (
  <SendbirdProvider>
    <UserProfile user={getUser()} />
  </SendbirdProvider>
);

export const myUserProfile = () => (
  <SendbirdProvider>
    <UserProfile user={getUser()} currentUserId={getUser().userId} />;
  </SendbirdProvider>
);
