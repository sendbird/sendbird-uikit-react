import { useLayoutEffect } from 'react';
import cssVars from 'css-vars-ponyfill';

const isEmpty = (obj) => {
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

const useTheme = (overrides: Record<string, string>): void => {
  useLayoutEffect(() => {
    if (!isEmpty(overrides)) {
      cssVars({
        variables: {
          ...{
            '--sendbird-dark-primary-500': '#4d2aa6',
            '--sendbird-dark-primary-400': '#6440C4',
            '--sendbird-dark-primary-300': '#7B53EF',
            '--sendbird-dark-primary-200': '#9E8CF5',
            '--sendbird-dark-primary-100': '#E2DFFF',

            '--sendbird-dark-secondary-500': '#007A7A',
            '--sendbird-dark-secondary-400': '#189A8D',
            '--sendbird-dark-secondary-300': '#2EBA9F',
            '--sendbird-dark-secondary-200': '#6FD6BE',
            '--sendbird-dark-secondary-100': '#AEF2DC',

            '--sendbird-dark-information-100': '#b2d9ff',

            '--sendbird-dark-error-500': '#A30E2D',
            '--sendbird-dark-error-400': '#C11F41',
            '--sendbird-dark-error-300': '#E53157',
            '--sendbird-dark-error-200': '#FF6183',
            '--sendbird-dark-error-100': '#FFABBD',

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

            '--sendbird-light-primary-500': '#4d2aa6',
            '--sendbird-light-primary-400': '#6440C4',
            '--sendbird-light-primary-300': '#7B53EF',
            '--sendbird-light-primary-200': '#9E8CF5',
            '--sendbird-light-primary-100': '#E2DFFF',

            '--sendbird-light-secondary-500': '#007A7A',
            '--sendbird-light-secondary-400': '#189A8D',
            '--sendbird-light-secondary-300': '#2EBA9F',
            '--sendbird-light-secondary-200': '#6FD6BE',
            '--sendbird-light-secondary-100': '#AEF2DC',

            '--sendbird-light-information-100': '#b2d9ff',

            '--sendbird-light-error-500': '#A30E2D',
            '--sendbird-light-error-400': '#C11F41',
            '--sendbird-light-error-300': '#E53157',
            '--sendbird-light-error-200': '#FF6183',
            '--sendbird-light-error-100': '#FFABBD',

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
          },
          ...overrides,
        },
      });
    }
  }, [overrides]);
};

export default useTheme;
