import React, { type ReactElement } from "react";
import type { Meta } from "@storybook/react";

import Streaming from "../../modules/OpenChannelApp/Streaming";

const meta: Meta<typeof Streaming> = {
  title: '0.Get Started/Open Channel Streaming App',
  component: Streaming,

};
export default meta;

export const Default = (args): ReactElement => {
  return (
    <div style={{ height: '100vh' }}>
      <Streaming {...args}/>
    </div>
  );
};
Default.args = {
  appId: 'FEA2129A-EA73-4EB9-9E0B-EC738E7EB768',
  userId: 'hoon20230802',
  nickname: 'hoon hi',
  theme: 'light',
};
