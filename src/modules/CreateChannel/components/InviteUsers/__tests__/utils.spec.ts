import { CHANNEL_TYPE } from '../../../types';
import { filterUser, setChannelType } from '../utils';

describe('InviteUsers utils', () => {
  it('sets channel type flags without replacing the params object', () => {
    const broadcastParams = { invitedUserIds: ['user-1'] };
    const supergroupParams = { invitedUserIds: ['user-2'] };

    expect(setChannelType(broadcastParams, CHANNEL_TYPE.BROADCAST)).toBe(broadcastParams);
    expect(broadcastParams).toEqual({ invitedUserIds: ['user-1'], isBroadcast: true });

    expect(setChannelType(supergroupParams, CHANNEL_TYPE.SUPERGROUP)).toBe(supergroupParams);
    expect(supergroupParams).toEqual({ invitedUserIds: ['user-2'], isSuper: true });
  });

  it('filters known user IDs', () => {
    const filterCurrentUser = filterUser(['current-user']);

    expect(filterCurrentUser('current-user')).toBe(true);
    expect(filterCurrentUser('other-user')).toBe(false);
  });
});
