import React, { ReactElement } from "react";

import "./login.scss";

export default function Login({ setValues }) {
  return (
    <div className="login-form">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const userId = document.getElementById("userId");
          const nickName = document.getElementById("nickName");
          const darkTheme = document.getElementById("darkTheme");
          setValues({
            userId,
            nickName,
            darkTheme
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
            <input type="checkbox" id="darkTheme" />
          </div>
          <div>
            <button type="submit">Login</button>
          </div>
        </div>
      </form>
    </div>
  );
}
