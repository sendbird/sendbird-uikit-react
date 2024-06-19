export function asSafeURL(url: string) {
  let safeURL = decodeURIComponent(url);

  try {
    const { protocol } = new URL(safeURL);
    if (['https:', 'http:'].some((it) => it === protocol.toLowerCase())) {
      return safeURL;
    } else {
      return '#';
    }
  } catch (error) {
    if (!safeURL.startsWith('http://') && !safeURL.startsWith('https://')) {
      safeURL = 'https://' + safeURL;
    }
  }

  return safeURL;
}
