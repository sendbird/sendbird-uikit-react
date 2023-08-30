import React, { ReactElement, useState } from 'react';

import Icon, { IconTypes, IconColors } from '../Icon';
import { MultipleFilesMessage, UploadedFileInfo } from '@sendbird/chat/message';
import ImageRenderer from '../ImageRenderer';
import ImageGrid from '../ImageGrid';
import FileViewer from '../FileViewer';
import { MULTIPLE_FILES_IMAGE_BORDER_RADIUS, MULTIPLE_FILES_IMAGE_SIDE_LENGTH } from './const';

interface Props {
  className?: string;
  message: MultipleFilesMessage;
  isByMe?: boolean;
  mouseHover?: boolean;
  isReactionEnabled?: boolean;
  truncateLimit?: number;
}

export default function MultipleFilesMessageItemBody({
  className,
  message,
  isReactionEnabled = false,
}: Props): ReactElement {
  const [fileInfoList] = useState<UploadedFileInfo[]>(message.fileInfoList);
  const [currentIndex, setCurrentIndex] = useState(-1);

  function onClose() {
    setCurrentIndex(-1);
  }

  function onClickLeft() {
    setCurrentIndex(
      currentIndex === 0
        ? fileInfoList.length - 1
        : currentIndex - 1,
    );
  }

  function onClickRight() {
    setCurrentIndex(
      currentIndex === fileInfoList.length - 1
        ? 0
        : currentIndex + 1,
    );
  }

  return (
    <>
      {
        currentIndex > -1 && (
          <FileViewer
            message={message}
            currentIndex={currentIndex}
            onClickLeft={onClickLeft}
            onClickRight={onClickRight}
            onClose={onClose}
          />
        )
      }
      <ImageGrid
        className={className}
        message={message}
        isReactionEnabled={isReactionEnabled}
      >
        {
          fileInfoList.map((fileInfo: UploadedFileInfo, index: number) => {
            return <div
              className='multiple-files-image-renderer-wrapper'
              onClick={() => setCurrentIndex(index)}
              key={`multiple-files-image-renderer-${index}-${fileInfo.plainUrl}`}
            >
              <ImageRenderer
                url={fileInfo.url}
                width={MULTIPLE_FILES_IMAGE_SIDE_LENGTH}
                height={MULTIPLE_FILES_IMAGE_SIDE_LENGTH}
                borderRadius={MULTIPLE_FILES_IMAGE_BORDER_RADIUS}
                defaultComponent={
                  <Icon type={IconTypes.ADD} fillColor={IconColors.PRIMARY}/>
                }
              />
            </div>;
          })
        }
      </ImageGrid>
    </>
  );
}
