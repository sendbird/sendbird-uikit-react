import React, { useState } from 'react';
import FileViewer from '../index';
import { FILE_INFO_LIST, msg0, msg2 } from '../data.mock';
import ImageRenderer from '../../ImageRenderer';
import Icon, { IconColors, IconTypes } from '../../Icon';
import ImageGrid from '../../ImageGrid';
import { FileInfo } from '../types';
import { FileMessage, MultipleFilesMessage } from '@sendbird/chat/message';

const description = `
  \`import FileViewer from "@sendbird/uikit-react/ui/FileViewer";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/FileViewer',
  component: FileViewer,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (arg) => (
  <FileViewer
    {...arg}
    onClose={() => null}
    onDelete={() => null}
    message={msg0 as unknown as FileMessage}
  />
);

export const withImageGrid = () => {
  const [fileInfoList] = useState<FileInfo[]>(FILE_INFO_LIST);
  const [currentIndex, setCurrentIndex] = useState(-1);

  function onClose() {
    setCurrentIndex(-1);
  }

  // memoize these if you want to super optimize - but this is unnecessary
  // const onClickLeft = useCallback(() => {
  //   setCurrentIndex((idx) => {
  //     return idx === 0
  //       ? fileInfoList.length - 1
  //       : idx - 1;
  //   });
  // }, [setCurrentIndex, fileInfoList.length]);

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
          message={msg2 as unknown as MultipleFilesMessage}
          currentIndex={currentIndex}
          onClickLeft={onClickLeft}
          onClickRight={onClickRight}
          onClose={onClose}
        />
      }
      <ImageGrid>
        {
          fileInfoList.map((fileInfo: FileInfo, index: number) => {
            return <div
              onClick={() => setCurrentIndex(index)}
              style={{
                cursor: 'pointer',
              }}
              key={`image-renderer-${index}`}
            >
              <ImageRenderer
                url={fileInfo.url}
                width='200px'
                height='200px'
                borderRadius='6px'
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
};
