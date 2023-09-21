import React, { ReactElement, useState } from 'react';

import Icon, { IconTypes, IconColors } from '../Icon';
import { MultipleFilesMessage, UploadedFileInfo } from '@sendbird/chat/message';
import ImageRenderer from '../ImageRenderer';
import ImageGrid from '../ImageGrid';
import FileViewer from '../FileViewer';
import './index.scss';
import { useMediaQueryContext } from '../../lib/MediaQueryContext';
import { useThreadMessageKindKeySelector } from './useThreadMessageKindKeySelector';
import {
  MULTIPLE_FILES_IMAGE_BORDER_RADIUS,
  MULTIPLE_FILES_IMAGE_SIDE_LENGTH,
  MULTIPLE_FILES_IMAGE_THUMBNAIL_SIDE_LENGTH,
} from './const';
import { isGifFileInfo } from "../../utils";

export const ThreadMessageKind = {
  PARENT: 'parent',
  CHILD: 'child',
} as const;

export type ThreadMessageKindType = typeof ThreadMessageKind[keyof typeof ThreadMessageKind];

interface Props {
  className?: string;
  message: MultipleFilesMessage;
  isByMe?: boolean;
  mouseHover?: boolean;
  isReactionEnabled?: boolean;
  truncateLimit?: number;
  threadMessageKind?: ThreadMessageKindType;
}

export default function MultipleFilesMessageItemBody({
  className,
  message,
  isReactionEnabled = false,
  threadMessageKind,
}: Props): ReactElement {
  const { isMobile } = useMediaQueryContext();
  const [fileInfoList] = useState<UploadedFileInfo[]>(message.fileInfoList);
  const threadMessageKindKey = useThreadMessageKindKeySelector({ threadMessageKind, isMobile });
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

  return threadMessageKindKey && (
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
                width={MULTIPLE_FILES_IMAGE_SIDE_LENGTH[threadMessageKindKey]}
                maxSideLength={MULTIPLE_FILES_IMAGE_SIDE_LENGTH.CHAT_WEB}
                height={MULTIPLE_FILES_IMAGE_SIDE_LENGTH[threadMessageKindKey]}
                borderRadius={MULTIPLE_FILES_IMAGE_BORDER_RADIUS[threadMessageKindKey]}
                shadeOnHover={true}
                isGif={isGifFileInfo(fileInfo)}
                defaultComponent={
                  <div
                    className="sendbird-multiple-files-image-renderer__thumbnail__placeholder"
                  >
                    <Icon
                      type={IconTypes.THUMBNAIL_NONE}
                      fillColor={IconColors.ON_BACKGROUND_2}
                      width={MULTIPLE_FILES_IMAGE_THUMBNAIL_SIDE_LENGTH}
                      height={MULTIPLE_FILES_IMAGE_THUMBNAIL_SIDE_LENGTH}
                    />
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
