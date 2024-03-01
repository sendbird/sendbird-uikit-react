'use strict';

/* eslint-disable no-bitwise */
/* eslint-disable eqeqeq */
/* eslint-disable no-mixed-operators */
// https://stackoverflow.com/a/2117523
// used mainly for dom key generation
var uuidv4 = function () { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
}); };

exports.uuidv4 = uuidv4;
//# sourceMappingURL=bundle-Gzug-R-w.js.map
