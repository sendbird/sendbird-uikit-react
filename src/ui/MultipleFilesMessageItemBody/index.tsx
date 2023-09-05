import React, {ReactElement, useMemo, useState} from 'react';

import Icon, { IconTypes, IconColors } from '../Icon';
import { MultipleFilesMessage, UploadedFileInfo } from '@sendbird/chat/message';
import ImageRenderer from '../ImageRenderer';
import ImageGrid from '../ImageGrid';
import FileViewer from '../FileViewer';
import {
  MULTIPLE_FILES_IMAGE_BORDER_RADIUS,
  MULTIPLE_FILES_IMAGE_BORDER_RADIUS_THREAD,
  MULTIPLE_FILES_IMAGE_SIDE_LENGTH,
  MULTIPLE_FILES_IMAGE_THUMBNAIL_SIDE_LENGTH,
} from './const';
import './index.scss';
import { useMediaQueryContext } from '../../lib/MediaQueryContext';
import { useDynamicSideLength } from './useGridImageSideLength';

interface Props {
  className?: string;
  message: MultipleFilesMessage;
  isByMe?: boolean;
  mouseHover?: boolean;
  isReactionEnabled?: boolean;
  truncateLimit?: number;
  isThread?: boolean;
}

export default function MultipleFilesMessageItemBody({
  className,
  message,
  isReactionEnabled = false,
  isThread = false,
}: Props): ReactElement {
  const { isMobile } = useMediaQueryContext();
  const [fileInfoList] = useState<UploadedFileInfo[]>(message.fileInfoList);
  const [imageSideLength] = useDynamicSideLength({ isThread, isMobile });
  const [dynamicMinWidth, dynamicMinHeight] = useMemo(() => {
    return useDynamicSideLength({
      width,
      height,
      maxSideLength,
      defaultMinLength: '400px',
    });
  }, [width]);
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

  return imageSideLength && (
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
                fixedSize={false}
                width={imageSideLength}
                maxSideLength={MULTIPLE_FILES_IMAGE_SIDE_LENGTH}
                height={imageSideLength}
                borderRadius={!isThread
                  ? MULTIPLE_FILES_IMAGE_BORDER_RADIUS
                  : MULTIPLE_FILES_IMAGE_BORDER_RADIUS_THREAD
                }
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
