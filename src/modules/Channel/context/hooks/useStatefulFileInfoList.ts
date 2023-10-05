import { useEffect, useState } from 'react';
import { MultipleFilesMessage, SendingStatus } from '@sendbird/chat/message';
import { createStatefulFileInfoList, StatefulFileInfo } from '../../../../utils/createStatefulFileInfoList';
import { CoreMessageType, isMultipleFilesMessage, SendableMessageType } from '../../../../utils';

export const useStatefulFileInfoList = (message: CoreMessageType): StatefulFileInfo[] => {
  const [statefulFileInfoList, setStatefulFileInfoList] = useState<StatefulFileInfo[]>(
    isMultipleFilesMessage(message)
      ? (message['statefulFileInfoList'] ?? (message as MultipleFilesMessage).fileInfoList)
      : [],
  );

  useEffect(() => {
    if (
      isMultipleFilesMessage(message)
      && (message as SendableMessageType)?.sendingStatus !== SendingStatus.SUCCEEDED
      && Array.isArray(message['statefulFileInfoList'])
    ) {
      const newStatefulFileInfoList: StatefulFileInfo[] = createStatefulFileInfoList(
        message as MultipleFilesMessage,
        statefulFileInfoList,
      );
      setStatefulFileInfoList(newStatefulFileInfoList);
    }
  }, [message['statefulFileInfoList']?.map((fileInfo: StatefulFileInfo) => fileInfo.isUploaded).join(',')]);

  return statefulFileInfoList;
};
