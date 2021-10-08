import { b as _slicedToArray, c as LocalizationContext, e as _toConsumableArray } from './LocalizationContext-73398a14.js';
import React__default, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { L as Label, a as LabelTypography, b as LabelColors, I as Icon, c as IconTypes, d as IconColors, A as Avatar } from './index-c5ac5612.js';
import { U as UserProfileContext, C as ContextMenu, b as MenuItems, f as ConnectedUserProfile } from './index-516d7fed.js';

var InputLabel = function InputLabel(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/React__default.createElement(Label, {
    className: "sendbird-input-label",
    type: LabelTypography.CAPTION_3,
    color: LabelColors.ONBACKGROUND_1
  }, children);
};
InputLabel.propTypes = {
  children: PropTypes.string.isRequired
}; // future: add validations? onChange? more props etc etc

var Input = /*#__PURE__*/React__default.forwardRef(function (props, ref) {
  var name = props.name,
      required = props.required,
      disabled = props.disabled,
      placeHolder = props.placeHolder,
      value = props.value;

  var _useState = useState(value),
      _useState2 = _slicedToArray(_useState, 2),
      inputValue = _useState2[0],
      setInputValue = _useState2[1];

  return /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-input"
  }, /*#__PURE__*/React__default.createElement("input", {
    className: "sendbird-input__input",
    ref: ref,
    name: name,
    required: required,
    disabled: disabled,
    value: inputValue,
    onChange: function onChange(e) {
      setInputValue(e.target.value);
    }
  }), placeHolder && !inputValue && /*#__PURE__*/React__default.createElement(Label, {
    className: "sendbird-input__placeholder",
    type: LabelTypography.BODY_1,
    color: LabelColors.ONBACKGROUND_3
  }, placeHolder));
});
Input.propTypes = {
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  placeHolder: PropTypes.string,
  value: PropTypes.string
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
  return /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-muted-avatar",
    style: {
      height: height + "px",
      width: width + "px"
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-muted-avatar__icon"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-muted-avatar__bg",
    style: {
      height: height + "px",
      width: width + "px"
    }
  }), /*#__PURE__*/React__default.createElement(Icon, {
    type: IconTypes.MUTE,
    fillColor: IconColors.WHITE,
    width: height - 8 + "px",
    height: width - 8 + "px"
  })));
}

function Checkbox(_ref) {
  var id = _ref.id,
      checked = _ref.checked,
      onChange = _ref.onChange;

  var _useState = useState(checked),
      _useState2 = _slicedToArray(_useState, 2),
      isChecked = _useState2[0],
      setCheck = _useState2[1];

  return /*#__PURE__*/React__default.createElement("label", {
    className: "sendbird-checkbox",
    htmlFor: id
  }, /*#__PURE__*/React__default.createElement("input", {
    id: id,
    type: "checkbox",
    checked: isChecked,
    onClick: function onClick() {
      return setCheck(!isChecked);
    },
    onChange: onChange
  }), /*#__PURE__*/React__default.createElement("span", {
    className: "sendbird-checkbox--checkmark"
  }));
}
Checkbox.propTypes = {
  id: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func
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
  var actionRef = React__default.useRef(null);
  var parentRef = React__default.useRef(null);
  var avatarRef = React__default.useRef(null);

  var _useContext = useContext(UserProfileContext),
      disableUserProfile = _useContext.disableUserProfile,
      renderUserProfile = _useContext.renderUserProfile;

  var _useContext2 = useContext(LocalizationContext),
      stringSet = _useContext2.stringSet;

  return /*#__PURE__*/React__default.createElement("div", {
    className: [].concat(_toConsumableArray(Array.isArray(className) ? className : [className]), ['sendbird-user-list-item']).join(' '),
    ref: parentRef
  }, user.isMuted && /*#__PURE__*/React__default.createElement(MutedAvatarOverlay, {
    height: 40,
    width: 40
  }), /*#__PURE__*/React__default.createElement(ContextMenu, {
    menuTrigger: function menuTrigger(toggleDropdown) {
      return /*#__PURE__*/React__default.createElement(Avatar, {
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
      return /*#__PURE__*/React__default.createElement(MenuItems, {
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
      }) : /*#__PURE__*/React__default.createElement(ConnectedUserProfile, {
        disableMessaging: disableMessaging,
        user: user,
        currentUserId: currentUser,
        onSuccess: closeDropdown
      }));
    }
  }), /*#__PURE__*/React__default.createElement(Label, {
    className: "sendbird-user-list-item__title",
    type: LabelTypography.SUBTITLE_1,
    color: LabelColors.ONBACKGROUND_1
  }, user.nickname || stringSet.NO_NAME, currentUser === user.userId && ' (You)'), // if there is now nickname, display userId
  !user.nickname && /*#__PURE__*/React__default.createElement(Label, {
    className: "sendbird-user-list-item__subtitle",
    type: LabelTypography.CAPTION_3,
    color: LabelColors.ONBACKGROUND_2
  }, user.userId), checkBox &&
  /*#__PURE__*/
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  React__default.createElement("label", {
    className: "sendbird-user-list-item__checkbox",
    htmlFor: uniqueKey
  }, /*#__PURE__*/React__default.createElement(Checkbox, {
    id: uniqueKey,
    checked: checked,
    onChange: function onChange(event) {
      return _onChange(event);
    }
  })), user.role === 'operator' && /*#__PURE__*/React__default.createElement(Label, {
    className: "sendbird-user-list-item__operator",
    type: LabelTypography.SUBTITLE_2,
    color: LabelColors.ONBACKGROUND_2
  }, "Operator"), action && /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-user-list-item__action",
    ref: actionRef
  }, action({
    actionRef: actionRef,
    parentRef: parentRef
  })));
}
UserListItem.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  user: PropTypes.shape({
    userId: PropTypes.string,
    role: PropTypes.string,
    isMuted: PropTypes.bool,
    nickname: PropTypes.string,
    profileUrl: PropTypes.string
  }).isRequired,
  disableMessaging: PropTypes.bool,
  currentUser: PropTypes.string,
  action: PropTypes.element,
  checkBox: PropTypes.bool,
  checked: PropTypes.bool,
  onChange: PropTypes.func
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

export { InputLabel as I, MutedAvatarOverlay as M, UserListItem as U, Input as a, noop as n };
//# sourceMappingURL=index-a7d2d399.js.map
