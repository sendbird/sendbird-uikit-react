import React__default from 'react';
import { a as LabelTypography, b as LabelColors, L as Label } from '../chunks/bundle-ljRDDTki.js';
import '../chunks/bundle-UnAcr6wX.js';
import '../chunks/bundle-PIrj5Rm1.js';

var PlaybackTime = function (_a) {
    var className = _a.className, _b = _a.time, time = _b === void 0 ? 0 : _b, _c = _a.labelType, labelType = _c === void 0 ? LabelTypography.CAPTION_2 : _c, _d = _a.labelColor, labelColor = _d === void 0 ? LabelColors.ONCONTENT_1 : _d;
    var naturalTime = time < 0 ? 0 : time;
    var hour = Math.floor(naturalTime / 3600000);
    var min = Math.floor(naturalTime % 3600000 / 60000);
    var sec = Math.floor((naturalTime % 3600000 % 60000) / 1000);
    return (React__default.createElement("div", { className: "sendbird-ui-play-time ".concat(className) },
        React__default.createElement(Label, { type: labelType, color: labelColor }, "".concat(hour ? hour + ':' : '').concat(min < 10 ? '0' : '').concat(min ? min : '0', ":").concat(sec < 10 ? '0' : '').concat(sec))));
};

export { PlaybackTime, PlaybackTime as default };
//# sourceMappingURL=PlaybackTime.js.map
