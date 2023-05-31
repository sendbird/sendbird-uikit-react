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

  it('should have higher priority to the moduleLevel', () => {
    expect(getIsReactionEnabled({
      globalLevel: true,
      moduleLevel: false,
    })).toBeFalse();
    expect(getIsReactionEnabled({
      globalLevel: false,
      moduleLevel: true,
    })).toBeTrue();
  });

  it('should be disabled by the special channels', () => {
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
});
