import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

const mockObservedContext = jest.fn();

jest.mock('../components/EditUserProfileUI', () => {
  const React = require('react');
  const { useEditUserProfileContext } = require('../context/EditUserProfileProvider');

  return {
    __esModule: true,
    default: () => {
      const context = useEditUserProfileContext();
      mockObservedContext(context);

      return React.createElement(
        'button',
        {
          type: 'button',
          onClick: () => {
            context.onThemeChange?.('dark');
            context.onCancel?.();
            context.onEditProfile?.({ userId: 'updated-user' });
          },
        },
        'Edit profile UI',
      );
    },
  };
});

import EditUserProfile from '..';

describe('EditUserProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders EditUserProfileUI inside its provider and forwards callbacks through context', () => {
    const onEditProfile = jest.fn();
    const onCancel = jest.fn();
    const onThemeChange = jest.fn();

    render(
      <EditUserProfile
        onEditProfile={onEditProfile}
        onCancel={onCancel}
        onThemeChange={onThemeChange}
      />,
    );

    expect(screen.getByText('Edit profile UI')).toBeInTheDocument();
    expect(mockObservedContext).toHaveBeenCalledWith(expect.objectContaining({
      onEditProfile,
      onCancel,
      onThemeChange,
    }));

    fireEvent.click(screen.getByText('Edit profile UI'));

    expect(onThemeChange).toHaveBeenCalledWith('dark');
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onEditProfile).toHaveBeenCalledWith({ userId: 'updated-user' });
  });
});
