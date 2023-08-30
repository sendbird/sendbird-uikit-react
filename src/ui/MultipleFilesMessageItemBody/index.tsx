import React, { ReactElement, useState } from 'react';

import Icon, { IconTypes, IconColors } from '../Icon';
import { MultipleFilesMessage, UploadedFileInfo } from '@sendbird/chat/message';
import ImageRenderer from '../ImageRenderer';
import ImageGrid from '../ImageGrid';
import FileViewer from '../FileViewer';
import {
  MULTIPLE_FILES_IMAGE_BORDER_RADIUS,
  MULTIPLE_FILES_IMAGE_SIDE_LENGTH,
  MULTIPLE_FILES_IMAGE_THUMBNAIL_SIDE_LENGTH,
} from './const';
import './index.scss';

interface GridItemProps {
  sideLength?: string;
  borderRadius?: string;
}

interface Props {
  className?: string;
  gridItemProps?: GridItemProps;
  message: MultipleFilesMessage;
  isByMe?: boolean;
  mouseHover?: boolean;
  isReactionEnabled?: boolean;
  truncateLimit?: number;
}

export default function MultipleFilesMessageItemBody({
  className,
  gridItemProps,
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
              className='sendbird-multiple-files-image-renderer-wrapper'
              onClick={() => setCurrentIndex(index)}
              key={`sendbird-multiple-files-image-renderer-${index}-${fileInfo.plainUrl}`}
            >
              <ImageRenderer
                url={fileInfo.url}
                width={gridItemProps?.sideLength ?? MULTIPLE_FILES_IMAGE_SIDE_LENGTH}
                height={gridItemProps?.sideLength ?? MULTIPLE_FILES_IMAGE_SIDE_LENGTH}
                borderRadius={gridItemProps?.borderRadius ?? MULTIPLE_FILES_IMAGE_BORDER_RADIUS}
                defaultComponent={
                  <div
                    className="sendbird-multiple-files-image-renderer__thumbnail__placeholder"
                  >
                    <div className="sendbird-multiple-files-image-renderer__thumbnail__placeholder__icon">
                      <Icon
                        type={IconTypes.THUMBNAIL_NONE}
                        fillColor={IconColors.ON_BACKGROUND_2}
                        width={MULTIPLE_FILES_IMAGE_THUMBNAIL_SIDE_LENGTH}
                        height={MULTIPLE_FILES_IMAGE_THUMBNAIL_SIDE_LENGTH}
                      />
                    </div>
                  </div>
                }
              />
            </div>;
          })
        }
      </ImageGrid>
    </>
  );
}
