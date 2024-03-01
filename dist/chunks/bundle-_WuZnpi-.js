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

export { compareIds as c };
//# sourceMappingURL=bundle-_WuZnpi-.js.map
