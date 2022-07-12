import React, { ReactElement } from 'react';
import { User } from '@sendbird/chat';

import './profile.scss';
import { ProfileAvatar } from '../assets/Icons';

interface Props {
  user: User;
}

export default function Profile({
  user,
}: Props): ReactElement {
  return (
    <div className="profile-component">
      <div className="profile-avatar">
        {
          user.profileUrl
          ? (<img src={user.profileUrl} alt={user.nickname} />)
          : (<ProfileAvatar />)
        }
      </div>
      <div className="profile-text">
        <div className="profile-name">{user.nickname}</div>
        <div className="profile-nickname">{user.userId}</div>
      </div>
    </div>
  );
}
