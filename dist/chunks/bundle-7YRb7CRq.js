var noop = function () { };
var isMobileIOS = function (userAgent) {
    var isIOS = /iPhone|iPad|iPod/i.test(userAgent);
    var isWebkit = /WebKit/i.test(userAgent);
    var isSafari = /Safari/i.test(userAgent);
    return isIOS && (isWebkit || isSafari);
};

export { isMobileIOS as i, noop as n };
//# sourceMappingURL=bundle-7YRb7CRq.js.map
