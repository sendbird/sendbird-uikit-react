'use strict';

var React = require('react');
var LocalizationContext = require('../../chunks/bundle-Nz6fSUye.js');
var ui_MessageInput = require('../../ui/MessageInput.js');
var OpenChannel_context = require('../../chunks/bundle-YHE2Epiq.js');
require('../../chunks/bundle-xYV6cL9E.js');
require('../../chunks/bundle-eyiJykZ-.js');
require('../../chunks/bundle-zYqQA3cT.js');
require('../../chunks/bundle-Ka3VBiNF.js');
require('../../chunks/bundle-2FdL4aA6.js');
require('../../ui/IconButton.js');
require('../../ui/Button.js');
require('../../chunks/bundle-2Pq38lvD.js');
require('../../chunks/bundle-vnNrprB3.js');
require('dompurify');
require('../../chunks/bundle-suIvps1I.js');
require('../../chunks/bundle-bXe-_rig.js');
require('../../chunks/bundle-scYpz-Ln.js');
require('../../ui/Icon.js');
require('../../chunks/bundle-Xwl4gw4D.js');
require('../../useSendbirdStateContext.js');
require('../../withSendbird.js');
require('../../chunks/bundle-bjSez2lv.js');
require('@sendbird/chat/groupChannel');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-8G36Z6Or.js');
require('../../chunks/bundle-URV6GLmd.js');
require('../../chunks/bundle-HnlcCy36.js');
require('../../chunks/bundle-vmQPp-90.js');
require('../../chunks/bundle-NfUcey5s.js');
require('@sendbird/chat');
require('@sendbird/chat/openChannel');
require('../../chunks/bundle-NNEanMqk.js');
require('../../chunks/bundle-izlAxQOw.js');
require('../../chunks/bundle-5mXB6h1C.js');
require('../../hooks/useModal.js');
require('../../chunks/bundle-NeYvE4zX.js');
require('react-dom');
require('../../chunks/bundle-37dz9yoi.js');
require('../../chunks/bundle-4jVvOUfV.js');

var OpenChannelInput = React.forwardRef(function (props, ref) {
    var _a = OpenChannel_context.useOpenChannelContext(), currentOpenChannel = _a.currentOpenChannel, disabled = _a.disabled, handleSendMessage = _a.handleSendMessage, handleFileUpload = _a.handleFileUpload, amIMuted = _a.amIMuted;
    var channel = currentOpenChannel;
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    var value = props.value;
    function getPlaceHolderString() {
        if (amIMuted) {
            return stringSet.MESSAGE_INPUT__PLACE_HOLDER__MUTED;
        }
        if (disabled) {
            return stringSet.MESSAGE_INPUT__PLACE_HOLDER__DISABLED;
        }
        return '';
    }
    if (!channel) {
        return null;
    }
    return (React.createElement("div", { className: "sendbird-openchannel-footer" },
        React.createElement(ui_MessageInput, { channel: currentOpenChannel, ref: ref, value: value, disabled: disabled, isVoiceMessageEnabled: false, onSendMessage: handleSendMessage, onFileUpload: handleFileUpload, placeholder: getPlaceHolderString() })));
});

module.exports = OpenChannelInput;
//# sourceMappingURL=OpenChannelInput.js.map
