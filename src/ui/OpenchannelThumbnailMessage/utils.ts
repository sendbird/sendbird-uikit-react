import { isImage, isVideo } from '../../utils';

export const SUPPORTING_TYPES = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  UNSUPPORTED: 'UNSUPPORTED',
};

export const getSupportingFileType = (type: string): string => {
  if (isImage(type)) {
    return SUPPORTING_TYPES.IMAGE;
  }
  if (isVideo(type)) {
    return SUPPORTING_TYPES.VIDEO;
  }
  return SUPPORTING_TYPES.UNSUPPORTED;
};
