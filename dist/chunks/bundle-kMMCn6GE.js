import { c as __spreadArray } from './bundle-KMsJXUN2.js';
import React__default from 'react';
import { g as getStringSet } from './bundle-Tg3CrpQU.js';

var Typography = {
    H_1: 'H_1',
    H_2: 'H_2',
    SUBTITLE_1: 'SUBTITLE_1',
    SUBTITLE_2: 'SUBTITLE_2',
    BODY_1: 'BODY_1',
    BODY_2: 'BODY_2',
    BUTTON_1: 'BUTTON_1',
    BUTTON_2: 'BUTTON_2',
    BUTTON_3: 'BUTTON_3',
    CAPTION_1: 'CAPTION_1',
    CAPTION_2: 'CAPTION_2',
    CAPTION_3: 'CAPTION_3',
};
var Colors = {
    ONBACKGROUND_1: 'ONBACKGROUND_1',
    ONBACKGROUND_2: 'ONBACKGROUND_2',
    ONBACKGROUND_3: 'ONBACKGROUND_3',
    ONBACKGROUND_4: 'ONBACKGROUND_4',
    ONCONTENT_1: 'ONCONTENT_1',
    ONCONTENT_2: 'ONCONTENT_2',
    PRIMARY: 'PRIMARY',
    ERROR: 'ERROR',
    SECONDARY_3: 'SECONDARY_3',
};

function changeTypographyToClassName(type) {
    switch (type) {
        case Typography.H_1: return 'sendbird-label--h-1';
        case Typography.H_2: return 'sendbird-label--h-2';
        case Typography.SUBTITLE_1: return 'sendbird-label--subtitle-1';
        case Typography.SUBTITLE_2: return 'sendbird-label--subtitle-2';
        case Typography.BODY_1: return 'sendbird-label--body-1';
        case Typography.BODY_2: return 'sendbird-label--body-2';
        case Typography.BUTTON_1: return 'sendbird-label--button-1';
        case Typography.BUTTON_2: return 'sendbird-label--button-2';
        case Typography.BUTTON_3: return 'sendbird-label--button-3';
        case Typography.CAPTION_1: return 'sendbird-label--caption-1';
        case Typography.CAPTION_2: return 'sendbird-label--caption-2';
        case Typography.CAPTION_3: return 'sendbird-label--caption-3';
        default: return '';
    }
}
function changeColorToClassName(color) {
    switch (color) {
        case Colors.ONBACKGROUND_1: return 'sendbird-label--color-onbackground-1';
        case Colors.ONBACKGROUND_2: return 'sendbird-label--color-onbackground-2';
        case Colors.ONBACKGROUND_3: return 'sendbird-label--color-onbackground-3';
        case Colors.ONBACKGROUND_4: return 'sendbird-label--color-onbackground-4';
        case Colors.ONCONTENT_1: return 'sendbird-label--color-oncontent-1';
        case Colors.ONCONTENT_2: return 'sendbird-label--color-oncontent-2';
        case Colors.PRIMARY: return 'sendbird-label--color-primary'; // should be Primary-3 fix me
        case Colors.ERROR: return 'sendbird-label--color-error';
        case Colors.SECONDARY_3: return 'sendbird-label--color-secondary-3';
        default: return '';
    }
}

function Label(_a) {
    var _b = _a.className, className = _b === void 0 ? [] : _b, type = _a.type, color = _a.color, _c = _a.children, children = _c === void 0 ? null : _c;
    return (
    // Donot make this into div
    // Mention uses Label. If we use div, it would break the mention detection on Paste
    // https://github.com/sendbird/sendbird-uikit-react/pull/479
    React__default.createElement("span", { className: __spreadArray(__spreadArray([], (Array.isArray(className) ? className : [className]), true), [
            'sendbird-label',
            changeTypographyToClassName(type),
            changeColorToClassName(color),
        ], false).join(' ') }, children));
}
var LabelTypography = Typography;
var LabelColors = Colors;
var LabelStringSet = getStringSet('en');

export { Label as L, LabelTypography as a, LabelColors as b, LabelStringSet as c, changeColorToClassName as d };
//# sourceMappingURL=bundle-kMMCn6GE.js.map
