import React from "react";
import Streaming from "./Streaming";
import "./styles.css";

import { APP_ID, USER_ID, NICKNAME } from "./const";

export default function App() {
  if (!APP_ID) {
    return (
      <p>Set Set APP_ID, USER_ID & NICKNAME in const.js in const.js</p>
    )
  }

  return (
    <div className="App">
      <Streaming
        appId={APP_ID}
        userId={USER_ID}
        nickname={NICKNAME}
      />
    </div>
  );
}
