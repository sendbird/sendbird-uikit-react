import { getIsReactionEnabled } from '../getIsReactionEnabled';

describe('Global-utils/getIsReactionEnabled', () => {
  it('should enable as a default', () => {
    expect(getIsReactionEnabled({})).toBeTrue();

    expect(getIsReactionEnabled({
      globalLevel: true,
    })).toBeTrue();
    expect(getIsReactionEnabled({
      moduleLevel: true,
    })).toBeTrue();

    expect(getIsReactionEnabled({
      globalLevel: true,
      moduleLevel: true,
    })).toBeTrue();
  });

  it('should disable if set values are false', () => {
    expect(getIsReactionEnabled({
      globalLevel: false,
    })).toBeFalse();
    expect(getIsReactionEnabled({
      moduleLevel: false,
    })).toBeFalse();

    expect(getIsReactionEnabled({
      globalLevel: false,
      moduleLevel: false,
    })).toBeFalse();
  });

  it('should have higher priority to the moduleLevel than globalLevel', () => {
    expect(getIsReactionEnabled({
      globalLevel: true,
      moduleLevel: false,
    })).toBeFalse();
    expect(getIsReactionEnabled({
      globalLevel: false,
      moduleLevel: true,
    })).toBeTrue();
  });

  it('should disable in the special type channels', () => {
    expect(getIsReactionEnabled({
      globalLevel: true,
      isBroadcast: true,
    })).toBeFalse();
    expect(getIsReactionEnabled({
      globalLevel: true,
      isSuper: true,
    })).toBeFalse();
    expect(getIsReactionEnabled({
      globalLevel: true,
      isBroadcast: true,
      isSuper: true,
    })).toBeFalse();

    expect(getIsReactionEnabled({
      moduleLevel: true,
      isBroadcast: true,
    })).toBeFalse();
    expect(getIsReactionEnabled({
      moduleLevel: true,
      isSuper: true,
    })).toBeFalse();
    expect(getIsReactionEnabled({
      moduleLevel: true,
      isBroadcast: true,
      isSuper: true,
    })).toBeFalse();

    expect(getIsReactionEnabled({
      globalLevel: true,
      moduleLevel: true,
      isBroadcast: true,
    })).toBeFalse();
    expect(getIsReactionEnabled({
      globalLevel: true,
      moduleLevel: true,
      isSuper: true,
    })).toBeFalse();
    expect(getIsReactionEnabled({
      globalLevel: true,
      moduleLevel: true,
      isBroadcast: true,
      isSuper: true,
    })).toBeFalse();
  });

  it('should disable if only one special channel type is true', () => {
    expect(getIsReactionEnabled({
      globalLevel: true,
      moduleLevel: true,
      isBroadcast: false,
      isSuper: true,
    })).toBeFalse();
    expect(getIsReactionEnabled({
      globalLevel: true,
      moduleLevel: true,
      isBroadcast: true,
      isSuper: false,
    })).toBeFalse();
    expect(getIsReactionEnabled({
      globalLevel: true,
      isBroadcast: false,
      isSuper: true,
    })).toBeFalse();
    expect(getIsReactionEnabled({
      moduleLevel: true,
      isBroadcast: true,
      isSuper: false,
    })).toBeFalse();
    expect(getIsReactionEnabled({
      isBroadcast: false,
      isSuper: true,
    })).toBeFalse();
    expect(getIsReactionEnabled({
      isBroadcast: true,
      isSuper: false,
    })).toBeFalse();
  });
});
