'use strict';

exports.Colors = void 0;
(function (Colors) {
    Colors["ONBACKGROUND_1"] = "ONBACKGROUND_1";
    Colors["ONBACKGROUND_2"] = "ONBACKGROUND_2";
    Colors["ONBACKGROUND_3"] = "ONBACKGROUND_3";
    Colors["ONBACKGROUND_4"] = "ONBACKGROUND_4";
    Colors["ONCONTENT_1"] = "ONCONTENT_1";
    Colors["ONCONTENT_2"] = "ONCONTENT_2";
    Colors["PRIMARY"] = "PRIMARY";
    Colors["ERROR"] = "ERROR";
})(exports.Colors || (exports.Colors = {}));
var changeColorToClassName = function (color) {
    switch (color) {
        case exports.Colors.ONBACKGROUND_1: return 'sendbird-color--onbackground-1';
        case exports.Colors.ONBACKGROUND_2: return 'sendbird-color--onbackground-2';
        case exports.Colors.ONBACKGROUND_3: return 'sendbird-color--onbackground-3';
        case exports.Colors.ONBACKGROUND_4: return 'sendbird-color--onbackground-4';
        case exports.Colors.ONCONTENT_1: return 'sendbird-color--oncontent-1';
        case exports.Colors.PRIMARY: return 'sendbird-color--primary';
        case exports.Colors.ERROR: return 'sendbird-color--error';
        default: return null;
    }
};

exports.changeColorToClassName = changeColorToClassName;
//# sourceMappingURL=bundle-oaDSLq17.js.map
