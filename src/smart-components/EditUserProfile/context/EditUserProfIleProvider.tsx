import type { User } from '@sendbird/chat';
import React, { useMemo } from 'react';

const EditUserProfileProviderContext = React.createContext(undefined);

export interface EditUserProfileProps {
  children?: React.ReactNode;
  onCancel?(): void;
  onThemeChange?(theme: string): void;
  onEditProfile?(updatedUser: User): void;
}

export interface EditUserProfileProviderInterface {
  onCancel?(): void;
  onThemeChange?(theme: string): void;
  onEditProfile?(updatedUser: User): void;
}

const EditUserProfileProvider: React.FC<EditUserProfileProps> = (props: EditUserProfileProps) => {
  const {
    children,
    onEditProfile,
    onCancel,
    onThemeChange,
  } = props;

  const value = useMemo(() => {
    return {
      onEditProfile,
      onCancel,
      onThemeChange,
    };
  }, []);

  return (
    <EditUserProfileProviderContext.Provider value={value}>
      {children}
    </EditUserProfileProviderContext.Provider>
  );
}

const useEditUserProfileProvider = (): EditUserProfileProviderInterface => (
  React.useContext(EditUserProfileProviderContext)
);

export {
  EditUserProfileProvider,
  useEditUserProfileProvider,
};
