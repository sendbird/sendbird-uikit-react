import React from 'react';
import UserListItem from '../index.jsx';

const description = `
  \`import UserListItem from "@sendbird/uikit-react/ui/UserListItem";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/UserListItem',
  component: UserListItem,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

const getUserList = () => [
  {
    userId: 'userid-1',
    nickname: 'Topy',
    profileUrl: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
  },
  {
    userId: 'userid-2',
    nickname: 'Middly',
    profileUrl: 'https://static.sendbird.com/sample/user_sdk/user_sdk_01.png',
  },
  {
    userId: 'userid-3',
    nickname: 'Bottomy',
    profileUrl: 'https://static.sendbird.com/sample/user_sdk/user_sdk_14.png',
  },
];

const useColumn = (fn) => (
  <div style={{display: 'flex', flexDirection: 'column'}}>
    {fn()}
  </div>
);

export const WithControl = (arg) => useColumn(
  () => getUserList().map((user) => <UserListItem user={user} {...arg} />)
);

export const BasicUserList = () => useColumn(
  () => getUserList().map((user) => <UserListItem user={user} />)
);

export const NoNickname = () => useColumn(
  () => getUserList().map((user) => {
    user.nickname = '';
    return <UserListItem user={user} />
  })
);

export const CheckBox = () => useColumn(
  () => getUserList().map((user) => <UserListItem user={user} checkBox checked={true} onChange={() => {}} />)
);
