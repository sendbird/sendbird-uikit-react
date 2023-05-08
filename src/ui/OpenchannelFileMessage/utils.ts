import { IconTypes } from '../Icon';

export const checkFileType = (fileUrl: string): string => {
  const audioFile = /(\.mp3)$/i;
  const gifFile = /(\.gif)$/i;
  if (audioFile.test(fileUrl)) {
    return IconTypes.FILE_AUDIO;
  }
  if (gifFile.test(fileUrl)) {
    return IconTypes.GIF;
  }
  return IconTypes.FILE_DOCUMENT;
};

export const truncate = (fullStr:string, strLen: number): string => {
  if (fullStr === null || fullStr === undefined) return '';
  if (fullStr.length <= strLen) return fullStr;
  const separator = '...';
  const sepLen = separator.length;
  const charsToShow = strLen - sepLen;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
};
