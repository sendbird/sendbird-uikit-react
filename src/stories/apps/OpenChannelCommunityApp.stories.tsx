import React, { type ReactElement } from "react";
import type { Meta } from "@storybook/react";

import Community from "../../modules/OpenChannelApp/Community";
import { STORYBOOK_APP_ID, STORYBOOK_USER_ID, STORYBOOK_NICKNAME } from '../common/const';

const meta: Meta<typeof Community> = {
  title: '0.Get Started/Open Channel Community App',
  component: Community,

};
export default meta;

export const Default = (args): ReactElement => {
  return (
    <div style={{ height: '100vh' }}>
      <Community {...args}/>
    </div>
  );
};
Default.args = {
  appId: STORYBOOK_APP_ID,
  userId: STORYBOOK_USER_ID,
  nickname: STORYBOOK_NICKNAME,
  theme: 'light',
};
