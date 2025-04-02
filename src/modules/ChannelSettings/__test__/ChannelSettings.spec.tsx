import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SendbirdProvider from '../../../lib/Sendbird/context/SendbirdProvider';
import { ChannelSettingsProvider } from '../context';
import ChannelProfile from '../components/ChannelProfile';
import ChannelSettingsUI from '../components/ChannelSettingsUI';
import ChannelSettingsHeader from '../components/ChannelSettingsUI/ChannelSettingsHeader';
import MenuItem from '../components/ChannelSettingsUI/MenuItem';
import EditDetailsModal from '../components/EditDetailsModal';
import LeaveChannel from '../components/LeaveChannel';
import UserListItem from '../components/UserListItem';
import { User } from '@sendbird/chat';
import UserPanel from '../components/UserPanel';
import ModerationPanel from '../components/ModerationPanel';

// Mock createPortal function to render content directly without portal
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node) => node,
}));

describe('ChannelSettings Unit Tests', () => {
  const defaultProps = {
    channelUrl: 'mockChannelUrl',
  };

  it('renders ChannelSettingsUI with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <ChannelSettingsProvider {...defaultProps}>
            <ChannelSettingsUI />
          </ChannelSettingsProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

  it('renders ChannelProfile with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <ChannelSettingsProvider {...defaultProps}>
            <ChannelProfile />
          </ChannelSettingsProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

  it('renders ChannelSettingsHeader with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <ChannelSettingsProvider {...defaultProps}>
            <ChannelSettingsHeader />
          </ChannelSettingsProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

  it('renders ChannelSettingMenuList with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <ChannelSettingsProvider {...defaultProps}>
            <MenuItem
              renderLeft={() => null}
              renderMiddle={() => null}
            />
          </ChannelSettingsProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

  it('renders EditDetailsModal with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <ChannelSettingsProvider {...defaultProps}>
            <EditDetailsModal
              onSubmit={() => jest.fn()}
              onCancel={() => jest.fn()}
            />
          </ChannelSettingsProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

  it('renders LeaveChannel with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <ChannelSettingsProvider {...defaultProps}>
            <LeaveChannel
              onSubmit={() => jest.fn()}
              onCancel={() => jest.fn()}
            />
          </ChannelSettingsProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

  it('renders UserLisItem with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <ChannelSettingsProvider {...defaultProps}>
            <UserListItem user={{ userId: 'mockUserId', nickname: 'mockNickname' } as User}/>
          </ChannelSettingsProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

  it('renders UserPanel with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <ChannelSettingsProvider {...defaultProps}>
            <UserPanel />
          </ChannelSettingsProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

  it('renders ModerationPanel with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <ChannelSettingsProvider {...defaultProps}>
            <ModerationPanel />
          </ChannelSettingsProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

});
