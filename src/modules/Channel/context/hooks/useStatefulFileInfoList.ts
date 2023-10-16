import { useEffect, useState } from 'react';
import { MultipleFilesMessage, UploadableFileInfo } from '@sendbird/chat/message';
import { createStatefulFileInfoList, StatefulFileInfo } from '../../../../utils/createStatefulFileInfoList';
import { CoreMessageType, isMultipleFilesMessage } from '../../../../utils';

export const useStatefulFileInfoList = (message: CoreMessageType): StatefulFileInfo[] => {
  const [statefulFileInfoList, setStatefulFileInfoList] = useState<StatefulFileInfo[]>([]);

  useEffect(() => {
    if (isMultipleFilesMessage(message)) {
      const newStatefulFileInfoList: StatefulFileInfo[] = createStatefulFileInfoList(
        message as MultipleFilesMessage,
        statefulFileInfoList,
      );
      setStatefulFileInfoList(newStatefulFileInfoList);
    }
  }, [
    // Sent message dependency.
    (message as MultipleFilesMessage).fileInfoList?.length,
    // Unsent message dependency.
    /**
     * Side note: It was a bad design to not include 'isUploaded' property by SDK.
     * Because if original object has fileUrl set and no file, then uploaded result remains
     * the same so customer cannot know whether it has been uploaded or not.
     */
    (message as MultipleFilesMessage).messageParams?.fileInfoList
      ?.map((fileInfo: UploadableFileInfo) => fileInfo.fileUrl).join(','),
  ]);
  return statefulFileInfoList;
};
