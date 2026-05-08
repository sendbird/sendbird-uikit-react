import ConnectionHandler from '../ConnectionHandler';
import GroupChannelHandler from '../GroupChannelHandler';
import OpenChannelHandler from '../OpenChannelHandler';
import SessionHandler from '../SessionHandler';
import UserEventHandler from '../UserEventHandler';

describe('Sendbird handler re-exports', () => {
  it('exposes SDK handler constructors', () => {
    expect(typeof ConnectionHandler).toBe('function');
    expect(typeof GroupChannelHandler).toBe('function');
    expect(typeof OpenChannelHandler).toBe('function');
    expect(typeof SessionHandler).toBe('function');
    expect(typeof UserEventHandler).toBe('function');
  });

  it('creates handler instances with callback maps', () => {
    expect(new ConnectionHandler({ onConnected: jest.fn() })).toBeInstanceOf(ConnectionHandler);
    expect(new GroupChannelHandler({ onMessageReceived: jest.fn() })).toBeInstanceOf(GroupChannelHandler);
    expect(new OpenChannelHandler({ onMessageReceived: jest.fn() })).toBeInstanceOf(OpenChannelHandler);
    expect(new SessionHandler({ onSessionClosed: jest.fn() })).toBeInstanceOf(SessionHandler);
    expect(new UserEventHandler({ onFriendsDiscovered: jest.fn() })).toBeInstanceOf(UserEventHandler);
  });
});
