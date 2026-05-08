import React from 'react';
import { act, render } from '@testing-library/react';
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

jest.mock('../../../lib/Sendbird/context/SendbirdProvider', () => jest.requireActual('../../../../__mocks__/mockSendbirdProvider'));

describe('CreateChannel Unit Tests', () => {
  const defaultProps = {
    onChannelCreated: () => jest.fn(),
  };

  const renderWithCreateChannelProvider = async (children: React.ReactElement) => {
    await act(async () => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <CreateChannelProvider {...defaultProps}>
            {children}
          </CreateChannelProvider>
        </SendbirdProvider>,
      );
      await Promise.resolve();
    });
  };

  it('renders CreateChannelUI with default value', async () => {
    await renderWithCreateChannelProvider(<CreateChannelUI />);
  });

  it('renders InviteUsers with default value', async () => {
    await renderWithCreateChannelProvider(<InviteUsers />);
  });

  it('renders SelectChannelType with default value', async () => {
    await renderWithCreateChannelProvider(<SelectChannelType />);
  });

});
