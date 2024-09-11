import { useLayoutEffect } from 'react';
import { type ColorSet, mapColorKeys } from '../utils/colorMapper';
import cssVars from 'css-vars-ponyfill';

const DEFAULT_COLOR_SET = {
  '--sendbird-dark-primary-500': '#491389',
  '--sendbird-dark-primary-400': '#6211c8',
  '--sendbird-dark-primary-300': '#742ddd',
  '--sendbird-dark-primary-200': '#c2a9fa',
  '--sendbird-dark-primary-100': '#dbd1ff',

  '--sendbird-dark-secondary-500': '#007A7A',
  '--sendbird-dark-secondary-400': '#189A8D',
  '--sendbird-dark-secondary-300': '#2EBA9F',
  '--sendbird-dark-secondary-200': '#6FD6BE',
  '--sendbird-dark-secondary-100': '#AEF2DC',

  '--sendbird-dark-information-100': '#b2d9ff',

  '--sendbird-dark-error-500': '#9d091e',
  '--sendbird-dark-error-400': '#bf0711',
  '--sendbird-dark-error-300': '#de360b',
  '--sendbird-dark-error-200': '#f66161',
  '--sendbird-dark-error-100': '#fdaaaa',

  '--sendbird-dark-background-700': '#000000',
  '--sendbird-dark-background-600': '#161616',
  '--sendbird-dark-background-500': '#2C2C2C',
  '--sendbird-dark-background-400': '#393939',
  '--sendbird-dark-background-300': '#A8A8A8',
  '--sendbird-dark-background-200': '#D9D9D9',
  '--sendbird-dark-background-100': '#F0F0F0',
  '--sendbird-dark-background-50': '#FFFFFF',

  '--sendbird-dark-overlay': 'rgba(0, 0, 0, 0.32)',

  '--sendbird-dark-onlight-01': 'rgba(0, 0, 0, 0.88)',
  '--sendbird-dark-onlight-02': 'rgba(0, 0, 0, 0.50)',
  '--sendbird-dark-onlight-03': 'rgba(0, 0, 0, 0.38)',
  '--sendbird-dark-onlight-04': 'rgba(0, 0, 0, 0.12)',

  '--sendbird-dark-ondark-01': 'rgba(255, 255, 255, 0.88)',
  '--sendbird-dark-ondark-02': 'rgba(255, 255, 255, 0.50)',
  '--sendbird-dark-ondark-03': 'rgba(255, 255, 255, 0.38)',
  '--sendbird-dark-ondark-04': 'rgba(255, 255, 255, 0.12)',

  '--sendbird-dark-shadow-01': '0 1px 5px 0 rgba(33, 34, 66, 0.04), 0 0 3px 0 rgba(0, 0, 0, 0.08), 0 2px 1px 0 rgba(0, 0, 0, 0.12)',
  '--sendbird-dark-shadow-02': '0 3px 5px -3px rgba(33, 34, 66, 0.04), 0 3px 14px 2px rgba(0, 0, 0, 0.08), 0 8px 10px 1px rgba(0, 0, 0, 0.12)',
  '--sendbird-dark-shadow-03': '0 6px 10px -5px rgba(0, 0, 0, 0.04), 0 6px 30px 5px rgba(0, 0, 0, 0.08), 0 16px 24px 2px rgba(0, 0, 0, 0.12)',
  '--sendbird-dark-shadow-04': '0 9px 15px -7px rgba(0, 0, 0, 0.04), 0 9px 46px 8px rgba(0, 0, 0, 0.08), 0 24px 38px 3px rgba(0, 0, 0, 0.12)',

  '--sendbird-dark-shadow-message-input': '0 1px 5px 0 rgba(33, 34, 66, 0.12), 0 0 1px 0 rgba(33, 34, 66, 0.16), 0 2px 1px 0 rgba(33, 34, 66, 0.08), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',

  '--sendbird-light-primary-500': '#491389',
  '--sendbird-light-primary-400': '#6211c8',
  '--sendbird-light-primary-300': '#742ddd',
  '--sendbird-light-primary-200': '#c2a9fa',
  '--sendbird-light-primary-100': '#dbd1ff',

  '--sendbird-light-secondary-500': '#007A7A',
  '--sendbird-light-secondary-400': '#189A8D',
  '--sendbird-light-secondary-300': '#2EBA9F',
  '--sendbird-light-secondary-200': '#6FD6BE',
  '--sendbird-light-secondary-100': '#AEF2DC',

  '--sendbird-light-information-100': '#b2d9ff',

  '--sendbird-light-error-500': '#9d091e',
  '--sendbird-light-error-400': '#bf0711',
  '--sendbird-light-error-300': '#de360b',
  '--sendbird-light-error-200': '#f66161',
  '--sendbird-light-error-100': '#fdaaaa',

  '--sendbird-light-background-700': '#000000',
  '--sendbird-light-background-600': '#161616',
  '--sendbird-light-background-500': '#2C2C2C',
  '--sendbird-light-background-400': '#393939',
  '--sendbird-light-background-300': '#A8A8A8',
  '--sendbird-light-background-200': '#D9D9D9',
  '--sendbird-light-background-100': '#F0F0F0',
  '--sendbird-light-background-50': ' #FFFFFF',

  '--sendbird-light-overlay': 'rgba(0, 0, 0, 0.32)',

  '--sendbird-light-onlight-01': 'rgba(0, 0, 0, 0.88)',
  '--sendbird-light-onlight-02': 'rgba(0, 0, 0, 0.50)',
  '--sendbird-light-onlight-03': 'rgba(0, 0, 0, 0.38)',
  '--sendbird-light-onlight-04': 'rgba(0, 0, 0, 0.12)',

  '--sendbird-light-ondark-01': 'rgba(255, 255, 255, 0.88)',
  '--sendbird-light-ondark-02': 'rgba(255, 255, 255, 0.50)',
  '--sendbird-light-ondark-03': 'rgba(255, 255, 255, 0.38)',
  '--sendbird-light-ondark-04': 'rgba(255, 255, 255, 0.12)',

  '--sendbird-light-shadow-01': '0 1px 5px 0 rgba(33, 34, 66, 0.04), 0 0 3px 0 rgba(0, 0, 0, 0.08), 0 2px 1px 0 rgba(0, 0, 0, 0.12)',
  '--sendbird-light-shadow-02': '0 3px 5px -3px rgba(33, 34, 66, 0.04), 0 3px 14px 2px rgba(0, 0, 0, 0.08), 0 8px 10px 1px rgba(0, 0, 0, 0.12)',
  '--sendbird-light-shadow-03': '0 6px 10px -5px rgba(0, 0, 0, 0.04), 0 6px 30px 5px rgba(0, 0, 0, 0.08), 0 16px 24px 2px rgba(0, 0, 0, 0.12)',
  '--sendbird-light-shadow-04': '0 9px 15px -7px rgba(0, 0, 0, 0.04), 0 9px 46px 8px rgba(0, 0, 0, 0.08), 0 24px 38px 3px rgba(0, 0, 0, 0.12)',

  '--sendbird-light-shadow-message-input': '0 1px 5px 0 rgba(33, 34, 66, 0.12), 0 0 1px 0 rgba(33, 34, 66, 0.16), 0 2px 1px 0 rgba(33, 34, 66, 0.08), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
};

const isEmpty = (obj?: null | Record<string, unknown>) => {
  if (obj === null || obj === undefined) {
    return true;
  }

  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }
  return JSON.stringify(obj) === JSON.stringify({});
};

const useTheme = (overrides?: ColorSet): void => {
  useLayoutEffect(() => {
    if (!isEmpty(overrides)) {
      const variables = {
        ...DEFAULT_COLOR_SET,
        ...mapColorKeys(overrides),
      };
      cssVars({ variables });
    }
  }, [overrides]);
};

export default useTheme;
