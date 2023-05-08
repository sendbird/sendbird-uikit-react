import React, { ReactElement } from 'react';

import './login.scss';

interface setValuesParams {
  userId: string;
  nickName: string;
  darkTheme: boolean;
}

interface Props {
  setValues(params: setValuesParams): void;
}

export default function Login({
  setValues,
}: Props): ReactElement {
  return (
    <div className="login-form">
      <form
        onSubmit={(e: React.FormEvent<EventTarget>): void => {
          e.preventDefault();
          const userId: string = (document.getElementById('userId') as HTMLInputElement).value;
          const nickName: string = (document.getElementById('nickName') as HTMLInputElement).value;
          const darkTheme = (document.getElementById('darkTheme') as HTMLInputElement).checked;
          setValues({
            userId,
            nickName,
            darkTheme,
          });
        }}
      >
        <div>
          <p>Login</p>
          <div>
            <input type="text" placeholder="userId" id="userId" />
          </div>
          <div>
            <input type="text" placeholder="nickname" id="nickName" />
          </div>
          <div>
            Dark theme:
            <input type="checkbox" id="darkTheme"/>
          </div>
          <div>
            <button type="submit">Login</button>
          </div>
        </div>
      </form>
    </div>
  );
}
