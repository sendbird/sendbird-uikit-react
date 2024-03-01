var Colors;
(function (Colors) {
    Colors["ONBACKGROUND_1"] = "ONBACKGROUND_1";
    Colors["ONBACKGROUND_2"] = "ONBACKGROUND_2";
    Colors["ONBACKGROUND_3"] = "ONBACKGROUND_3";
    Colors["ONBACKGROUND_4"] = "ONBACKGROUND_4";
    Colors["ONCONTENT_1"] = "ONCONTENT_1";
    Colors["ONCONTENT_2"] = "ONCONTENT_2";
    Colors["PRIMARY"] = "PRIMARY";
    Colors["ERROR"] = "ERROR";
})(Colors || (Colors = {}));
var changeColorToClassName = function (color) {
    switch (color) {
        case Colors.ONBACKGROUND_1: return 'sendbird-color--onbackground-1';
        case Colors.ONBACKGROUND_2: return 'sendbird-color--onbackground-2';
        case Colors.ONBACKGROUND_3: return 'sendbird-color--onbackground-3';
        case Colors.ONBACKGROUND_4: return 'sendbird-color--onbackground-4';
        case Colors.ONCONTENT_1: return 'sendbird-color--oncontent-1';
        case Colors.PRIMARY: return 'sendbird-color--primary';
        case Colors.ERROR: return 'sendbird-color--error';
        default: return null;
    }
};

export { Colors as C, changeColorToClassName as c };
//# sourceMappingURL=bundle-02rQraFs.js.map
