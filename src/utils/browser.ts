const isIOS = (userAgent: string) => /iPhone|iPad|iPod/i.test(userAgent);
const isWebkit = (userAgent: string) => /WebKit/i.test(userAgent);
const isChrome = (userAgent: string) => /Chrome/i.test(userAgent);
export const isSafari = (userAgent: string) => !isChrome(userAgent) && /Safari/i.test(userAgent);
export const isMobileIOS = (userAgent: string) => {
  return isIOS(userAgent) && (isWebkit(userAgent) || isSafari(userAgent));
};
