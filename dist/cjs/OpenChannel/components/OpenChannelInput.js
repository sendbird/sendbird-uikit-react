'use strict';

var React = require('react');
var LocalizationContext = require('../../chunks/bundle-60kIt9Rq.js');
var ui_MessageInput = require('../../ui/MessageInput.js');
var OpenChannel_context = require('../../chunks/bundle-aEJHNG2z.js');
require('../../chunks/bundle-eH49AisR.js');
require('../../chunks/bundle-gDA5XZ0C.js');
require('../../chunks/bundle-2dG9SU7T.js');
require('../../chunks/bundle-m-c1V2jE.js');
require('../../chunks/bundle-eBZWCIEU.js');
require('../../ui/IconButton.js');
require('../../ui/Button.js');
require('../../chunks/bundle-26QzFMMl.js');
require('../../chunks/bundle-jh--qeoy.js');
require('dompurify');
require('../../chunks/bundle-9O_6GMbC.js');
require('../../chunks/bundle-q13fOZ_V.js');
require('../../chunks/bundle-TCEkQl9R.js');
require('../../ui/Icon.js');
require('../../chunks/bundle-QStqvuCY.js');
require('../../useSendbirdStateContext.js');
require('../../withSendbird.js');
require('../../chunks/bundle-wzulmlgb.js');
require('@sendbird/chat/groupChannel');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-3fb9w4KI.js');
require('../../chunks/bundle-Q2J-7okW.js');
require('../../chunks/bundle-DKcL-93i.js');
require('../../chunks/bundle-ZoEtk6Hz.js');
require('../../chunks/bundle-LutGJd7y.js');
require('@sendbird/chat');
require('@sendbird/chat/openChannel');
require('../../chunks/bundle-Gzug-R-w.js');
require('../../chunks/bundle-Z1BkfIY5.js');
require('../../chunks/bundle-uGaTvmsl.js');
require('../../hooks/useModal.js');
require('../../chunks/bundle-CfdtYkhL.js');
require('react-dom');
require('../../chunks/bundle-MZHOyRuu.js');
require('../../chunks/bundle-I79mHo_2.js');

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
