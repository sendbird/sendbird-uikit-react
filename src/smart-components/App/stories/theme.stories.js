import React from 'react';

import useTheme from "../../../lib/hooks/useTheme";

import App from '../index';
import { fitPageSize } from './utils';
import './theme.scss';

const appId = process.env.STORYBOOK_APP_ID;
const userId = 'sendbirdian84';
const nickname = 'Sendbirdian2020';

export default { title: 'Theme' };

export const appliedTheme = () => (
  <>
    <div className="storybook-theme">
      {
        fitPageSize(
          <App
            appId={appId}
            userId={userId}
            nickname={nickname}
          />
        )
      }
    </div>
  </>
);

export const appliedThemeIE = () => {
  useTheme({
    "--sendbird-light-primary-500": "#2e6830",
    "--sendbird-light-primary-400": "#3d8b40",
    "--sendbird-light-primary-300": "#4caf50",
    "--sendbird-light-primary-200": "#93cf95",
    "--sendbird-light-primary-100": "#dbefdc",
  });
  return (
    <>
      <div className="storybook-theme-ie">
        {
          fitPageSize(
            <App
              appId={appId}
              userId={userId}
              nickname={nickname}
            />
          )
        }
      </div>
    </>
  );
}

export const viaConfigTheme = () => {
  return (
    <>
      <div className="storybook-theme-use-config">
        {
          fitPageSize(
            <App
              appId={appId}
              userId={userId}
              nickname={nickname}
              colorSet={{
                '--sendbird-light-primary-500': '#00487c',
                '--sendbird-light-primary-400': '#4bb3fd',
                '--sendbird-light-primary-300': '#3e6680',
                '--sendbird-light-primary-200': '#0496ff',
                '--sendbird-light-primary-100': '#027bce',
              }}
            />
          )
        }
      </div>
    </>
  );
}
