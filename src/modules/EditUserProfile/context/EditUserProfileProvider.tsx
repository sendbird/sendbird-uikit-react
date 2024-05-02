import type { User } from '@sendbird/chat';
import React from 'react';

const EditUserProfileProviderContext = React.createContext<EditUserProfileProviderInterface | null>(null);

export interface EditUserProfileProps {
  children?: React.ReactElement;
  onCancel?(): void;
  onThemeChange?(theme: string): void;
  onEditProfile?(updatedUser: User): void;
}

export interface EditUserProfileProviderInterface {
  onCancel?(): void;
  onThemeChange?(theme: string): void;
  onEditProfile?(updatedUser: User): void;
}

const EditUserProfileProvider = ({ children, ...props }: EditUserProfileProps) => {
  return <EditUserProfileProviderContext.Provider value={props}>{children}</EditUserProfileProviderContext.Provider>;
};

const useEditUserProfileContext = () => {
  const context = React.useContext(EditUserProfileProviderContext);
  if (!context) throw new Error('EditUserProfileContext not found. Use within the EditUserProfile module.');
  return context;
};

export {
  EditUserProfileProvider,
  useEditUserProfileContext,
};
