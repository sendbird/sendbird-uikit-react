import React, { useLayoutEffect, useState } from 'react';
import EditUserProfile from '../index.tsx';
import SendbirdProvider from '../../../lib/Sendbird'

export default { title: 'UI Components/EditUserProfile' };

const getUser = () => (
  {
    userId: 'userid-1userid-1userid-1userid-1userid-1userid-1userid-1',
    nickname: 'My long random name My long random name',
    profileUrl: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
  }
);

export const simple = () => {
  const [showModal, setShowModal] = useState(false);
  useLayoutEffect(() => {
    // to display modal after sendbird-modal-root is rendered
    setShowModal(true);
  }, []);
  return (
    <SendbirdProvider>
      <div id="sendbird-modal-root" />
      {
        showModal && (
          <EditUserProfile user={getUser()} onCancel={() => {}} />
        )
      }
    </SendbirdProvider>
)};
