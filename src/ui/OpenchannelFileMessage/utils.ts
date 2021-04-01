import { IconTypes } from '../Icon';

export const checkFileType = (fileUrl: string): string => {
  let result = null;
  const imageFile = /(\.gif|\.jpg|\.jpeg|\.txt|\.pdf)$/i;
  const audioFile = /(\.mp3)$/i;
  if (imageFile.test(fileUrl)) {
    result = IconTypes.FILE_DOCUMENT;
  } else if (audioFile.test(fileUrl)) {
    result = IconTypes.FILE_AUDIO;
  }
  return result;
}

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
