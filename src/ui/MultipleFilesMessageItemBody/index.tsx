import React, { ReactElement, useState } from 'react';

import Icon, { IconColors, IconTypes } from '../Icon';
import { MultipleFilesMessage } from '@sendbird/chat/message';
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
import { isGif } from '../../utils';
import { useDynamicUploadedIndex } from './useDynamicUploadedIndex';
import { StatefulFileInfo } from '../../utils/createStatefulFileInfoList';

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
  const threadMessageKindKey = useThreadMessageKindKeySelector({ threadMessageKind, isMobile });
  const [currentFileViewerIndex, setCurrentFileViewerIndex] = useState(-1);
  const updatedFileInfoList = useDynamicUploadedIndex(message);

  function onClose() {
    setCurrentFileViewerIndex(-1);
  }

  function onClickLeft() {
    setCurrentFileViewerIndex(
      currentFileViewerIndex === 0
        ? updatedFileInfoList.length - 1
        : currentFileViewerIndex - 1,
    );
  }

  function onClickRight() {
    setCurrentFileViewerIndex(
      currentFileViewerIndex === updatedFileInfoList.length - 1
        ? 0
        : currentFileViewerIndex + 1,
    );
  }

  return threadMessageKindKey && (
    <>
      {
        currentFileViewerIndex > -1 && (
          <FileViewer
            message={message}
            currentIndex={currentFileViewerIndex}
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
          updatedFileInfoList.map((fileInfo: StatefulFileInfo, index: number) => {
            return <div
              className='sendbird-multiple-files-image-renderer-wrapper'
              onClick={() => setCurrentFileViewerIndex(index)}
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
                isGif={isGif(fileInfo.mimeType)}
                isUploaded={fileInfo.isUploaded}
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
