import React from "react";

import "./profile.scss";

export default function Profile({ user }) {
  return (
    <div className="profile-component">
      <div className="profile-avatar">
        <img src={user.profileUrl} alt={user.nickname} />
      </div>
      <div className="profile-text">
        <div className="profile-name">{user.nickname}</div>
        <div className="profile-nickname">{user.userId}</div>
      </div>
    </div>
  );
}
