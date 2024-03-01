'use strict';

var React = require('react');
var LocalizationContext = require('../../chunks/bundle-WKa05h0_.js');
var ui_MessageInput = require('../../ui/MessageInput.js');
var OpenChannel_context = require('../../chunks/bundle-T5IkV5L8.js');
require('../../chunks/bundle-Yzhiyr0t.js');
require('../../chunks/bundle-HY8cubCp.js');
require('../../chunks/bundle-xbdnJE9-.js');
require('../../chunks/bundle-ZK5PhDxY.js');
require('../../chunks/bundle-pi-jk3re.js');
require('../../ui/IconButton.js');
require('../../ui/Button.js');
require('../../chunks/bundle-KkCwxjVN.js');
require('../../chunks/bundle-d6SaHkg0.js');
require('dompurify');
require('../../chunks/bundle-h9YDQxpQ.js');
require('../../chunks/bundle-fqNhuMna.js');
require('../../chunks/bundle-yk__vyz_.js');
require('../../ui/Icon.js');
require('../../chunks/bundle-jCTpndN0.js');
require('../../useSendbirdStateContext.js');
require('../../withSendbird.js');
require('../../chunks/bundle-Uw6P-cM9.js');
require('@sendbird/chat/groupChannel');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-tNuJSOqI.js');
require('../../chunks/bundle-2_j4r1Cc.js');
require('../../chunks/bundle-uzKywAVp.js');
require('../../chunks/bundle-kLoWlyQs.js');
require('../../chunks/bundle-VqRllkVd.js');
require('@sendbird/chat');
require('@sendbird/chat/openChannel');
require('../../chunks/bundle-SOIkTCep.js');
require('../../chunks/bundle-a5LHhP6m.js');
require('../../chunks/bundle-kftX5Dbs.js');
require('../../hooks/useModal.js');
require('../../chunks/bundle-6hGNMML2.js');
require('react-dom');
require('../../chunks/bundle-4WvE40Un.js');
require('../../chunks/bundle-Atn5EZwu.js');

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
