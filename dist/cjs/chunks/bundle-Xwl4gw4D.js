'use strict';

var noop = function () { };
var isMobileIOS = function (userAgent) {
    var isIOS = /iPhone|iPad|iPod/i.test(userAgent);
    var isWebkit = /WebKit/i.test(userAgent);
    var isSafari = /Safari/i.test(userAgent);
    return isIOS && (isWebkit || isSafari);
};

exports.isMobileIOS = isMobileIOS;
exports.noop = noop;
//# sourceMappingURL=bundle-Xwl4gw4D.js.map
