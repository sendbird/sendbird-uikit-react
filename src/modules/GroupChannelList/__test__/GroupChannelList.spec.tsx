import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SendbirdProvider from '../../../lib/Sendbird/context/SendbirdProvider';
import AddGroupChannel from '../components/AddGroupChannel';
import { GroupChannelListProvider } from '../context';
import GroupChannelListUI from '../components/GroupChannelListUI';
import GroupChannelListHeader from '../components/GroupChannelListHeader';
import { GroupChannelListItem } from '../components/GroupChannelListItem';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import GroupChannelPreviewAction from '../components/GroupChannelPreviewAction';

describe('GroupChannelList Unit Tests', () => {
  const defaultProps = {
    onChannelSelect: () => jest.fn(),
    onChannelCreated: () => jest.fn(),
  };

  it('renders GroupChannelListUI with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <GroupChannelListProvider {...defaultProps}>
            <GroupChannelListUI />
          </GroupChannelListProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

  it('renders AddGroupChannel with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <GroupChannelListProvider {...defaultProps}>
            <AddGroupChannel />
          </GroupChannelListProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

  it('renders GroupChannelListHeader with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <GroupChannelListProvider {...defaultProps}>
            <GroupChannelListHeader />
          </GroupChannelListProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

  it('renders GroupChannelListItem with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <GroupChannelListProvider {...defaultProps}>
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
            />
          </GroupChannelListProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

  it('renders GroupChannelPreviewAction with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <GroupChannelListProvider {...defaultProps}>
            <GroupChannelPreviewAction />
          </GroupChannelListProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

});
