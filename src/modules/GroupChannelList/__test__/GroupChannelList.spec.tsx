import React from 'react';
import { act, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SendbirdProvider from '../../../lib/Sendbird/context/SendbirdProvider';
import AddGroupChannel from '../components/AddGroupChannel';
import { GroupChannelListProvider } from '../context';
import GroupChannelListUI from '../components/GroupChannelListUI';
import GroupChannelListHeader from '../components/GroupChannelListHeader';
import { GroupChannelListItem } from '../components/GroupChannelListItem';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import GroupChannelPreviewAction from '../components/GroupChannelPreviewAction';

jest.mock('../../../lib/Sendbird/context/SendbirdProvider', () => jest.requireActual('../../../../__mocks__/mockSendbirdProvider'));

describe('GroupChannelList Unit Tests', () => {
  const defaultProps = {
    onChannelSelect: () => jest.fn(),
    onChannelCreated: () => jest.fn(),
  };

  const renderWithGroupChannelListProvider = async (children: React.ReactElement) => {
    await act(async () => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <GroupChannelListProvider {...defaultProps}>
            {children}
          </GroupChannelListProvider>
        </SendbirdProvider>,
      );
      await Promise.resolve();
    });
  };

  it('renders GroupChannelListUI with default value', async () => {
    await renderWithGroupChannelListProvider(<GroupChannelListUI />);
  });

  it('renders AddGroupChannel with default value', async () => {
    await renderWithGroupChannelListProvider(<AddGroupChannel />);
  });

  it('renders GroupChannelListHeader with default value', async () => {
    await renderWithGroupChannelListProvider(<GroupChannelListHeader />);
  });

  it('renders GroupChannelListItem with default value', async () => {
    await renderWithGroupChannelListProvider(
      <GroupChannelListItem
        tabIndex={0}
        channel={
          {
            isDistinct: false,
            isSuper: false,
            isBroadcast: false,
          } as GroupChannel
        }
        onClick={() => jest.fn()}
        renderChannelAction={() => null}
      />,
    );
  });

  it('renders GroupChannelPreviewAction with default value', async () => {
    await renderWithGroupChannelListProvider(<GroupChannelPreviewAction />);
  });

});
