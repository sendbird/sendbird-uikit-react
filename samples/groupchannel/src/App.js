import React from "react";
import SBProvider from "@sendbird/uikit-react/SendbirdProvider";
import "@sendbird/uikit-react/dist/index.css";

import CustomizedApp from "./CustomizedApp";
import "./styles.css";

import { APP_ID, USER_ID, NICKNAME } from "./const";

export default function App() {
  if (!APP_ID) {
    return (
      <p>Set APP_ID in const.js</p>
    )
  }
  return (
    <SBProvider appId={APP_ID} userId={USER_ID} nickname={NICKNAME}>
      <CustomizedApp />
    </SBProvider>
  );
}
