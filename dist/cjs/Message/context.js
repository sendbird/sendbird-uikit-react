'use strict';

var React = require('react');

// todo@v4.0.0: combine with the provider in core-ts, see:
// https://github.com/sendbird/sendbird-uikit-core-ts
// packages/react-uikit-message-template-view/src/context/MessageContextProvider.tsx
var defaultValue = {
    message: {},
    isByMe: false,
};
var MessageContext = React.createContext(defaultValue);
var MessageProvider = function (props) {
    var children = props.children, message = props.message, _a = props.isByMe, isByMe = _a === void 0 ? false : _a;
    return (React.createElement(MessageContext.Provider, { value: {
            message: message,
            isByMe: isByMe,
        } }, children));
};
var useMessageContext = function () {
    var value = React.useContext(MessageContext);
    if (value === undefined) {
        throw new Error('useMessageContext must be used within a MessageProvider');
    }
    return value;
};

exports.MessageProvider = MessageProvider;
exports.useMessageContext = useMessageContext;
//# sourceMappingURL=context.js.map
