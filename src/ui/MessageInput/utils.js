// https://davidwalsh.name/javascript-debounce-function
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export function debounce(func, wait, immediate) {
  let timeout;
  return function _debounce() {
    const context = this;
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Sanitize that special characters of HTML tags cause XSS issue
export const sanitizeString = (str) => (
  str?.replace(/[\u00A0-\u9999<>]/gim, (i) => ''.concat('&#', i.charCodeAt(0), ';'))
);

/**
 * NodeList cannot be used with Array methods
 * @param {childNodes} NodeList
 * @returns Array of child nodes
 */
export const nodeListToArray = (childNodes) => {
  try {
    return Array.from(childNodes);
  } catch (error) {
    return [];
  }
};

export default debounce;
