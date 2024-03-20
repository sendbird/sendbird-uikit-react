import React from 'react';

import { GroupChannelProvider, GroupChannelProviderProps } from './context/GroupChannelProvider';
import GroupChannelUI, { GroupChannelUIProps } from './components/GroupChannelUI';

export interface GroupChannelProps extends GroupChannelProviderProps, GroupChannelUIProps {}
export const GroupChannel = (props: GroupChannelProps) => {
  return (
    <GroupChannelProvider {...props}
      onBeforeDownloadFileMessage={async ({ message }) => {
        console.log('후니, 파일사이즈', message.size);
        const confirmed = window.confirm('파일을 다운로드 하시겠습니까?');
        return confirmed;
      }}
    >
      <GroupChannelUI {...props} />
    </GroupChannelProvider>
  );
};

export default GroupChannel;
