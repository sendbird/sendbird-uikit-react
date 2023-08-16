import React, { useState } from 'react';
import FilesViewer, { FileInfo } from '../index';
import ImageRenderer from '../../ImageRenderer';
import Icon, { IconColors, IconTypes } from '../../Icon';
import ImageGrid from '../../ImageGrid';

const description = `
  \`import FilesViewer from "@sendbird/uikit-react/ui/FilesViewer";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/FilesViewer',
  component: FilesViewer,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

const PROFILE_FILE_INFO: FileInfo = {
  name: 'profile image',
  url: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
  type: 'image/png',
};

const EARTH_FILE_INFO: FileInfo = {
  name: 'earth image',
  url: 'https://sendbird-upload.s3.amazonaws.com/2D7B4CDB-932F-4082-9B09-A1153792DC8D/'
    + 'upload/n/8af7775ca1d34d7681d7e61b56067136.jpg',
  type: 'image/jpg',
};

const FILE_INFO_LIST: FileInfo[] = [
  PROFILE_FILE_INFO,
  EARTH_FILE_INFO,
  EARTH_FILE_INFO,
  PROFILE_FILE_INFO,
  PROFILE_FILE_INFO,
];

export const withImageGrid = () => {
  const [fileInfoList] = useState<FileInfo[]>(FILE_INFO_LIST);
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
        currentIndex > -1 && <FilesViewer
          nickname='hoon102'
          profileUrl='https://static.sendbird.com/sample/profiles/profile_15_512px.png'
          fileInfoList={fileInfoList}
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
