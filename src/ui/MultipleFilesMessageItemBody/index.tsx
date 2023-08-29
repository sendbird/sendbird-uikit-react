import React, { ReactElement, useState } from 'react';

import Icon, { IconTypes, IconColors } from '../Icon';
import { MultipleFilesMessage, UploadedFileInfo } from '@sendbird/chat/message';
import ImageRenderer from '../ImageRenderer';
import ImageGrid from '../ImageGrid';
import { msg2 } from '../FileViewer/data.mock';
import FileViewer from '../FileViewer';

interface Props {
  className?: string | Array<string>;
  message: MultipleFilesMessage;
  isByMe?: boolean;
  mouseHover?: boolean;
  isReactionEnabled?: boolean;
  truncateLimit?: number;
}

// Full width is 400px. There are two items in a row which means image width is 200px. padding is 4px and gap is 4px.
const MULTIPLE_FILES_IMAGE_SIDE_LENGTH = 'calc(200px - 6px)';
const MULTIPLE_FILES_IMAGE_BORDER_RADIUS = '6px';

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
        currentIndex > -1 && <FileViewer
          message={message}
          currentIndex={currentIndex}
          onClickLeft={onClickLeft}
          onClickRight={onClickRight}
          onClose={onClose}
        />
      }
      <ImageGrid
        className={className}
        message={message}
        isReactionEnabled={isReactionEnabled}
      >
        {
          fileInfoList.map((fileInfo: UploadedFileInfo, index: number) => {
            return <div
              onClick={() => setCurrentIndex(index)}
              style={{
                cursor: 'pointer',
              }}
              key={`image-renderer-${index}`}
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
