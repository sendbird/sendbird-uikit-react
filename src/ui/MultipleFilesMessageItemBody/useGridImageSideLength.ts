import {useEffect, useState} from 'react';
import {
  MULTIPLE_FILES_IMAGE_SIDE_LENGTH,
  MULTIPLE_FILES_IMAGE_SIDE_LENGTH_MOBILE,
  MULTIPLE_FILES_IMAGE_SIDE_LENGTH_THREAD,
  MULTIPLE_FILES_IMAGE_SIDE_LENGTH_THREAD_MOBILE
} from "./const";

interface DynamicSideLengthProps {
  isThread: boolean;
  isMobile: boolean;
}

export function useDynamicSideLength({
  isThread,
  isMobile,
}: DynamicSideLengthProps): string[] {

  const [imageSideLength, setImageSideLength] = useState<string>();

  useEffect(() => {
    let newImageSideLength = ''
    if (isThread) {
      newImageSideLength = isMobile
        ? MULTIPLE_FILES_IMAGE_SIDE_LENGTH_THREAD_MOBILE
        : MULTIPLE_FILES_IMAGE_SIDE_LENGTH_THREAD
    } else {
      newImageSideLength = isMobile
        ? MULTIPLE_FILES_IMAGE_SIDE_LENGTH_MOBILE
        : MULTIPLE_FILES_IMAGE_SIDE_LENGTH
    };
    setImageSideLength(newImageSideLength);
  }, [isMobile, isThread]);
  return [imageSideLength];
}
