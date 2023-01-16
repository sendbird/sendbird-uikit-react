import React, { useState } from 'react';

import { fitPageSize } from '../../App/stories/utils';
import Sendbird from '../../../lib/Sendbird';
import { AppLayout } from './AppLayout';

export const TestApp = () => {
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [userId, setUserId] = useState('');
  const [appId, setAppId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  return isLoginPage
    ? fitPageSize(
      <div
        className="login-container"
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <div className='login_block'>
          <h1>LogIn</h1>
          <input
            className="login_input"
            type="text"
            placeholder="appid"
            onChange={(e) => setAppId(e.target.value)}
          />
          <input
            className="login_input"
            type="text"
            placeholder="accesstoken"
            onChange={(e) => setAccessToken(e.target.value)}
          />
          <input
            className="login_input"
            type="text"
            placeholder="userid"
            onChange={(e) => setUserId(e.target.value)}
          />
          <input
            className="login-submit"
            type="submit"
            value="Submit"
            onClick={() => setIsLoginPage(false)}
          />
        </div>
      </div>
    )
    : fitPageSize(
      <Sendbird
        appId={appId}
        userId={userId}
        accessToken={accessToken}
      >
        <AppLayout />
      </Sendbird>
    )
};
