import { ImageCompressionOptions } from '../lib/Sendbird';
import pxToNumber from './pxToNumber';
import { Logger } from '../lib/SendbirdState';

interface CompressImageProps {
  imageFile: File;
  compressionRate: number;
  resizingWidth?: number;
  resizingHeight?: number;
}

const compressImage = ({
  imageFile,
  compressionRate,
  resizingWidth,
  resizingHeight,
}: CompressImageProps): Promise<File> => {
  const image = document.createElement('img');
  return new Promise((resolve, reject) => {
    image.src = URL.createObjectURL(imageFile);
    image.onerror = reject;
    image.onload = () => {
      URL.revokeObjectURL(image.src);
      const canvas = document.createElement('canvas');

      const originWidth = image.width;
      const originHeight = image.height;
      const widthRatio = originWidth / (resizingWidth || originWidth);
      const heightRatio = originHeight / (resizingHeight || originHeight);

      let targetResizingWidth = resizingWidth || originWidth;
      let targetResizingHeight = resizingHeight || originHeight;

      if (widthRatio > heightRatio) {
        targetResizingHeight = originHeight / (resizingWidth ? widthRatio : 1);
      } else if (heightRatio > widthRatio) {
        targetResizingWidth = originWidth / (resizingHeight ? heightRatio : 1);
      }

      canvas.width = targetResizingWidth;
      canvas.height = targetResizingHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas 2d context'));
        return;
      }

      ctx.drawImage(image, 0, 0, targetResizingWidth, targetResizingHeight);

      ctx.canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], imageFile.name, { type: imageFile.type });
            resolve(file);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        imageFile.type,
        compressionRate,
      );
    };
  });
};

export interface CompressImagesProps {
  files: File[];
  imageCompression: ImageCompressionOptions;
  logger?: Logger;
}
export const compressImages = async ({
  files,
  logger,
  imageCompression,
}: CompressImagesProps) => {
  const { compressionRate } = imageCompression;
  const resizingWidth = pxToNumber(imageCompression.resizingWidth);
  const resizingHeight = pxToNumber(imageCompression.resizingHeight);

  if (!(Array.isArray(files) && files.length > 0)) {
    logger.warning('useImageCompression: There is no file.', files);
    return;
  }
  if (compressionRate < 0 || 1 < compressionRate) {
    logger.warning('useImageCompression: The compressionRate is not acceptable.', compressionRate);
    return;
  }

  const compressedImages: File[] = [];
  const notCompressedFiles: File[] = [];

  await Promise.all(
    files
      .filter((file, index) => {
        if (file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg') {
          return true;
        }
        notCompressedFiles.push(file);
        logger.warning('useImageCompression: The file type is not compressible.', { file, index });
        return false;
      })
      .map(async (imageFile) => {
        try {
          const compressedImage = await compressImage({
            imageFile,
            compressionRate,
            resizingWidth,
            resizingHeight,
          });
          compressedImages.push(compressedImage);
        } catch (err) {
          notCompressedFiles.push(imageFile);
          logger.warning('useImageCompression: Failed to compress image file', {
            err,
            imageFile,
          });
        }
      }),
  );

  logger.info('useImageCompression: Finished compressing images', {
    compressedImages,
    notCompressedFiles,
  });
  return {
    compressedImages,
    notCompressedFiles,
  };
};
