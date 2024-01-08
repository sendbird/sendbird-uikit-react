import { FileInfo } from '../../ui/FileViewer/types';

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

export const FILE_INFO_LIST: FileInfo[] = [
  PROFILE_FILE_INFO,
  EARTH_FILE_INFO,
  PROFILE_FILE_INFO,
  EARTH_FILE_INFO,
  PROFILE_FILE_INFO,
];
