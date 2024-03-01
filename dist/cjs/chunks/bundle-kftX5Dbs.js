'use strict';

var pxToNumber = function (px) {
    if (typeof px === 'number') {
        return px;
    }
    if (typeof px === 'string') {
        var parsed = Number.parseFloat(px);
        if (!Number.isNaN(parsed)) {
            return parsed;
        }
    }
    return NaN;
};

exports.pxToNumber = pxToNumber;
//# sourceMappingURL=bundle-kftX5Dbs.js.map
