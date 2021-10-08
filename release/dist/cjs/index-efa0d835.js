'use strict';

var LocalizationContext = require('./LocalizationContext-abd404ea.js');
var React = require('react');
var PropTypes = require('prop-types');
var index = require('./index-b6751523.js');
var index$1 = require('./index-5737cbcc.js');
var reactDom = require('react-dom');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var PropTypes__default = /*#__PURE__*/_interopDefaultLegacy(PropTypes);

var isEmpty = function isEmpty(val) {
  return val === null || val === undefined;
}; // Some Ids return string and number inconsistently
// only use to comapre IDs


function compareIds (a, b) {
  if (isEmpty(a) || isEmpty(b)) {
    return false;
  }

  var aString = a.toString();
  var bString = b.toString();
  return aString === bString;
}

var http = /https?:\/\//;
function LinkLabel(_ref) {
  var className = _ref.className,
      src = _ref.src,
      type = _ref.type,
      color = _ref.color,
      children = _ref.children;
  var url = http.test(src) ? src : "http://".concat(src);
  return /*#__PURE__*/React__default["default"].createElement("a", {
    className: [].concat(LocalizationContext._toConsumableArray(Array.isArray(className) ? className : [className]), ['sendbird-link-label', color ? index.changeColorToClassName(color) : '']).join(' '),
    href: url,
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/React__default["default"].createElement(index.Label, {
    className: "sendbird-link-label__label",
    type: type,
    color: color
  }, children));
}
LinkLabel.propTypes = {
  className: PropTypes__default["default"].oneOfType([PropTypes__default["default"].string, PropTypes__default["default"].arrayOf(PropTypes__default["default"].string)]),
  src: PropTypes__default["default"].string.isRequired,
  type: PropTypes__default["default"].oneOf(Object.keys(index.LabelTypography)).isRequired,
  color: PropTypes__default["default"].oneOf(Object.keys(index.LabelColors)).isRequired,
  children: PropTypes__default["default"].oneOfType([PropTypes__default["default"].string, PropTypes__default["default"].element, PropTypes__default["default"].arrayOf(PropTypes__default["default"].string), PropTypes__default["default"].arrayOf(PropTypes__default["default"].element)]).isRequired
};
LinkLabel.defaultProps = {
  className: ''
};

function DateSeparator(_ref) {
  var className = _ref.className,
      children = _ref.children,
      separatorColor = _ref.separatorColor;
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: [].concat(LocalizationContext._toConsumableArray(Array.isArray(className) ? className : [className]), ['sendbird-separator']).join(' ')
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: ['sendbird-separator__left', "".concat(index$1.changeColorToClassName(separatorColor), "--background-color")].join(' ')
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-separator__text"
  }, children), /*#__PURE__*/React__default["default"].createElement("div", {
    className: ['sendbird-separator__right', "".concat(index$1.changeColorToClassName(separatorColor), "--background-color")].join(' ')
  }));
}
DateSeparator.propTypes = {
  className: PropTypes__default["default"].oneOfType([PropTypes__default["default"].string, PropTypes__default["default"].arrayOf(PropTypes__default["default"].string)]),
  children: PropTypes__default["default"].oneOfType([PropTypes__default["default"].string, PropTypes__default["default"].arrayOf(PropTypes__default["default"].string), PropTypes__default["default"].element]),
  separatorColor: PropTypes__default["default"].string
};
DateSeparator.defaultProps = {
  className: '',
  children: /*#__PURE__*/React__default["default"].createElement(index.Label, {
    type: index.LabelTypography.CAPTION_2,
    color: index.LabelColors.ONBACKGROUND_2
  }, "Date Separator"),
  separatorColor: index$1.Colors.ONBACKGROUND_4
};

// import IconAttach from '../../svgs/icon-attach.svg';

var LINE_HEIGHT = 76;

var noop = function noop() {};

var KeyCode = {
  SHIFT: 16,
  ENTER: 13
};

var handleUploadFile = function handleUploadFile(callback) {
  return function (event) {
    if (event.target.files && event.target.files[0]) {
      callback(event.target.files[0]);
    } // eslint-disable-next-line no-param-reassign


    event.target.value = '';
  };
};

var MessageInput = /*#__PURE__*/React__default["default"].forwardRef(function (props, ref) {
  var isEdit = props.isEdit,
      disabled = props.disabled,
      value = props.value,
      name = props.name,
      placeholder = props.placeholder,
      maxLength = props.maxLength,
      onFileUpload = props.onFileUpload,
      onSendMessage = props.onSendMessage,
      onCancelEdit = props.onCancelEdit,
      onStartTyping = props.onStartTyping;

  var _useContext = React.useContext(LocalizationContext.LocalizationContext),
      stringSet = _useContext.stringSet;

  var fileInputRef = React.useRef(null);

  var _useState = React.useState(value),
      _useState2 = LocalizationContext._slicedToArray(_useState, 2),
      inputValue = _useState2[0],
      setInputValue = _useState2[1];

  var _useState3 = React.useState(false),
      _useState4 = LocalizationContext._slicedToArray(_useState3, 2),
      isShiftPressed = _useState4[0],
      setIsShiftPressed = _useState4[1];

  var setHeight = function setHeight() {
    try {
      var elem = ref.current;
      var MAX_HEIGHT = window.document.body.offsetHeight * 0.6;

      if (elem && elem.scrollHeight >= LINE_HEIGHT) {
        if (MAX_HEIGHT < elem.scrollHeight) {
          elem.style.height = 'auto';
          elem.style.height = "".concat(MAX_HEIGHT, "px");
        } else {
          elem.style.height = 'auto';
          elem.style.height = "".concat(elem.scrollHeight, "px");
        }
      } else {
        elem.style.height = '';
      }
    } catch (error) {// error
    }
  }; // after setHeight called twice, the textarea goes to the initialized


  React.useEffect(function () {
    setHeight();
    return setHeight;
  }, [inputValue]);

  var sendMessage = function sendMessage() {
    if (inputValue && inputValue.trim().length > 0) {
      var trimmedInputValue = inputValue.trim();

      if (isEdit) {
        onSendMessage(name, trimmedInputValue, function () {
          onCancelEdit();
        });
      } else {
        onSendMessage(trimmedInputValue);
        setInputValue('');
      }
    }
  };

  return /*#__PURE__*/React__default["default"].createElement("form", {
    className: [isEdit ? 'sendbird-message-input__edit' : '', disabled ? 'sendbird-message-input-form__disabled' : ''].join(' ')
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: ['sendbird-message-input', disabled ? 'sendbird-message-input__disabled' : ''].join(' ')
  }, /*#__PURE__*/React__default["default"].createElement("textarea", {
    className: "sendbird-message-input--textarea",
    disabled: disabled,
    ref: ref,
    name: name,
    value: inputValue,
    maxLength: maxLength,
    onChange: function onChange(e) {
      setInputValue(e.target.value);
      onStartTyping();
    },
    onKeyDown: function onKeyDown(e) {
      if (e.keyCode === KeyCode.SHIFT) {
        setIsShiftPressed(true);
      }

      if (!isShiftPressed && e.keyCode === KeyCode.ENTER) {
        e.preventDefault();
        sendMessage();
      }
    },
    onKeyUp: function onKeyUp(e) {
      if (e.keyCode === KeyCode.SHIFT) {
        setIsShiftPressed(false);
      }
    }
  }), !inputValue && /*#__PURE__*/React__default["default"].createElement(index.Label, {
    className: "sendbird-message-input--placeholder",
    type: index.LabelTypography.BODY_1,
    color: index.LabelColors.ONBACKGROUND_3
  }, placeholder || stringSet.CHANNEL__MESSAGE_INPUT__PLACE_HOLDER), !isEdit && inputValue && inputValue.trim().length > 0 && /*#__PURE__*/React__default["default"].createElement(index$1.IconButton, {
    className: "sendbird-message-input--send",
    height: "32px",
    width: "32px",
    onClick: sendMessage
  }, /*#__PURE__*/React__default["default"].createElement(index.Icon, {
    type: index.IconTypes.SEND,
    fillColor: index.IconColors.PRIMARY,
    width: "20px",
    height: "20px"
  })), !isEdit && (!inputValue || !(inputValue.trim().length > 0)) && /*#__PURE__*/React__default["default"].createElement(index$1.IconButton, {
    className: "sendbird-message-input--attach",
    height: "32px",
    width: "32px",
    onClick: function onClick() {
      // todo: clear previous input
      fileInputRef.current.click();
    }
  }, /*#__PURE__*/React__default["default"].createElement(index.Icon, {
    type: index.IconTypes.ATTACH,
    fillColor: index.IconColors.CONTENT_INVERSE,
    width: "20px",
    height: "20px"
  }), /*#__PURE__*/React__default["default"].createElement("input", {
    className: "sendbird-message-input--attach-input",
    type: "file",
    ref: fileInputRef,
    onChange: handleUploadFile(onFileUpload)
  }))), isEdit && /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-message-input--edit-action"
  }, /*#__PURE__*/React__default["default"].createElement(index$1.Button, {
    className: "sendbird-message-input--edit-action__cancel",
    type: index$1.ButtonTypes.SECONDARY,
    size: index$1.ButtonSizes.SMALL,
    onClick: onCancelEdit
  }, stringSet.BUTTON__CANCEL), /*#__PURE__*/React__default["default"].createElement(index$1.Button, {
    className: "sendbird-message-input--edit-action__save",
    type: index$1.ButtonTypes.PRIMARY,
    size: index$1.ButtonSizes.SMALL,
    onClick: function onClick() {
      if (inputValue) {
        var trimmedInputValue = inputValue.trim();
        onSendMessage(name, trimmedInputValue, function () {
          onCancelEdit();
        });
      }
    }
  }, stringSet.BUTTON__SAVE)));
});
MessageInput.propTypes = {
  placeholder: PropTypes__default["default"].oneOfType([PropTypes__default["default"].string, PropTypes__default["default"].bool]),
  isEdit: PropTypes__default["default"].bool,
  name: PropTypes__default["default"].oneOfType([PropTypes__default["default"].string, PropTypes__default["default"].number]),
  value: PropTypes__default["default"].string,
  disabled: PropTypes__default["default"].bool,
  maxLength: PropTypes__default["default"].number,
  onFileUpload: PropTypes__default["default"].func,
  onSendMessage: PropTypes__default["default"].func,
  onStartTyping: PropTypes__default["default"].func,
  onCancelEdit: PropTypes__default["default"].func
};
MessageInput.defaultProps = {
  value: '',
  onSendMessage: noop,
  name: 'sendbird-message-input',
  isEdit: false,
  disabled: false,
  placeholder: '',
  maxLength: 5000,
  onFileUpload: noop,
  onCancelEdit: noop,
  onStartTyping: noop
};

var FileViewerComponent = function FileViewerComponent(_ref) {
  var profileUrl = _ref.profileUrl,
      nickname = _ref.nickname,
      name = _ref.name,
      type = _ref.type,
      url = _ref.url,
      isByMe = _ref.isByMe,
      onClose = _ref.onClose,
      onDelete = _ref.onDelete;
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-fileviewer"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-fileviewer__header"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-fileviewer__header__left"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-fileviewer__header__left__avatar"
  }, /*#__PURE__*/React__default["default"].createElement(index.Avatar, {
    height: "32px",
    width: "32px",
    src: profileUrl
  })), /*#__PURE__*/React__default["default"].createElement(index.Label, {
    className: "sendbird-fileviewer__header__left__filename",
    type: index.LabelTypography.H_2,
    color: index.LabelColors.ONBACKGROUND_1
  }, name), /*#__PURE__*/React__default["default"].createElement(index.Label, {
    className: "sendbird-fileviewer__header__left__sender-name",
    type: index.LabelTypography.BODY_1,
    color: index.LabelColors.ONBACKGROUND_2
  }, nickname)), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-fileviewer__header__right"
  }, index$1.isSupportedFileView(type) && /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-fileviewer__header__right__actions"
  }, /*#__PURE__*/React__default["default"].createElement("a", {
    className: "sendbird-fileviewer__header__right__actions__download",
    rel: "noopener noreferrer",
    href: url,
    target: "_blank"
  }, /*#__PURE__*/React__default["default"].createElement(index.Icon, {
    type: index.IconTypes.DOWNLOAD,
    height: "24px",
    width: "24px"
  })), onDelete && isByMe && /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-fileviewer__header__right__actions__delete"
  }, /*#__PURE__*/React__default["default"].createElement(index.Icon, {
    type: index.IconTypes.DELETE,
    height: "24px",
    width: "24px",
    onClick: onDelete
  }))), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-fileviewer__header__right__actions__close"
  }, /*#__PURE__*/React__default["default"].createElement(index.Icon, {
    type: index.IconTypes.CLOSE,
    height: "24px",
    width: "24px",
    onClick: onClose
  })))), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-fileviewer__content"
  }, index$1.isVideo(type) &&
  /*#__PURE__*/
  // eslint-disable-next-line jsx-a11y/media-has-caption
  React__default["default"].createElement("video", {
    controls: true,
    className: "sendbird-fileviewer__content__video"
  }, /*#__PURE__*/React__default["default"].createElement("source", {
    src: url,
    type: type
  })), index$1.isImage(type) && /*#__PURE__*/React__default["default"].createElement("img", {
    src: url,
    alt: name,
    className: "sendbird-fileviewer__content__img"
  }), !index$1.isSupportedFileView(type) && /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-fileviewer__content__unsupported"
  }, /*#__PURE__*/React__default["default"].createElement(index.Label, {
    type: index.LabelTypography.H_1,
    color: index.LabelColors.ONBACKGROUND_1
  }, "Unsupoprted message"))));
};
FileViewerComponent.propTypes = {
  profileUrl: PropTypes__default["default"].string.isRequired,
  nickname: PropTypes__default["default"].string.isRequired,
  type: PropTypes__default["default"].string.isRequired,
  url: PropTypes__default["default"].string.isRequired,
  name: PropTypes__default["default"].string.isRequired,
  onClose: PropTypes__default["default"].func.isRequired,
  onDelete: PropTypes__default["default"].func.isRequired,
  isByMe: PropTypes__default["default"].bool
};
FileViewerComponent.defaultProps = {
  isByMe: true
};
function FileViewer(props) {
  var message = props.message,
      isByMe = props.isByMe,
      onClose = props.onClose,
      onDelete = props.onDelete;
  var sender = message.sender,
      type = message.type,
      url = message.url,
      _message$name = message.name,
      name = _message$name === void 0 ? '' : _message$name;
  var profileUrl = sender.profileUrl,
      _sender$nickname = sender.nickname,
      nickname = _sender$nickname === void 0 ? '' : _sender$nickname;
  return /*#__PURE__*/reactDom.createPortal( /*#__PURE__*/React__default["default"].createElement(FileViewerComponent, {
    profileUrl: profileUrl,
    nickname: nickname,
    type: type,
    url: url,
    name: name,
    onClose: onClose,
    onDelete: onDelete,
    isByMe: isByMe
  }), document.getElementById(index$1.MODAL_ROOT));
}
FileViewer.propTypes = {
  message: PropTypes__default["default"].shape({
    sender: PropTypes__default["default"].shape({
      profileUrl: PropTypes__default["default"].string,
      nickname: PropTypes__default["default"].string
    }),
    type: PropTypes__default["default"].string,
    url: PropTypes__default["default"].string,
    name: PropTypes__default["default"].string
  }).isRequired,
  isByMe: PropTypes__default["default"].bool,
  onClose: PropTypes__default["default"].func.isRequired,
  onDelete: PropTypes__default["default"].func.isRequired
};
FileViewer.defaultProps = {
  isByMe: true
};

exports.DateSeparator = DateSeparator;
exports.FileViewer = FileViewer;
exports.LinkLabel = LinkLabel;
exports.MessageInput = MessageInput;
exports.compareIds = compareIds;
//# sourceMappingURL=index-efa0d835.js.map
