'use strict';

var isEmpty = function (val) { return (val === null || val === undefined); };
// Some Ids return string and number inconsistently
// only use to compare IDs
function compareIds(a, b) {
    if (isEmpty(a) || isEmpty(b)) {
        return false;
    }
    var aString = a.toString();
    var bString = b.toString();
    return aString === bString;
}

exports.compareIds = compareIds;
//# sourceMappingURL=bundle-vmQPp-90.js.map
