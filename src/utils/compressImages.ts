import { ImageCompressionOptions } from '../lib/Sendbird';
import pxToNumber from './pxToNumber';
import { Logger } from '../lib/SendbirdState';

interface CompressImageParams {
  imageFile: File;
  compressionRate: number;
  resizingWidth?: number;
  resizingHeight?: number;
}

export const compressImage = ({
  imageFile,
  compressionRate,
  resizingWidth,
  resizingHeight,
}: CompressImageParams): Promise<File> => {
  const image = document.createElement('img');
  return new Promise((resolve, reject) => {
    image.src = URL.createObjectURL(imageFile);
    image.onerror = reject;
    image.onload = () => {
      URL.revokeObjectURL(image.src);
      const canvas = document.createElement('canvas');

      const originWidth = image.width;
      const originHeight = image.height;
      let targetResizingWidth = (!resizingWidth || resizingWidth > originWidth) ? originWidth : resizingWidth;
      let targetResizingHeight = (!resizingHeight || resizingHeight > originHeight) ? originHeight : resizingHeight;
      const widthRatio = originWidth / targetResizingWidth;
      const heightRatio = originHeight / targetResizingHeight;

      /**
       * Set the target resizing values again with the calculated ratios
       * to use the impactful value, so the original images' ratio won't be broken.
       */
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

export interface CompressImagesParams {
  files: File[];
  imageCompression: ImageCompressionOptions;
  logger?: Logger;
}
export const compressImages = async ({
  files,
  logger,
  imageCompression,
}: CompressImagesParams) => {
  const { compressionRate } = imageCompression;
  const resizingWidth = pxToNumber(imageCompression.resizingWidth);
  const resizingHeight = pxToNumber(imageCompression.resizingHeight);

  const result = {
    failedIndexes: [] as number[],
    compressedFiles: [] as File[],
  };

  if (!(Array.isArray(files) && files.length > 0)) {
    logger?.warning('utils - compressImages: There are no files.', files);
    return result;
  }
  if (compressionRate < 0 || 1 < compressionRate) {
    logger?.warning('utils - compressImages: The compressionRate is not acceptable.', compressionRate);
    return result;
  }

  await Promise.all(
    files
      .map(async (file, index) => {
        if (!(file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg')) {
          logger?.warning('utils - compressImages: The fileType is not compressible.', { file, index });
          result.failedIndexes.push(index);
          result.compressedFiles.push(file);
          return;
        }

        try {
          const compressedImage = await compressImage({
            imageFile: file,
            compressionRate,
            resizingWidth,
            resizingHeight,
          });
          result.compressedFiles.push(compressedImage);
        } catch (err) {
          result.failedIndexes.push(index);
          logger?.warning('utils - compressImages: Failed to compress image file', { file, err });
        }
      }),
  );

  logger?.info('utils - compressImages: Finished compressing images', result);
  return result;
};
