import { mapColorKeys } from '../colorMapper';

const mockColorSet = {
  primary: {
    numeric: {
      '--sendbird-light-primary-500': '#00487c',
      '--sendbird-light-primary-400': '#4bb3fd',
      '--sendbird-light-primary-300': '#3e6680',
      '--sendbird-light-primary-200': '#0496ff',
      '--sendbird-light-primary-100': '#027bce',
    },
    descriptiveText: {
      '--sendbird-light-primary-extra-dark': '#00487c',
      '--sendbird-light-primary-dark': '#4bb3fd',
      '--sendbird-light-primary-main': '#3e6680',
      '--sendbird-light-primary-light': '#0496ff',
      '--sendbird-light-primary-extra-light': '#027bce',
    },
  },
  onlight: {
    numeric: {
      '--sendbird-dark-onlight-01': 'rgba(0, 0, 0, 0.88)',
      '--sendbird-dark-onlight-02': 'rgba(0, 0, 0, 0.50)',
      '--sendbird-dark-onlight-03': 'rgba(0, 0, 0, 0.38)',
      '--sendbird-dark-onlight-04': 'rgba(0, 0, 0, 0.12)',
      '--sendbird-light-onlight-01': 'rgba(0, 0, 0, 0.88)',
      '--sendbird-light-onlight-02': 'rgba(0, 0, 0, 0.50)',
      '--sendbird-light-onlight-03': 'rgba(0, 0, 0, 0.38)',
      '--sendbird-light-onlight-04': 'rgba(0, 0, 0, 0.12)',
    },
    descriptiveText: {
      '--sendbird-dark-onlight-text-high-emphasis': 'rgba(0, 0, 0, 0.88)',
      '--sendbird-dark-onlight-text-mid-emphasis': 'rgba(0, 0, 0, 0.50)',
      '--sendbird-dark-onlight-text-low-emphasis': 'rgba(0, 0, 0, 0.38)',
      '--sendbird-dark-onlight-text-disabled': 'rgba(0, 0, 0, 0.12)',
      '--sendbird-light-onlight-text-high-emphasis': 'rgba(0, 0, 0, 0.88)',
      '--sendbird-light-onlight-text-mid-emphasis': 'rgba(0, 0, 0, 0.50)',
      '--sendbird-light-onlight-text-low-emphasis': 'rgba(0, 0, 0, 0.38)',
      '--sendbird-light-onlight-text-disabled': 'rgba(0, 0, 0, 0.12)',
    },
  },
  ondark: {
    numeric: {
      '--sendbird-dark-ondark-01': 'rgba(255, 255, 255, 0.88)',
      '--sendbird-dark-ondark-02': 'rgba(255, 255, 255, 0.50)',
      '--sendbird-dark-ondark-03': 'rgba(255, 255, 255, 0.38)',
      '--sendbird-dark-ondark-04': 'rgba(255, 255, 255, 0.12)',
      '--sendbird-light-ondark-01': 'rgba(255, 255, 255, 0.88)',
      '--sendbird-light-ondark-02': 'rgba(255, 255, 255, 0.50)',
      '--sendbird-light-ondark-03': 'rgba(255, 255, 255, 0.38)',
      '--sendbird-light-ondark-04': 'rgba(255, 255, 255, 0.12)',
    },
    descriptiveText: {
      '--sendbird-dark-ondark-text-high-emphasis': 'rgba(255, 255, 255, 0.88)',
      '--sendbird-dark-ondark-text-mid-emphasis': 'rgba(255, 255, 255, 0.50)',
      '--sendbird-dark-ondark-text-low-emphasis': 'rgba(255, 255, 255, 0.38)',
      '--sendbird-dark-ondark-text-disabled': 'rgba(255, 255, 255, 0.12)',
      '--sendbird-light-ondark-text-high-emphasis': 'rgba(255, 255, 255, 0.88)',
      '--sendbird-light-ondark-text-mid-emphasis': 'rgba(255, 255, 255, 0.50)',
      '--sendbird-light-ondark-text-low-emphasis': 'rgba(255, 255, 255, 0.38)',
      '--sendbird-light-ondark-text-disabled': 'rgba(255, 255, 255, 0.12)',
    },
  },
  overlay: {
    numeric: {
      '--sendbird-dark-overlay-01': 'rgba(0, 0, 0, 0.55)',
      '--sendbird-dark-overlay-02': 'rgba(0, 0, 0, 0.32)',
      '--sendbird-light-overlay-01': 'rgba(0, 0, 0, 0.55)',
      '--sendbird-light-overlay-02': 'rgba(0, 0, 0, 0.32)',
    },
    descriptiveText: {
      '--sendbird-dark-overlay-dark': 'rgba(0, 0, 0, 0.55)',
      '--sendbird-dark-overlay-light': 'rgba(0, 0, 0, 0.32)',
      '--sendbird-light-overlay-dark': 'rgba(0, 0, 0, 0.55)',
      '--sendbird-light-overlay-light': 'rgba(0, 0, 0, 0.32)',
    },
  },
};
describe('mapColorKeys', () => {
  it('should convert multiple keys correctly', () => {
    const input = mockColorSet.primary.descriptiveText;
    const expected = mockColorSet.primary.numeric;
    expect(mapColorKeys(input)).toEqual(expected);
  });
  it('should not change keys without a match', () => {
    const input = {
      '--sendbird-light-primary-unknown': '#abcdef',
    };
    const expected = {
      '--sendbird-light-primary-unknown': '#abcdef',
    };
    expect(mapColorKeys(input)).toEqual(expected);
  });

  it('should handle keys with multiple matching parts correctly', () => {
    const input = {
      '--sendbird-dark-primary-extra-light': '#654321',
      '--sendbird-dark-primary-light': '#abcdef',
    };
    const expected = {
      '--sendbird-dark-primary-100': '#654321',
      '--sendbird-dark-primary-200': '#abcdef',
    };
    expect(mapColorKeys(input)).toEqual(expected);
  });

  it('should not convert the numeric format of keys but keep as-is', () => {
    expect(mapColorKeys(mockColorSet.primary.numeric)).toEqual(mockColorSet.primary.numeric);
  });

  it('should convert correctly onLight / onDark / overlay to text-emphasis format', () => {
    expect(mapColorKeys(mockColorSet.onlight.descriptiveText)).toEqual(mockColorSet.onlight.numeric);
    expect(mapColorKeys(mockColorSet.ondark.descriptiveText)).toEqual(mockColorSet.ondark.numeric);
    expect(mapColorKeys(mockColorSet.overlay.descriptiveText)).toEqual(mockColorSet.overlay.numeric);
  });
});
