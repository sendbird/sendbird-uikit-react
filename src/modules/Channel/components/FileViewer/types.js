// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types
const SUPPORTED_MIMES = {
  IMAGE: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/svg+xml',
    'image/webp', // not supported in IE
  ],
  VIDEO: [
    'video/mpeg',
    'video/ogg',
    'video/webm',
    'video/mp4',
  ],
};

export const isImage = (type) => SUPPORTED_MIMES.IMAGE.indexOf(type) >= 0;
export const isVideo = (type) => SUPPORTED_MIMES.VIDEO.indexOf(type) >= 0;
export const isGif = (type) => type === 'image/gif';
export const unSupported = (type) => !(isImage(type) || isVideo(type));

export default SUPPORTED_MIMES;
