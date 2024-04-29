import React, { type ReactElement } from "react";
import type { Meta } from "@storybook/react";

import Community from "../../modules/OpenChannelApp/Community";

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
  appId: 'FEA2129A-EA73-4EB9-9E0B-EC738E7EB768',
  userId: 'hoon20230802',
  nickname: 'hoon hi',
  theme: 'light',
};
