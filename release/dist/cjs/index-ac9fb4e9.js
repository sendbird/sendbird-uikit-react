'use strict';

var LocalizationContext = require('./LocalizationContext-c3f5f713.js');
var React = require('react');
var PropTypes = require('prop-types');
var index = require('./index-da9d29e1.js');
var index$1 = require('./index-365aa798.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var PropTypes__default = /*#__PURE__*/_interopDefaultLegacy(PropTypes);

var InputLabel = function InputLabel(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/React__default["default"].createElement(index.Label, {
    className: "sendbird-input-label",
    type: index.LabelTypography.CAPTION_3,
    color: index.LabelColors.ONBACKGROUND_1
  }, children);
};
InputLabel.propTypes = {
  children: PropTypes__default["default"].string.isRequired
}; // future: add validations? onChange? more props etc etc

var Input = /*#__PURE__*/React__default["default"].forwardRef(function (props, ref) {
  var name = props.name,
      required = props.required,
      disabled = props.disabled,
      placeHolder = props.placeHolder,
      value = props.value;

  var _useState = React.useState(value),
      _useState2 = LocalizationContext._slicedToArray(_useState, 2),
      inputValue = _useState2[0],
      setInputValue = _useState2[1];

  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-input"
  }, /*#__PURE__*/React__default["default"].createElement("input", {
    className: "sendbird-input__input",
    ref: ref,
    name: name,
    required: required,
    disabled: disabled,
    value: inputValue,
    onChange: function onChange(e) {
      setInputValue(e.target.value);
    }
  }), placeHolder && !inputValue && /*#__PURE__*/React__default["default"].createElement(index.Label, {
    className: "sendbird-input__placeholder",
    type: index.LabelTypography.BODY_1,
    color: index.LabelColors.ONBACKGROUND_3
  }, placeHolder));
});
Input.propTypes = {
  name: PropTypes__default["default"].string.isRequired,
  required: PropTypes__default["default"].bool,
  disabled: PropTypes__default["default"].bool,
  placeHolder: PropTypes__default["default"].string,
  value: PropTypes__default["default"].string
};
Input.defaultProps = {
  required: false,
  disabled: false,
  placeHolder: '',
  value: ''
};

var noop = function noop() {};

function MutedAvatarOverlay(props) {
  var _a = props.height,
      height = _a === void 0 ? 24 : _a,
      _b = props.width,
      width = _b === void 0 ? 24 : _b;
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-muted-avatar",
    style: {
      height: height + "px",
      width: width + "px"
    }
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-muted-avatar__icon"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-muted-avatar__bg",
    style: {
      height: height + "px",
      width: width + "px"
    }
  }), /*#__PURE__*/React__default["default"].createElement(index.Icon, {
    type: index.IconTypes.MUTE,
    fillColor: index.IconColors.WHITE,
    width: height - 8 + "px",
    height: width - 8 + "px"
  })));
}

function Checkbox(_ref) {
  var id = _ref.id,
      checked = _ref.checked,
      onChange = _ref.onChange;

  var _useState = React.useState(checked),
      _useState2 = LocalizationContext._slicedToArray(_useState, 2),
      isChecked = _useState2[0],
      setCheck = _useState2[1];

  return /*#__PURE__*/React__default["default"].createElement("label", {
    className: "sendbird-checkbox",
    htmlFor: id
  }, /*#__PURE__*/React__default["default"].createElement("input", {
    id: id,
    type: "checkbox",
    checked: isChecked,
    onClick: function onClick() {
      return setCheck(!isChecked);
    },
    onChange: onChange
  }), /*#__PURE__*/React__default["default"].createElement("span", {
    className: "sendbird-checkbox--checkmark"
  }));
}
Checkbox.propTypes = {
  id: PropTypes__default["default"].string,
  checked: PropTypes__default["default"].bool,
  onChange: PropTypes__default["default"].func
};
Checkbox.defaultProps = {
  id: 'sendbird-checkbox-input',
  checked: false,
  onChange: function onChange() {}
};

function UserListItem(_ref) {
  var className = _ref.className,
      user = _ref.user,
      checkBox = _ref.checkBox,
      disableMessaging = _ref.disableMessaging,
      currentUser = _ref.currentUser,
      checked = _ref.checked,
      _onChange = _ref.onChange,
      action = _ref.action;
  var uniqueKey = user.userId;
  var actionRef = React__default["default"].useRef(null);
  var parentRef = React__default["default"].useRef(null);
  var avatarRef = React__default["default"].useRef(null);

  var _useContext = React.useContext(index$1.UserProfileContext),
      disableUserProfile = _useContext.disableUserProfile,
      renderUserProfile = _useContext.renderUserProfile;

  var _useContext2 = React.useContext(LocalizationContext.LocalizationContext),
      stringSet = _useContext2.stringSet;

  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: [].concat(LocalizationContext._toConsumableArray(Array.isArray(className) ? className : [className]), ['sendbird-user-list-item']).join(' '),
    ref: parentRef
  }, user.isMuted && /*#__PURE__*/React__default["default"].createElement(MutedAvatarOverlay, {
    height: 40,
    width: 40
  }), /*#__PURE__*/React__default["default"].createElement(index$1.ContextMenu, {
    menuTrigger: function menuTrigger(toggleDropdown) {
      return /*#__PURE__*/React__default["default"].createElement(index.Avatar, {
        className: "sendbird-user-list-item__avatar",
        ref: avatarRef,
        src: user.profileUrl,
        width: "40px",
        height: "40px",
        onClick: function onClick() {
          if (!disableUserProfile) {
            toggleDropdown();
          }
        }
      });
    },
    menuItems: function menuItems(closeDropdown) {
      return /*#__PURE__*/React__default["default"].createElement(index$1.MenuItems, {
        openLeft: true,
        parentRef: avatarRef // for catching location(x, y) of MenuItems
        ,
        parentContainRef: avatarRef // for toggling more options(menus & reactions)
        ,
        closeDropdown: closeDropdown,
        style: {
          paddingTop: 0,
          paddingBottom: 0
        }
      }, renderUserProfile ? renderUserProfile({
        user: user,
        currentUserId: currentUser,
        close: closeDropdown
      }) : /*#__PURE__*/React__default["default"].createElement(index$1.ConnectedUserProfile, {
        disableMessaging: disableMessaging,
        user: user,
        currentUserId: currentUser,
        onSuccess: closeDropdown
      }));
    }
  }), /*#__PURE__*/React__default["default"].createElement(index.Label, {
    className: "sendbird-user-list-item__title",
    type: index.LabelTypography.SUBTITLE_1,
    color: index.LabelColors.ONBACKGROUND_1
  }, user.nickname || stringSet.NO_NAME, currentUser === user.userId && ' (You)'), // if there is now nickname, display userId
  !user.nickname && /*#__PURE__*/React__default["default"].createElement(index.Label, {
    className: "sendbird-user-list-item__subtitle",
    type: index.LabelTypography.CAPTION_3,
    color: index.LabelColors.ONBACKGROUND_2
  }, user.userId), checkBox &&
  /*#__PURE__*/
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  React__default["default"].createElement("label", {
    className: "sendbird-user-list-item__checkbox",
    htmlFor: uniqueKey
  }, /*#__PURE__*/React__default["default"].createElement(Checkbox, {
    id: uniqueKey,
    checked: checked,
    onChange: function onChange(event) {
      return _onChange(event);
    }
  })), user.role === 'operator' && /*#__PURE__*/React__default["default"].createElement(index.Label, {
    className: "sendbird-user-list-item__operator",
    type: index.LabelTypography.SUBTITLE_2,
    color: index.LabelColors.ONBACKGROUND_2
  }, "Operator"), action && /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-user-list-item__action",
    ref: actionRef
  }, action({
    actionRef: actionRef,
    parentRef: parentRef
  })));
}
UserListItem.propTypes = {
  className: PropTypes__default["default"].oneOfType([PropTypes__default["default"].string, PropTypes__default["default"].arrayOf(PropTypes__default["default"].string)]),
  user: PropTypes__default["default"].shape({
    userId: PropTypes__default["default"].string,
    role: PropTypes__default["default"].string,
    isMuted: PropTypes__default["default"].bool,
    nickname: PropTypes__default["default"].string,
    profileUrl: PropTypes__default["default"].string
  }).isRequired,
  disableMessaging: PropTypes__default["default"].bool,
  currentUser: PropTypes__default["default"].string,
  action: PropTypes__default["default"].element,
  checkBox: PropTypes__default["default"].bool,
  checked: PropTypes__default["default"].bool,
  onChange: PropTypes__default["default"].func
};
UserListItem.defaultProps = {
  className: '',
  currentUser: '',
  checkBox: false,
  disableMessaging: false,
  checked: false,
  action: null,
  onChange: function onChange() {}
};

exports.Input = Input;
exports.InputLabel = InputLabel;
exports.MutedAvatarOverlay = MutedAvatarOverlay;
exports.UserListItem = UserListItem;
exports.noop = noop;
//# sourceMappingURL=index-ac9fb4e9.js.map
