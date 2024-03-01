'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var ui_Label = require('../chunks/bundle-2Pq38lvD.js');
require('../chunks/bundle-zYqQA3cT.js');
require('../chunks/bundle-xYV6cL9E.js');

var PlaybackTime = function (_a) {
    var className = _a.className, _b = _a.time, time = _b === void 0 ? 0 : _b, _c = _a.labelType, labelType = _c === void 0 ? ui_Label.LabelTypography.CAPTION_2 : _c, _d = _a.labelColor, labelColor = _d === void 0 ? ui_Label.LabelColors.ONCONTENT_1 : _d;
    var naturalTime = time < 0 ? 0 : time;
    var hour = Math.floor(naturalTime / 3600000);
    var min = Math.floor(naturalTime % 3600000 / 60000);
    var sec = Math.floor((naturalTime % 3600000 % 60000) / 1000);
    return (React.createElement("div", { className: "sendbird-ui-play-time ".concat(className) },
        React.createElement(ui_Label.Label, { type: labelType, color: labelColor }, "".concat(hour ? hour + ':' : '').concat(min < 10 ? '0' : '').concat(min ? min : '0', ":").concat(sec < 10 ? '0' : '').concat(sec))));
};

exports.PlaybackTime = PlaybackTime;
exports.default = PlaybackTime;
//# sourceMappingURL=PlaybackTime.js.map
