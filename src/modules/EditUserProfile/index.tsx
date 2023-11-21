import React from 'react';

import {
  EditUserProfileProvider,
  EditUserProfileProps,
} from './context/EditUserProfileProvider';

import EditUserProfileUI from './components/EditUserProfileUI';

const EditUserProfile: React.FC<EditUserProfileProps> = (props: EditUserProfileProps) => {
  const {
    onEditProfile,
    onCancel,
    onThemeChange,
  } = props;
  return (
    <EditUserProfileProvider
      onEditProfile={onEditProfile}
      onCancel={onCancel}
      onThemeChange={onThemeChange}
    >
      <EditUserProfileUI />
    </EditUserProfileProvider>
  );
};

export default EditUserProfile;
