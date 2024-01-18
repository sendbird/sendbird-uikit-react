import React, { ReactElement, useState } from 'react';

import Icon, { IconColors, IconTypes } from '../Icon';
import { MultipleFilesMessage, SendingStatus } from '@sendbird/chat/message';
import ImageRenderer, { getBorderRadiusForMultipleImageRenderer } from '../ImageRenderer';
import ImageGrid from '../ImageGrid';
import FileViewer from '../FileViewer';
import './index.scss';
import { MULTIPLE_FILES_IMAGE_BORDER_RADIUS, MULTIPLE_FILES_IMAGE_SIDE_LENGTH, MULTIPLE_FILES_IMAGE_THUMBNAIL_SIDE_LENGTH } from './const';
import { isGif } from '../../utils';
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
  threadMessageKindKey?: string;
  statefulFileInfoList?: StatefulFileInfo[];
}

export default function MultipleFilesMessageItemBody({
  className,
  message,
  isReactionEnabled = false,
  threadMessageKindKey,
  statefulFileInfoList = [],
}: Props): ReactElement {
  const [currentFileViewerIndex, setCurrentFileViewerIndex] = useState(-1);

  function onClose() {
    setCurrentFileViewerIndex(-1);
  }

  function onClickLeft() {
    setCurrentFileViewerIndex(currentFileViewerIndex === 0 ? statefulFileInfoList.length - 1 : currentFileViewerIndex - 1);
  }

  function onClickRight() {
    setCurrentFileViewerIndex(currentFileViewerIndex === statefulFileInfoList.length - 1 ? 0 : currentFileViewerIndex + 1);
  }

  return (
    threadMessageKindKey && (
      <>
        {currentFileViewerIndex > -1 && (
          <FileViewer
            message={message}
            statefulFileInfoList={statefulFileInfoList}
            currentIndex={currentFileViewerIndex}
            onClickLeft={onClickLeft}
            onClickRight={onClickRight}
            onClose={onClose}
          />
        )}
        <ImageGrid className={className} message={message} isReactionEnabled={isReactionEnabled}>
          {statefulFileInfoList.map((fileInfo: StatefulFileInfo, index: number) => {
            return (
              <div
                className="sendbird-multiple-files-image-renderer-wrapper"
                onClick={message.sendingStatus === SendingStatus.SUCCEEDED ? () => setCurrentFileViewerIndex(index) : undefined}
                key={`sendbird-multiple-files-image-renderer-${index}-${fileInfo.url}`}
              >
                <ImageRenderer
                  url={fileInfo.thumbnails?.[0]?.url ?? fileInfo.url}
                  fixedSize={false}
                  width={MULTIPLE_FILES_IMAGE_SIDE_LENGTH[threadMessageKindKey]}
                  maxSideLength={MULTIPLE_FILES_IMAGE_SIDE_LENGTH.CHAT_WEB}
                  height={MULTIPLE_FILES_IMAGE_SIDE_LENGTH[threadMessageKindKey]}
                  borderRadius={getBorderRadiusForMultipleImageRenderer(
                    MULTIPLE_FILES_IMAGE_BORDER_RADIUS[threadMessageKindKey],
                    index,
                    statefulFileInfoList.length,
                  )}
                  shadeOnHover={true}
                  isUploaded={!!fileInfo.isUploaded}
                  placeHolder={({ style }) => {
                    if (isGif(fileInfo.mimeType)) return <ImagePlaceholder.GIF style={style} />;
                    return <ImagePlaceholder.Default style={style} />;
                  }}
                  defaultComponent={<ImagePlaceholder.LoadError />}
                />
              </div>
            );
          })}
        </ImageGrid>
      </>
    )
  );
}

const ImagePlaceholder = {
  Default: ({ style }: { style: Record<string, string | number> }) => (
    <div className="sendbird-multiple-files-image-renderer__thumbnail__placeholder" style={style}>
      <Icon
        type={IconTypes.PHOTO}
        fillColor={IconColors.ON_BACKGROUND_2}
        width={MULTIPLE_FILES_IMAGE_THUMBNAIL_SIDE_LENGTH}
        height={MULTIPLE_FILES_IMAGE_THUMBNAIL_SIDE_LENGTH}
      />
    </div>
  ),
  GIF: ({ style }: { style: Record<string, string | number> }) => (
    <div className="sendbird-multiple-files-image-renderer__thumbnail__placeholder" style={style}>
      <div className="sendbird-multiple-files-image-renderer__thumbnail__placeholder__icon">
        <Icon
          type={IconTypes.GIF}
          fillColor={IconColors.THUMBNAIL_ICON}
          width={MULTIPLE_FILES_IMAGE_THUMBNAIL_SIDE_LENGTH}
          height={MULTIPLE_FILES_IMAGE_THUMBNAIL_SIDE_LENGTH}
        />
      </div>
    </div>
  ),
  LoadError: () => (
    <div className="sendbird-multiple-files-image-renderer__thumbnail__placeholder">
      <Icon
        type={IconTypes.THUMBNAIL_NONE}
        fillColor={IconColors.ON_BACKGROUND_2}
        width={MULTIPLE_FILES_IMAGE_THUMBNAIL_SIDE_LENGTH}
        height={MULTIPLE_FILES_IMAGE_THUMBNAIL_SIDE_LENGTH}
      />
    </div>
  ),
};
