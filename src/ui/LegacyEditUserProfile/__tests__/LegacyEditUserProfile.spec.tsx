import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { EditUserProfile } from '..';
import { LocalizationContext } from '../../../lib/LocalizationContext';

jest.mock('../../Modal', () => (props: any) => (
  <div>
    <h1>{props.titleText}</h1>
    <button type="button" data-testid="modal-submit" onClick={props.onSubmit}>{props.submitText}</button>
    <button type="button" data-testid="modal-cancel" onClick={props.onCancel}>cancel</button>
    {props.children}
  </div>
));
jest.mock('../../Avatar', () => (props: any) => <img alt="avatar" src={props.src} />);

const stringSet = {
  EDIT_PROFILE__TITLE: 'Edit profile',
  BUTTON__SAVE: 'Save',
  EDIT_PROFILE__IMAGE_LABEL: 'Profile image',
  EDIT_PROFILE__IMAGE_UPLOAD: 'Upload',
  EDIT_PROFILE__NICKNAME_LABEL: 'Nickname',
  EDIT_PROFILE__NICKNAME_PLACEHOLDER: 'Enter nickname',
  EDIT_PROFILE__USERID_LABEL: 'User ID',
  EDIT_PROFILE__THEME_LABEL: 'Theme',
};

const user = {
  nickname: 'Tyler',
  profileUrl: 'https://example.com/profile.png',
  userId: 'user-id',
};

const renderProfile = (props = {}) => render(
  <LocalizationContext.Provider value={{ stringSet } as any}>
    <EditUserProfile
      user={user as any}
      onCancel={jest.fn()}
      onSubmit={jest.fn()}
      {...props}
    />
  </LocalizationContext.Provider>,
);

describe('EditUserProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    URL.createObjectURL = jest.fn(() => 'blob:profile');
  });

  it('submits updated nickname and selected profile image, then cancels', () => {
    const onCancel = jest.fn();
    const onSubmit = jest.fn();
    const { container } = renderProfile({ onCancel, onSubmit });
    const file = new File(['profile'], 'profile.png', { type: 'image/png' });
    const hiddenInput = container.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(hiddenInput, { target: { files: [file] } });
    expect(URL.createObjectURL).toHaveBeenCalledWith(file);
    expect(screen.getByAltText('avatar')).toHaveAttribute('src', 'blob:profile');

    const nicknameInput = container.querySelector('input[name="sendbird-edit-user-profile__name__input"]') as HTMLInputElement;
    fireEvent.change(nicknameInput, { target: { value: 'New nickname' } });
    fireEvent.click(screen.getByTestId('modal-submit'));

    expect(onSubmit).toHaveBeenCalledWith(file, 'New nickname');
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('reports validity instead of submitting when required nickname is empty', () => {
    const onCancel = jest.fn();
    const onSubmit = jest.fn();
    const { container } = renderProfile({ onCancel, onSubmit });
    const form = container.querySelector('form') as HTMLFormElement;
    form.reportValidity = jest.fn();
    const nicknameInput = container.querySelector('input[name="sendbird-edit-user-profile__name__input"]') as HTMLInputElement;

    fireEvent.change(nicknameInput, { target: { value: '' } });
    fireEvent.click(screen.getByTestId('modal-submit'));

    expect(form.reportValidity).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('toggles theme through changeTheme and onThemeChange', () => {
    const changeTheme = jest.fn();
    const onThemeChange = jest.fn();
    const { container, rerender } = renderProfile({ changeTheme, onThemeChange, theme: 'light' });

    fireEvent.click(container.querySelector('.sendbird-icon-toggle-off') as Element);
    expect(changeTheme).toHaveBeenCalledWith('dark');
    expect(onThemeChange).toHaveBeenCalledWith('dark');

    rerender(
      <LocalizationContext.Provider value={{ stringSet } as any}>
        <EditUserProfile
          user={user as any}
          onCancel={jest.fn()}
          onSubmit={jest.fn()}
          changeTheme={changeTheme}
          onThemeChange={onThemeChange}
          theme="dark"
        />
      </LocalizationContext.Provider>,
    );
    fireEvent.click(container.querySelector('.sendbird-icon-toggle-on') as Element);
    expect(changeTheme).toHaveBeenCalledWith('light');
    expect(onThemeChange).toHaveBeenCalledWith('light');
  });
});
