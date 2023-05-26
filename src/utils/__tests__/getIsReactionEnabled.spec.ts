import { getIsReactionEnabled } from '../getIsReactionEnabled';

describe('Global-utils/getIsReactionEnabled', () => {
  it('should enable as a default', () => {
    expect(getIsReactionEnabled({})).toBeTrue();

    expect(getIsReactionEnabled({
      appLevel: true,
    })).toBeTrue();
    expect(getIsReactionEnabled({
      globalLevel: true,
    })).toBeTrue();
    expect(getIsReactionEnabled({
      moduleLevel: true,
    })).toBeTrue();

    expect(getIsReactionEnabled({
      appLevel: true,
      globalLevel: true,
    })).toBeTrue();
    expect(getIsReactionEnabled({
      appLevel: true,
      moduleLevel: true,
    })).toBeTrue();
    expect(getIsReactionEnabled({
      globalLevel: true,
      moduleLevel: true,
    })).toBeTrue();

    expect(getIsReactionEnabled({
      appLevel: true,
      globalLevel: true,
      moduleLevel: true,
    })).toBeTrue();
  });

  it('should disable if it is turned off from one level', () => {
    expect(getIsReactionEnabled({
      appLevel: false,
      globalLevel: true,
      moduleLevel: true,
    })).toBeFalse();
    expect(getIsReactionEnabled({
      appLevel: true,
      globalLevel: false,
      moduleLevel: true,
    })).toBeFalse();
    expect(getIsReactionEnabled({
      appLevel: true,
      globalLevel: true,
      moduleLevel: false,
    })).toBeFalse();
  });

  it('should be disabled in the special channels', () => {
    expect(getIsReactionEnabled({
      appLevel: true,
      globalLevel: true,
      moduleLevel: true,
      isBroadcast: true,
    })).toBeFalse();
    expect(getIsReactionEnabled({
      appLevel: true,
      globalLevel: true,
      moduleLevel: true,
      isSuper: true,
    })).toBeFalse();
    expect(getIsReactionEnabled({
      appLevel: true,
      globalLevel: true,
      moduleLevel: true,
      isBroadcast: true,
      isSuper: true,
    })).toBeFalse();
  });
});
