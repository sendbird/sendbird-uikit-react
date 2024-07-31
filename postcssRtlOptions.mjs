export default {
  prefixSelectorTransformer: (prefix, selector) => {
    // To increase specificity https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity 
    // for certain classnames within .sendbird-conversation__messages context.
    // This only applies when the root dir is set as 'rtl' but forceLeftToRightMessageLayout is true.
    if ([
      // Normal message list
      'sendbird-message-content',
      // Thread message list
      'sendbird-thread-list-item-content',
      'sendbird-parent-message-info'
    ].some(cls => selector.includes(cls))) {
      return `.sendbird-conversation__messages${prefix} ${selector}`;
    }
    return `${prefix} ${selector}`;
  },
}
