import { useEffect, useState } from 'react';
import { MultipleFilesMessage, SendingStatus } from '@sendbird/chat/message';
import { createStatefulFileInfoList, StatefulFileInfo } from '../../utils/createStatefulFileInfoList';

export const useDynamicUploadedIndex = (message: MultipleFilesMessage): StatefulFileInfo[] => {
  const [statefulFileInfoList, setStatefulFileInfoList] = useState<StatefulFileInfo[]>(
    message['statefulFileInfoList'] ?? message.fileInfoList,
  );

  useEffect(() => {
    if (
      message?.sendingStatus !== SendingStatus.SUCCEEDED
      && Array.isArray(message['statefulFileInfoList'])
    ) {
      const newStatefulFileInfoList: StatefulFileInfo[] = createStatefulFileInfoList(message, statefulFileInfoList);
      setStatefulFileInfoList(newStatefulFileInfoList);
    }
  }, [message['statefulFileInfoList']?.map((fileInfo: StatefulFileInfo) => fileInfo.isUploaded).join(',')]);

  return statefulFileInfoList;
};
