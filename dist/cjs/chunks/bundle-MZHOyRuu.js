'use strict';

var React = require('react');

var DEFAULT_MOBILE = false;
// const DEFAULT_MOBILE = '768px';
var MOBILE_CLASSNAME = 'sendbird--mobile-mode';
var MediaQueryContext = React.createContext({
    breakpoint: DEFAULT_MOBILE,
    isMobile: false,
});
var addClassNameToBody = function () {
    try {
        var body = document.querySelector('body');
        body === null || body === void 0 ? void 0 : body.classList.add(MOBILE_CLASSNAME);
    }
    catch (_a) {
        // noop
    }
};
var removeClassNameFromBody = function () {
    try {
        var body = document.querySelector('body');
        body === null || body === void 0 ? void 0 : body.classList.remove(MOBILE_CLASSNAME);
    }
    catch (_a) {
        // noop
    }
};
var MediaQueryProvider = function (props) {
    var children = props.children, logger = props.logger;
    var breakpoint = (props === null || props === void 0 ? void 0 : props.breakpoint) || false;
    var _a = React.useState(false), isMobile = _a[0], setIsMobile = _a[1];
    React.useEffect(function () {
        var _a;
        var updateSize = function () {
            var _a, _b, _c, _d, _e;
            if (typeof breakpoint === 'boolean') {
                setIsMobile(breakpoint);
                if (breakpoint) {
                    (_a = logger === null || logger === void 0 ? void 0 : logger.info) === null || _a === void 0 ? void 0 : _a.call(logger, 'MediaQueryProvider: isMobile: true');
                    addClassNameToBody();
                }
                else {
                    (_b = logger === null || logger === void 0 ? void 0 : logger.info) === null || _b === void 0 ? void 0 : _b.call(logger, 'MediaQueryProvider: isMobile: false');
                    removeClassNameFromBody();
                }
            }
            else {
                var mq = window.matchMedia("(max-width: ".concat(breakpoint, ")"));
                (_c = logger === null || logger === void 0 ? void 0 : logger.info) === null || _c === void 0 ? void 0 : _c.call(logger, "MediaQueryProvider: Screensize updated to ".concat(breakpoint));
                if (mq.matches) {
                    setIsMobile(true);
                    addClassNameToBody();
                    (_d = logger === null || logger === void 0 ? void 0 : logger.info) === null || _d === void 0 ? void 0 : _d.call(logger, 'MediaQueryProvider: isMobile: true');
                }
                else {
                    setIsMobile(false);
                    removeClassNameFromBody();
                    (_e = logger === null || logger === void 0 ? void 0 : logger.info) === null || _e === void 0 ? void 0 : _e.call(logger, 'MediaQueryProvider: isMobile: false');
                }
            }
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        (_a = logger === null || logger === void 0 ? void 0 : logger.info) === null || _a === void 0 ? void 0 : _a.call(logger, 'MediaQueryProvider: addEventListener', { updateSize: updateSize });
        return function () {
            var _a;
            window.removeEventListener('resize', updateSize);
            (_a = logger === null || logger === void 0 ? void 0 : logger.info) === null || _a === void 0 ? void 0 : _a.call(logger, 'MediaQueryProvider: removeEventListener', { updateSize: updateSize });
        };
    }, [breakpoint]);
    return (React.createElement(MediaQueryContext.Provider, { value: { breakpoint: breakpoint, isMobile: isMobile } }, children));
};
var useMediaQueryContext = function () { return React.useContext(MediaQueryContext); };

exports.MediaQueryProvider = MediaQueryProvider;
exports.useMediaQueryContext = useMediaQueryContext;
//# sourceMappingURL=bundle-MZHOyRuu.js.map
