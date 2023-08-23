import { FileInfo } from './types';
import { UploadedFileInfo } from '@sendbird/chat/message';

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

export const msg0 = {
  messageId: 16131097,
  messageType: 'file',
  channelUrl: 'sendbird_group_channel_12373168_f986d10807a7cc7c184e22ca8ac2137bc32bc57c',
  data: '',
  customType: '',
  createdAt: 1583415812675,
  updatedAt: 0,
  channelType: 'group',
  mentionType: 'users',
  url: 'https://static.sendbird.com/sample/profiles/profile_15_512px.png',
  name: 'sent-mail (1).png',
  size: 9250,
  type: 'image/png',
  sender: {
    nickname: 'hoon102',
    profileUrl: 'https://static.sendbird.com/sample/profiles/profile_15_512px.png',
    userId: 'hoon102',
    connectionStatus: 'nonavailable',
    lastSeenAt: 0,
  },
  reqId: '1583413644783',
  requireAuth: false,
  requestState: 'succeeded',
  errorCode: 0,
  isFileMessage: () => {
    return true;
  },
  isMultipleFilesMessage: () => {
    return false;
  },
};

export const msg1 = {
  messageId: 16134939,
  messageType: 'file',
  channelUrl: 'sendbird_group_channel_12373168_f986d10807a7cc7c184e22ca8ac2137bc32bc57c',
  data: '',
  customType: '',
  createdAt: 1583419511445,
  updatedAt: 0,
  channelType: 'group',
  mentionType: 'users',
  url: 'https://static.sendbird.com/sample/profiles/profile_15_512px.png',
  name: 'chris-ddack.mp4',
  size: 3651596,
  type: 'video/mp4',
  sender: {
    nickname: 'hoon100',
    profileUrl: 'https://static.sendbird.com/sample/profiles/profile_34_512px.png',
    userId: 'hoon100',
    connectionStatus: 'nonavailable',
    lastSeenAt: 0,
  },
  reqId: '1583418579600',
  requireAuth: false,
  requestState: 'succeeded',
  errorCode: 0,
  isFileMessage: () => {
    return true;
  },
  isMultipleFilesMessage: () => {
    return false;
  },
};

export const msg2 = {
  messageId: 16134940,
  messageType: 'file',
  channelUrl: 'sendbird_group_channel_12373168_f986d10807a7cc7c184e22ca8ac2137bc32bc57c',
  data: '',
  customType: '',
  createdAt: 1583419511455,
  updatedAt: 0,
  channelType: 'group',
  mentionType: 'users',
  fileInfoList: FILE_INFO_LIST.map((fileInfo: FileInfo): UploadedFileInfo => {
    return {
      fileName: fileInfo.name,
      mimeType: fileInfo.type,
      url: fileInfo.url,
    } as UploadedFileInfo;
  }),
  sender: {
    nickname: 'hoon100',
    profileUrl: 'https://static.sendbird.com/sample/profiles/profile_34_512px.png',
    userId: 'hoon100',
    connectionStatus: 'nonavailable',
    lastSeenAt: 0,
  },
  reqId: '1583418579600',
  requireAuth: false,
  requestState: 'succeeded',
  errorCode: 0,
  isFileMessage: () => {
    return false;
  },
  isMultipleFilesMessage: () => {
    return true;
  },
};
