/**
 * This function helps consider the every condition
 * related to enabling emoji reaction feature.
 */
function getIsReactionEnabled(_a) {
    var _b = _a.isBroadcast, isBroadcast = _b === void 0 ? false : _b, _c = _a.isSuper, isSuper = _c === void 0 ? false : _c, _d = _a.globalLevel, globalLevel = _d === void 0 ? true : _d, moduleLevel = _a.moduleLevel;
    return !(isBroadcast || isSuper) && (moduleLevel !== null && moduleLevel !== void 0 ? moduleLevel : globalLevel);
}

export { getIsReactionEnabled as g };
//# sourceMappingURL=bundle-ay4_3U9k.js.map
