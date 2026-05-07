import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import EditUserProfileUI from '../index';
import { EditUserProfileProvider } from '../../../context/EditUserProfileProvider';
import { LocalizationContext } from '../../../../../lib/LocalizationContext';
import useSendbird from '../../../../../lib/Sendbird/context/hooks/useSendbird';

jest.mock('../../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockUseSendbird = useSendbird as jest.Mock;

const mockStringSet = {
  BUTTON__CANCEL: 'Cancel',
  BUTTON__SAVE: 'Save',
  EDIT_PROFILE__TITLE: 'My profile',
  EDIT_PROFILE__IMAGE_LABEL: 'Profile image',
  EDIT_PROFILE__IMAGE_UPLOAD: 'Upload',
  EDIT_PROFILE__NICKNAME_LABEL: 'Nickname',
  EDIT_PROFILE__NICKNAME_PLACEHOLDER: 'Enter your nickname',
  EDIT_PROFILE__USERID_LABEL: 'User ID',
  EDIT_PROFILE__THEME_LABEL: 'Dark theme',
};

const mockUser = {
  nickname: 'Jane',
  profileUrl: 'https://example.com/profile.png',
  userId: 'jane-id',
};

const renderComponent = (providerProps = {}, sendbirdOverrides: any = {}) => {
  const updatedUser = { ...mockUser, nickname: 'Updated Jane' };
  const updateCurrentUserInfo = jest.fn().mockResolvedValue(updatedUser);
  const updateUserInfo = jest.fn();
  const setCurrentTheme = jest.fn();

  mockUseSendbird.mockReturnValue({
    state: {
      eventHandlers: {},
      stores: {
        sdkStore: {
          sdk: {
            updateCurrentUserInfo,
          },
        },
        userStore: {
          user: mockUser,
        },
      },
      config: {
        theme: 'light',
        setCurrentTheme,
      },
      ...sendbirdOverrides.state,
    },
    actions: {
      updateUserInfo,
      ...sendbirdOverrides.actions,
    },
  });

  const renderResult = render(
    <LocalizationContext.Provider value={{ stringSet: mockStringSet } as any}>
      <EditUserProfileProvider {...providerProps}>
        <EditUserProfileUI />
      </EditUserProfileProvider>
    </LocalizationContext.Provider>,
  );

  return {
    ...renderResult,
    setCurrentTheme,
    updateCurrentUserInfo,
    updateUserInfo,
    updatedUser,
  };
};

describe('EditUserProfileUI integration tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '<div id="sendbird-modal-root" />';
  });

  it('renders the profile form from the provider state', () => {
    renderComponent();

    expect(screen.getByText(mockStringSet.EDIT_PROFILE__TITLE)).toBeInTheDocument();
    expect(screen.getByText(mockStringSet.EDIT_PROFILE__IMAGE_LABEL)).toBeInTheDocument();
    expect(screen.getByText(mockStringSet.EDIT_PROFILE__NICKNAME_LABEL)).toBeInTheDocument();
    expect(screen.getByText(mockStringSet.EDIT_PROFILE__USERID_LABEL)).toBeInTheDocument();
    expect(screen.getByText(mockStringSet.EDIT_PROFILE__THEME_LABEL)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockUser.nickname)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockUser.userId)).toBeInTheDocument();
  });

  it('updates the user profile and calls onEditProfile when saving', async () => {
    const onEditProfile = jest.fn();
    const { updateCurrentUserInfo, updateUserInfo, updatedUser } = renderComponent({ onEditProfile });

    fireEvent.change(screen.getByDisplayValue(mockUser.nickname), {
      target: { value: 'Updated Jane' },
    });
    fireEvent.click(screen.getByRole('button', { name: mockStringSet.BUTTON__SAVE }));

    await waitFor(() => {
      expect(updateCurrentUserInfo).toHaveBeenCalledWith({
        nickname: 'Updated Jane',
        profileImage: undefined,
      });
    });
    expect(updateUserInfo).toHaveBeenCalledWith(updatedUser);
    expect(onEditProfile).toHaveBeenCalledWith(updatedUser);
  });

  it('calls cancel and theme-change callbacks from the form controls', () => {
    const onCancel = jest.fn();
    const onThemeChange = jest.fn();
    const { setCurrentTheme } = renderComponent({ onCancel, onThemeChange });

    fireEvent.click(screen.getByRole('button', { name: mockStringSet.BUTTON__CANCEL }));
    fireEvent.click(document.getElementsByClassName('sendbird-icon-toggle-off')[0]);

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(setCurrentTheme).toHaveBeenCalledWith('dark');
    expect(onThemeChange).toHaveBeenCalledWith('dark');
  });
});
