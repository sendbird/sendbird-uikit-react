import { createMountRegistry, GroupKeyHolder } from '../mountRegistry';

const GROUP_KEY = 'sendbird_group_channel_1-12345';
const OTHER_GROUP_KEY = 'sendbird_group_channel_1-67890';

const channelView: GroupKeyHolder = {};
const threadView: GroupKeyHolder = {};

describe('mountRegistry', () => {
  it('reports no other holder for a key nobody has taken', () => {
    const registry = createMountRegistry();

    expect(registry.isRetainedByOthers(GROUP_KEY, channelView)).toBe(false);
  });

  it('does not count the asking holder as another holder', () => {
    const registry = createMountRegistry();
    registry.retain(GROUP_KEY, channelView);

    expect(registry.isRetainedByOthers(GROUP_KEY, channelView)).toBe(false);
  });

  it('counts a holder that is not the one asking', () => {
    const registry = createMountRegistry();
    registry.retain(GROUP_KEY, channelView);

    expect(registry.isRetainedByOthers(GROUP_KEY, threadView)).toBe(true);
  });

  it('keeps separate counts per group key', () => {
    const registry = createMountRegistry();
    registry.retain(GROUP_KEY, channelView);

    expect(registry.isRetainedByOthers(OTHER_GROUP_KEY, threadView)).toBe(false);
  });

  it('takes the same holder only once', () => {
    const registry = createMountRegistry();
    registry.retain(GROUP_KEY, channelView);
    registry.retain(GROUP_KEY, channelView);
    registry.release(GROUP_KEY, channelView);

    expect(registry.isRetainedByOthers(GROUP_KEY, threadView)).toBe(false);
  });

  it('survives a release for a key it never took', () => {
    const registry = createMountRegistry();

    expect(() => registry.release(GROUP_KEY, channelView)).not.toThrow();
    expect(registry.isRetainedByOthers(GROUP_KEY, threadView)).toBe(false);
  });

  // The hook releases its own hold in one effect and reads the answer in another, and React does
  // not promise which order it destroys them in, so the answer has to be the same either way
  describe('the answer does not depend on when the asking holder releases', () => {
    it('is true with a sibling left, asked before releasing', () => {
      const registry = createMountRegistry();
      registry.retain(GROUP_KEY, channelView);
      registry.retain(GROUP_KEY, threadView);

      expect(registry.isRetainedByOthers(GROUP_KEY, threadView)).toBe(true);
    });

    it('is true with a sibling left, asked after releasing', () => {
      const registry = createMountRegistry();
      registry.retain(GROUP_KEY, channelView);
      registry.retain(GROUP_KEY, threadView);
      registry.release(GROUP_KEY, threadView);

      expect(registry.isRetainedByOthers(GROUP_KEY, threadView)).toBe(true);
    });

    it('is false as the last holder, asked before releasing', () => {
      const registry = createMountRegistry();
      registry.retain(GROUP_KEY, channelView);

      expect(registry.isRetainedByOthers(GROUP_KEY, channelView)).toBe(false);
    });

    it('is false as the last holder, asked after releasing', () => {
      const registry = createMountRegistry();
      registry.retain(GROUP_KEY, channelView);
      registry.release(GROUP_KEY, channelView);

      expect(registry.isRetainedByOthers(GROUP_KEY, channelView)).toBe(false);
    });
  });
});
