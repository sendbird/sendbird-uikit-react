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

// Why we're doing this:
// Let's say a root div element has `dir="rtl"` (with `htmlTextDirection={'rtl'}` prop setting).

/*
<div class="sendbird-root" dir="rtl">
  ...
  // Message list
  <div class="sendbird-conversation__messages" dir="ltr">
     <div class="emoji-container">
       <span class="emoji-inner">😀</span>
     </div>
  </div>
</div>
*/

// Even though the message list element has dir="ltr" attribute,
// some children elements of the message list would have their styles overridden by the root one with the CSS settings below.
// Why? postcss-rtlcss plugin generates the CSS settings in order of rtl -> ltr.

/*
[dir="rtl"] .sendbird-message-content .emoji-container .emoji-inner {
    right: -84px; // Specificity (0.6.0)
}
[dir="ltr"] .sendbird-message-content .emoji-container .emoji-inner {
    left: -84px; // Specificity (0.6.0)
}
*/

// If both CSS settings have the same specificity, the one generated first (rtl) will be applied,
// which is not the desired result since we want the `.emoji-inner` element to have the ltr setting.

// To increase the specificity of the ltr setting,
// we can directly connect the classname of the element which has `dir='ltr'` to the children's selector in this way:

/*
.sendbird-conversation__messages[dir="ltr"] .sendbird-message-content .emoji-container .emoji-inner {
  left: -84px; // Specificity (0.7.0), will be applied
}

[dir="rtl"] .sendbird-message-content .emoji-container .emoji-inner {
    right: -84px; // Specificity (0.6.0), will be ignored
}
[dir="ltr"] .sendbird-message-content .emoji-container .emoji-inner {
    left: -84px; // Specificity (0.6.0), will be ignored
}
*/
