import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SendbirdProvider from '../../../lib/Sendbird/context/SendbirdProvider';
import { CreateChannelProvider } from '../context';
import CreateChannelUI from '../components/CreateChannelUI';
import InviteUsers from '../components/InviteUsers';
import SelectChannelType from '../components/SelectChannelType';

// Mock createPortal function to render content directly without portal
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node) => node,
}));

jest.mock('../components/InviteUsers/utils', () => ({
  ...jest.requireActual('../components/InviteUsers/utils'),
  createDefaultUserListQuery: () => ({
    isLoading: false,
    next: async () => [],
  }),
}));

describe('CreateChannel Unit Tests', () => {
  const defaultProps = {
    onChannelCreated: () => jest.fn(),
  };

  it('renders CreateChannelUI with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <CreateChannelProvider {...defaultProps}>
            <CreateChannelUI />
          </CreateChannelProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

  it('renders InviteUsers with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <CreateChannelProvider {...defaultProps}>
            <InviteUsers />
          </CreateChannelProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

  it('renders SelectChannelType with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <CreateChannelProvider {...defaultProps}>
            <SelectChannelType />
          </CreateChannelProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

});
