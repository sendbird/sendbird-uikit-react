'use strict';

var LocalizationContext = require('./LocalizationContext-1fa24ffc.js');
var React = require('react');
var PropTypes = require('prop-types');
var index = require('./index-ef8b2d5d.js');
var index$1 = require('./index-ad1a8cab.js');
var index$2 = require('./index-9f60cdd8.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var PropTypes__default = /*#__PURE__*/_interopDefaultLegacy(PropTypes);

function Badge(_ref) {
  var count = _ref.count,
      maxLevel = _ref.maxLevel,
      className = _ref.className;

  var _useContext = React.useContext(LocalizationContext.LocalizationContext),
      stringSet = _useContext.stringSet;

  var maximumNumber = parseInt('9'.repeat(maxLevel > 6 ? 6 : maxLevel), 10);
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: [].concat(LocalizationContext._toConsumableArray(Array.isArray(className) ? className : [className]), ['sendbird-badge']).join(' ')
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-badge__text"
  }, /*#__PURE__*/React__default["default"].createElement(index.Label, {
    type: index.LabelTypography.CAPTION_2,
    color: index.LabelColors.ONCONTENT_1
  }, count > maximumNumber ? "".concat(maximumNumber).concat(stringSet.BADGE__OVER) : count)));
}
Badge.propTypes = {
  count: PropTypes__default["default"].number.isRequired,
  maxLevel: PropTypes__default["default"].number,
  className: PropTypes__default["default"].oneOfType([PropTypes__default["default"].string, PropTypes__default["default"].arrayOf(PropTypes__default["default"].string)])
};
Badge.defaultProps = {
  maxLevel: 2,
  className: []
};

var filterUser = function filterUser(idsToFilter) {
  return function (currentId) {
    return idsToFilter.includes(currentId);
  };
};

var InviteMembers = function InviteMembers(props) {
  var userQueryCreator = props.userQueryCreator,
      closeModal = props.closeModal,
      _onSubmit = props.onSubmit,
      submitText = props.submitText,
      titleText = props.titleText,
      idsToFilter = props.idsToFilter,
      swapParams = props.swapParams;

  var _useState = React.useState([]),
      _useState2 = LocalizationContext._slicedToArray(_useState, 2),
      users = _useState2[0],
      setUsers = _useState2[1];

  var _useState3 = React.useState({}),
      _useState4 = LocalizationContext._slicedToArray(_useState3, 2),
      selectedUsers = _useState4[0],
      setSelectedUsers = _useState4[1];

  var _useContext = React.useContext(LocalizationContext.LocalizationContext),
      stringSet = _useContext.stringSet;

  var _useState5 = React.useState({}),
      _useState6 = LocalizationContext._slicedToArray(_useState5, 2),
      usersDataSource = _useState6[0],
      setUsersDataSource = _useState6[1];

  var selectedCount = Object.keys(selectedUsers).length;
  React.useEffect(function () {
    var applicationUserListQuery = userQueryCreator();
    setUsersDataSource(applicationUserListQuery);
    applicationUserListQuery.next(function (res, err) {
      // eslint-disable-next-line no-underscore-dangle
      var users_ = res;
      var error = err;

      if (swapParams) {
        users_ = err;
        error = users_;
      }

      if (error) {
        return;
      }

      setUsers(users_);
    });
  }, []);
  return /*#__PURE__*/React__default["default"].createElement(index$1.Modal, {
    titleText: titleText,
    submitText: submitText,
    type: index$1.Type.PRIMARY,
    onCancel: closeModal,
    onSubmit: function onSubmit() {
      var selectedUserList = Object.keys(selectedUsers);

      if (selectedUserList.length > 0) {
        _onSubmit(selectedUserList);

        closeModal();
      }
    }
  }, /*#__PURE__*/React__default["default"].createElement("div", null, /*#__PURE__*/React__default["default"].createElement(index.Label, {
    color: selectedCount > 0 ? index.LabelColors.PRIMARY : index.LabelColors.ONBACKGROUND_3,
    type: index.LabelTypography.CAPTION_1
  }, "".concat(selectedCount, " ").concat(stringSet.MODAL__INVITE_MEMBER__SELECTEC)), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-create-channel--scroll",
    onScroll: function onScroll(e) {
      var hasNext = usersDataSource.hasNext;
      var fetchMore = e.target.clientHeight + e.target.scrollTop === e.target.scrollHeight;

      if (hasNext && fetchMore) {
        usersDataSource.next(function (usersBatch, error) {
          if (error) {
            return;
          }

          setUsers([].concat(LocalizationContext._toConsumableArray(users), LocalizationContext._toConsumableArray(usersBatch)));
        });
      }
    }
  }, users.map(function (user) {
    return !filterUser(idsToFilter)(user.userId) && /*#__PURE__*/React__default["default"].createElement(index$2.UserListItem, {
      key: user.userId,
      user: user,
      checkBox: true,
      checked: selectedUsers[user.userId],
      onChange: function onChange(event) {
        var modifiedSelectedUsers = LocalizationContext._objectSpread2(LocalizationContext._objectSpread2({}, selectedUsers), {}, LocalizationContext._defineProperty({}, event.target.id, event.target.checked));

        if (!event.target.checked) {
          delete modifiedSelectedUsers[event.target.id];
        }

        setSelectedUsers(modifiedSelectedUsers);
      }
    });
  }))));
};

InviteMembers.propTypes = {
  idsToFilter: PropTypes__default["default"].arrayOf(PropTypes__default["default"].string),
  swapParams: PropTypes__default["default"].bool,
  userQueryCreator: PropTypes__default["default"].func.isRequired,
  closeModal: PropTypes__default["default"].func.isRequired,
  onSubmit: PropTypes__default["default"].func.isRequired,
  submitText: PropTypes__default["default"].string,
  titleText: PropTypes__default["default"].string
};
InviteMembers.defaultProps = {
  swapParams: false,
  submitText: 'create',
  titleText: 'Create new channel',
  idsToFilter: []
};

var createDefaultUserListQuery = function createDefaultUserListQuery(_ref) {
  var sdk = _ref.sdk,
      _ref$userFilledApplic = _ref.userFilledApplicationUserListQuery,
      userFilledApplicationUserListQuery = _ref$userFilledApplic === void 0 ? {} : _ref$userFilledApplic;
  var params = sdk.createApplicationUserListQuery();

  if (userFilledApplicationUserListQuery) {
    Object.keys(userFilledApplicationUserListQuery).forEach(function (key) {
      params[key] = userFilledApplicationUserListQuery[key];
    });
  }

  return params;
};

var getApplicationAttributes = function getApplicationAttributes() {
  var sdk = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _sdk$appInfo = sdk.appInfo,
      appInfo = _sdk$appInfo === void 0 ? {} : _sdk$appInfo;
  var _appInfo$applicationA = appInfo.applicationAttributes,
      applicationAttributes = _appInfo$applicationA === void 0 ? [] : _appInfo$applicationA;
  return applicationAttributes;
};

var isBroadcastChannelEnabled = function isBroadcastChannelEnabled() {
  var sdk = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var ALLOW_BROADCAST_CHANNEL = 'allow_broadcast_channel';
  var applicationAttributes = getApplicationAttributes(sdk);

  if (Array.isArray(applicationAttributes)) {
    return applicationAttributes.includes(ALLOW_BROADCAST_CHANNEL);
  }

  return false;
};
var isSuperGroupChannelEnabled = function isSuperGroupChannelEnabled() {
  var sdk = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var ALLOW_SUPER_GROUP_CHANNEL = 'allow_super_group_channel';
  var applicationAttributes = getApplicationAttributes(sdk);

  if (Array.isArray(applicationAttributes)) {
    return applicationAttributes.includes(ALLOW_SUPER_GROUP_CHANNEL);
  }

  return false;
};
var setChannelType = function setChannelType(params, type) {
  if (type === 'broadcast') {
    // eslint-disable-next-line no-param-reassign
    params.isBroadcast = true;
  }

  if (type === 'supergroup') {
    // eslint-disable-next-line no-param-reassign
    params.isSuper = true;
  }

  return params;
};
var createChannel = function createChannel(sdk, selectedUsers, onBeforeCreateChannel, userId) {
  var type = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'group';
  return new Promise(function (resolve, reject) {
    // have custom params
    if (onBeforeCreateChannel) {
      var _params = onBeforeCreateChannel(selectedUsers);

      setChannelType(_params, type);
      sdk.GroupChannel.createChannel(_params, function (response, error) {
        var swapParams = sdk.getErrorFirstCallback();
        var groupChannel = response;
        var err = error;

        if (swapParams) {
          groupChannel = error;
          err = response;
        }

        if (err) {
          reject(err);
        }

        resolve(groupChannel);
      });
      return;
    }

    var params = new sdk.GroupChannelParams();
    params.addUserIds(selectedUsers);
    params.isDistinct = false;

    if (userId) {
      params.operatorUserIds = [userId];
    }

    setChannelType(params, type); // do not have custom params

    sdk.GroupChannel.createChannel(params, function (response, error) {
      var swapParams = sdk.getErrorFirstCallback();
      var groupChannel = response;
      var err = error;

      if (swapParams) {
        groupChannel = error;
        err = response;
      }

      if (err) {
        reject(err);
      }

      resolve(groupChannel);
    });
  });
};

var LeaveChannel = function LeaveChannel(props) {
  var onCloseModal = props.onCloseModal,
      onLeaveChannel = props.onLeaveChannel;
  return /*#__PURE__*/React__default["default"].createElement(index$1.Modal, {
    onCancel: onCloseModal,
    onSubmit: onLeaveChannel,
    submitText: "Leave",
    titleText: "Leave this channel?"
  });
};

LeaveChannel.propTypes = {
  onCloseModal: PropTypes__default["default"].func.isRequired,
  onLeaveChannel: PropTypes__default["default"].func.isRequired
};

exports.Badge = Badge;
exports.InviteMembers = InviteMembers;
exports.LeaveChannel = LeaveChannel;
exports.createChannel = createChannel;
exports.createDefaultUserListQuery = createDefaultUserListQuery;
exports.isBroadcastChannelEnabled = isBroadcastChannelEnabled;
exports.isSuperGroupChannelEnabled = isSuperGroupChannelEnabled;
//# sourceMappingURL=LeaveChannel-9ab1c921.js.map
