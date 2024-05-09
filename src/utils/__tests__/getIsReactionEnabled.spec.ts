import type { GroupChannel } from '@sendbird/chat/groupChannel';

import type { SendBirdStateConfig } from '../../lib/types';
import { getIsReactionEnabled } from '../getIsReactionEnabled';

const normalGroupChannel = (props?: any) => ({
  isBroadcast: false,
  isEphemeral: false,
  isSuper: false,
  ...props,
} as GroupChannel);
const normalConfigs = (props?: any, groupChannelProps?: any) => ({
  groupChannel: {
    enableReactions: true,
    enableReactionsSupergroup: false,
    ...groupChannelProps,
  },
  ...props,
} as SendBirdStateConfig);

describe('Global-utils/getIsReactionEnabled', () => {
  it('should prioritize the moduleLevel than global config', () => {
    const moduleLevel = true;
    expect(getIsReactionEnabled({
      channel: normalGroupChannel(),
      config: normalConfigs(),
      moduleLevel,
    })).toBe(moduleLevel);
    const moduleLevel2 = false;
    expect(getIsReactionEnabled({
      channel: normalGroupChannel(),
      config: normalConfigs(),
      moduleLevel: moduleLevel2,
    })).toBe(moduleLevel2);

    expect(getIsReactionEnabled({
      channel: normalGroupChannel({ isSuper: true }),
      config: normalConfigs(),
      moduleLevel: moduleLevel,
    })).toBe(moduleLevel);
    expect(getIsReactionEnabled({
      channel: normalGroupChannel({ isSuper: true }),
      config: normalConfigs(),
      moduleLevel: moduleLevel2,
    })).toBe(moduleLevel2);
  });

  it('should prioritize moduleLevel than enableReactionsSupergroup', () => {
    const isSuper = true;
    expect(getIsReactionEnabled({
      channel: normalGroupChannel({ isSuper }),
      config: normalConfigs({}, { enableReactionsSupergroup: true }),
      moduleLevel: true,
    })).toBe(true);
    expect(getIsReactionEnabled({
      channel: normalGroupChannel({ isSuper }),
      config: normalConfigs({}, { enableReactionsSupergroup: true }),
      moduleLevel: false,
    })).toBe(false);
  });

  it('should be false when it is broadcast or ephemeral channel', () => {
    const isBroadcast = true;
    expect(getIsReactionEnabled({
      channel: normalGroupChannel({ isBroadcast }),
      config: normalConfigs(),
      moduleLevel: true,
    })).toBe(false);
    expect(getIsReactionEnabled({
      channel: normalGroupChannel({ isBroadcast }),
      config: normalConfigs(),
      moduleLevel: false,
    })).toBe(false);

    const isEphemeral = true;
    expect(getIsReactionEnabled({
      channel: normalGroupChannel({ isEphemeral }),
      config: normalConfigs(),
      moduleLevel: true,
    })).toBe(false);
    expect(getIsReactionEnabled({
      channel: normalGroupChannel({ isEphemeral }),
      config: normalConfigs(),
      moduleLevel: false,
    })).toBe(false);
  });
});
