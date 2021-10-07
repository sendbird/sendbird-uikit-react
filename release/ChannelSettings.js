import { b as _slicedToArray, c as LocalizationContext, d as __spreadArray, _ as __assign, w as withSendbirdContext, u as uuidv4, e as _toConsumableArray } from './LocalizationContext-0bd08445.js';
import React__default, { useRef, useState, useContext, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { M as Modal, T as Type, a as TextButton, C as ContextMenu, I as IconButton, b as MenuItems, c as MenuItem, B as Button, d as ButtonTypes, e as ButtonSizes, U as UserProfileContext, f as ConnectedUserProfile, g as getSdk, h as UserProfileProvider } from './index-1e7efcaa.js';
import { I as InviteMembers$1, B as Badge, c as createDefaultUserListQuery, L as LeaveChannel } from './LeaveChannel-7e01fdfa.js';
import { A as Avatar, L as Label, a as LabelTypography, b as LabelColors, I as Icon, c as IconTypes, d as IconColors, P as PlaceHolder, f as PlaceHolderTypes } from './index-f1fc6f50.js';
import { I as InputLabel, a as Input, n as noop, U as UserListItem$2, M as MutedAvatarOverlay } from './index-61bf322a.js';
import { C as ChannelAvatar } from './index-f57972db.js';
import { A as AccordionGroup, a as Accordion } from './index-fb132cac.js';
import 'react-dom';
import './utils-895e86c1.js';

var EditDetails = function EditDetails(props) {
  var _onSubmit = props.onSubmit,
      onCancel = props.onCancel,
      channel = props.channel,
      userId = props.userId,
      theme = props.theme;
  var inputRef = useRef(null);
  var formRef = useRef(null);
  var hiddenInputRef = useRef(null);

  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      currentImg = _useState2[0],
      setCurrentImg = _useState2[1];

  var _useState3 = useState(null),
      _useState4 = _slicedToArray(_useState3, 2),
      newFile = _useState4[0],
      setNewFile = _useState4[1];

  var _useContext = useContext(LocalizationContext),
      stringSet = _useContext.stringSet;

  var title = channel.name;
  return /*#__PURE__*/React__default.createElement(Modal, {
    titleText: stringSet.MODAL__CHANNEL_INFORMATION__TITLE,
    submitText: stringSet.BUTTON__SAVE,
    onCancel: onCancel,
    onSubmit: function onSubmit() {
      if (title !== '' && !inputRef.current.value) {
        if (formRef.current.reportValidity) {
          // might not work in explorer
          formRef.current.reportValidity();
        }

        return;
      }

      _onSubmit(newFile, inputRef.current.value);

      onCancel();
    },
    type: Type.PRIMARY
  }, /*#__PURE__*/React__default.createElement("form", {
    className: "channel-profile-form",
    ref: formRef,
    onSubmit: function onSubmit(e) {
      e.preventDefault();
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "channel-profile-form__img-section"
  }, /*#__PURE__*/React__default.createElement(InputLabel, null, stringSet.MODAL__CHANNEL_INFORMATION__CHANNEL_IMAGE), /*#__PURE__*/React__default.createElement("div", {
    className: "channel-profile-form__avatar"
  }, currentImg ? /*#__PURE__*/React__default.createElement(Avatar, {
    height: "80px",
    width: "80px",
    src: currentImg
  }) : /*#__PURE__*/React__default.createElement(ChannelAvatar, {
    height: 80,
    width: 80,
    channel: channel,
    userId: userId,
    theme: theme
  })), /*#__PURE__*/React__default.createElement("input", {
    ref: hiddenInputRef,
    type: "file",
    accept: "image/gif, image/jpeg, image/png",
    style: {
      display: 'none'
    },
    onChange: function onChange(e) {
      setCurrentImg(URL.createObjectURL(e.target.files[0]));
      setNewFile(e.target.files[0]);
      hiddenInputRef.current.value = '';
    }
  }), /*#__PURE__*/React__default.createElement(TextButton, {
    className: "channel-profile-form__avatar-button",
    onClick: function onClick() {
      return hiddenInputRef.current.click();
    },
    notUnderline: true
  }, /*#__PURE__*/React__default.createElement(Label, {
    type: LabelTypography.BUTTON_1,
    color: LabelColors.PRIMARY
  }, stringSet.MODAL__CHANNEL_INFORMATION__UPLOAD))), /*#__PURE__*/React__default.createElement("div", {
    className: "channel-profile-form__name-section"
  }, /*#__PURE__*/React__default.createElement(InputLabel, null, stringSet.MODAL__CHANNEL_INFORMATION__CHANNEL_NAME), /*#__PURE__*/React__default.createElement(Input, {
    required: title !== '',
    name: "channel-profile-form__name",
    ref: inputRef,
    value: title,
    placeHolder: stringSet.MODAL__CHANNEL_INFORMATION__INPUT__PLACE_HOLDER
  }))));
};

EditDetails.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  channel: PropTypes.shape({
    name: PropTypes.string
  }).isRequired,
  userId: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired
};

var ChannelProfile = function ChannelProfile(props) {
  var disabled = props.disabled,
      channel = props.channel,
      userId = props.userId,
      theme = props.theme,
      onChannelInfoChange = props.onChannelInfoChange;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      showModal = _useState2[0],
      setShowModal = _useState2[1];

  var _useContext = useContext(LocalizationContext),
      stringSet = _useContext.stringSet;

  var getChannelName = function getChannelName() {
    if (channel && channel.name && channel.name !== 'Group Channel') {
      return channel.name;
    }

    if (channel && (channel.name === 'Group Channel' || !channel.name)) {
      return channel.members.map(function (member) {
        return member.nickname || stringSet.NO_NAME;
      }).join(', ');
    }

    return stringSet.NO_TITLE;
  };

  return /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-channel-profile"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-channel-profile--inner"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-channel-profile__avatar"
  }, /*#__PURE__*/React__default.createElement(ChannelAvatar, {
    channel: channel,
    userId: userId,
    theme: theme,
    width: 80,
    height: 80
  })), /*#__PURE__*/React__default.createElement(Label, {
    className: "sendbird-channel-profile__title",
    type: LabelTypography.SUBTITLE_2,
    color: LabelColors.ONBACKGROUND_1
  }, getChannelName()), /*#__PURE__*/React__default.createElement(TextButton, {
    disabled: disabled,
    className: "sendbird-channel-profile__edit",
    onClick: function onClick() {
      if (disabled) {
        return;
      }

      setShowModal(true);
    },
    notUnderline: true
  }, /*#__PURE__*/React__default.createElement(Label, {
    type: LabelTypography.BUTTON_1,
    color: disabled ? LabelColors.ONBACKGROUND_2 : LabelColors.PRIMARY
  }, stringSet.CHANNEL_SETTING__PROFILE__EDIT)), showModal && /*#__PURE__*/React__default.createElement(EditDetails, {
    onCancel: function onCancel() {
      return setShowModal(false);
    },
    onSubmit: onChannelInfoChange,
    channel: channel,
    userId: userId,
    theme: theme
  })));
};

ChannelProfile.propTypes = {
  channel: PropTypes.shape({
    name: PropTypes.string,
    members: PropTypes.arrayOf(PropTypes.shape({
      nickname: PropTypes.string
    }))
  }).isRequired,
  userId: PropTypes.string.isRequired,
  theme: PropTypes.string,
  disabled: PropTypes.bool,
  onChannelInfoChange: PropTypes.func
};
ChannelProfile.defaultProps = {
  theme: 'light',
  disabled: false,
  onChannelInfoChange: function onChannelInfoChange() {}
};

function MembersModal(_a) {
  var hideModal = _a.hideModal,
      channel = _a.channel,
      currentUser = _a.currentUser;

  var _b = useState([]),
      members = _b[0],
      setMembers = _b[1];

  var _c = useState(null),
      memberQuery = _c[0],
      setMemberQuery = _c[1];

  useEffect(function () {
    var memberListQuery = channel.createMemberListQuery();
    memberListQuery.limit = 20;
    memberListQuery.next(function (members, error) {
      if (error) {
        return;
      }

      setMembers(members);
    });
    setMemberQuery(memberListQuery);
  }, []);
  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(Modal, {
    hideFooter: true,
    onCancel: function onCancel() {
      return hideModal();
    },
    onSubmit: noop,
    titleText: "All Members"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-more-members__popup-scroll",
    onScroll: function onScroll(e) {
      var hasNext = memberQuery.hasNext;
      var target = e.target;
      var fetchMore = target.clientHeight + target.scrollTop === target.scrollHeight;

      if (hasNext && fetchMore) {
        memberQuery.next(function (o, error) {
          if (error) {
            return;
          }

          setMembers(__spreadArray(__spreadArray([], members, true), o, true));
        });
      }
    }
  }, members.map(function (member) {
    return /*#__PURE__*/React__default.createElement(UserListItem$2, {
      user: member,
      key: member.userId,
      currentUser: currentUser,
      action: function action(_a) {
        var parentRef = _a.parentRef,
            actionRef = _a.actionRef;
        return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, channel.myRole === 'operator' && /*#__PURE__*/React__default.createElement(ContextMenu, {
          menuTrigger: function menuTrigger(toggleDropdown) {
            return /*#__PURE__*/React__default.createElement(IconButton, {
              className: "sendbird-user-message__more__menu",
              width: "32px",
              height: "32px",
              onClick: toggleDropdown
            }, /*#__PURE__*/React__default.createElement(Icon, {
              width: "24px",
              height: "24px",
              type: IconTypes.MORE,
              fillColor: IconColors.CONTENT_INVERSE
            }));
          },
          menuItems: function menuItems(closeDropdown) {
            return /*#__PURE__*/React__default.createElement(MenuItems, {
              parentContainRef: parentRef,
              parentRef: actionRef // for catching location(x, y) of MenuItems
              ,
              closeDropdown: closeDropdown,
              openLeft: true
            }, /*#__PURE__*/React__default.createElement(MenuItem, {
              onClick: function onClick() {
                if (member.role !== 'operator') {
                  channel.addOperators([member.userId], function () {
                    setMembers(members.map(function (m) {
                      if (m.userId === member.userId) {
                        return __assign(__assign({}, member), {
                          role: 'operator'
                        });
                      }

                      return m;
                    }));
                    closeDropdown();
                  });
                } else {
                  channel.removeOperators([member.userId], function () {
                    setMembers(members.map(function (m) {
                      if (m.userId === member.userId) {
                        return __assign(__assign({}, member), {
                          role: ''
                        });
                      }

                      return m;
                    }));
                    closeDropdown();
                  });
                }
              }
            }, member.role !== 'operator' ? 'Promote to operator' : 'Demote operator'), // No muted members in broadcast channel
            !channel.isBroadcast && /*#__PURE__*/React__default.createElement(MenuItem, {
              onClick: function onClick() {
                if (member.isMuted) {
                  channel.unmuteUser(member, function () {
                    setMembers(members.map(function (m) {
                      if (m.userId === member.userId) {
                        return __assign(__assign({}, member), {
                          isMuted: false
                        });
                      }

                      return m;
                    }));
                    closeDropdown();
                  });
                } else {
                  channel.muteUser(member, function () {
                    setMembers(members.map(function (m) {
                      if (m.userId === member.userId) {
                        return __assign(__assign({}, member), {
                          isMuted: true
                        });
                      }

                      return m;
                    }));
                    closeDropdown();
                  });
                }
              }
            }, member.isMuted ? 'Unmute' : 'Mute'), /*#__PURE__*/React__default.createElement(MenuItem, {
              onClick: function onClick() {
                channel.banUser(member, -1, '', function () {
                  setMembers(members.filter(function (_a) {
                    var userId = _a.userId;
                    return userId !== member.userId;
                  }));
                });
              }
            }, "Ban"));
          }
        }));
      }
    });
  }))));
}

var SHOWN_MEMBER_MAX = 10;

var UserListItem$1 = function UserListItem(_ref) {
  var _ref$member = _ref.member,
      member = _ref$member === void 0 ? {} : _ref$member,
      _ref$currentUser = _ref.currentUser,
      currentUser = _ref$currentUser === void 0 ? '' : _ref$currentUser;
  var avatarRef = useRef(null);

  var _useContext = useContext(UserProfileContext),
      disableUserProfile = _useContext.disableUserProfile,
      renderUserProfile = _useContext.renderUserProfile;

  var _useContext2 = useContext(LocalizationContext),
      stringSet = _useContext2.stringSet;

  return /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-members-accordion__member"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-members-accordion__member-avatar"
  }, /*#__PURE__*/React__default.createElement(ContextMenu, {
    menuTrigger: function menuTrigger(toggleDropdown) {
      return /*#__PURE__*/React__default.createElement(Avatar, {
        onClick: function onClick() {
          if (!disableUserProfile) {
            toggleDropdown();
          }
        },
        ref: avatarRef,
        src: member.profileUrl,
        width: 24,
        height: 24
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
        user: member,
        currentUserId: currentUser,
        close: closeDropdown
      }) : /*#__PURE__*/React__default.createElement(ConnectedUserProfile, {
        user: member,
        currentUserId: currentUser,
        onSuccess: closeDropdown
      }));
    }
  })), /*#__PURE__*/React__default.createElement(Label, {
    type: LabelTypography.SUBTITLE_2,
    color: LabelColors.ONBACKGROUND_1
  }, member.nickname || stringSet.NO_NAME, currentUser === member.userId && stringSet.YOU));
};

UserListItem$1.propTypes = {
  member: PropTypes.shape({
    userId: PropTypes.string,
    profileUrl: PropTypes.string,
    nickname: PropTypes.string
  }).isRequired,
  currentUser: PropTypes.string.isRequired
};

var MembersAccordion = function MembersAccordion(_ref2) {
  var channel = _ref2.channel,
      disabled = _ref2.disabled,
      currentUser = _ref2.currentUser,
      userQueryCreator = _ref2.userQueryCreator,
      onInviteMembers = _ref2.onInviteMembers,
      swapParams = _ref2.swapParams;
  var members = channel.members || [];

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      showMoreModal = _useState2[0],
      setShowMoreModal = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      showAddUserModal = _useState4[0],
      setShowAddUserModal = _useState4[1];

  var _useContext3 = useContext(LocalizationContext),
      stringSet = _useContext3.stringSet;

  return /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-members-accordion"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-members-accordion__list"
  }, members.slice(0, SHOWN_MEMBER_MAX).map(function (member) {
    return /*#__PURE__*/React__default.createElement(UserListItem$1, {
      member: member,
      currentUser: currentUser,
      key: member.userId
    });
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-members-accordion__footer"
  }, members.length >= SHOWN_MEMBER_MAX && /*#__PURE__*/React__default.createElement(Button, {
    className: "sendbird-members-accordion__footer__all-members",
    type: ButtonTypes.SECONDARY,
    size: ButtonSizes.SMALL,
    onClick: function onClick() {
      return setShowMoreModal(true);
    }
  }, stringSet.CHANNEL_SETTING__MEMBERS__SEE_ALL_MEMBERS), members.length >= SHOWN_MEMBER_MAX && showMoreModal && /*#__PURE__*/React__default.createElement(MembersModal, {
    currentUser: currentUser,
    hideModal: function hideModal() {
      setShowMoreModal(false);
    },
    channel: channel
  }), /*#__PURE__*/React__default.createElement(Button, {
    className: "sendbird-members-accordion__footer__invite-users",
    type: ButtonTypes.SECONDARY,
    size: ButtonSizes.SMALL,
    disabled: disabled,
    onClick: function onClick() {
      if (disabled) {
        return;
      }

      setShowAddUserModal(true);
    }
  }, stringSet.CHANNEL_SETTING__MEMBERS__INVITE_MEMBER), showAddUserModal && /*#__PURE__*/React__default.createElement(InviteMembers$1, {
    swapParams: swapParams,
    titleText: stringSet.MODAL__INVITE_MEMBER__TITLE,
    submitText: stringSet.BUTTON__INVITE,
    closeModal: function closeModal() {
      return setShowAddUserModal(false);
    },
    idsToFilter: members.map(function (member) {
      return member.userId;
    }),
    userQueryCreator: userQueryCreator,
    onSubmit: onInviteMembers
  })));
};

MembersAccordion.propTypes = {
  swapParams: PropTypes.bool,
  disabled: PropTypes.bool,
  channel: PropTypes.shape({
    members: PropTypes.arrayOf(PropTypes.shape({}))
  }),
  currentUser: PropTypes.string,
  userQueryCreator: PropTypes.func.isRequired,
  onInviteMembers: PropTypes.func.isRequired
};
MembersAccordion.defaultProps = {
  swapParams: false,
  currentUser: '',
  disabled: false,
  channel: {}
};

// might move to reusable/UI
var COMPONENT_NAME = 'sendbird-user-list-item--small';

var UserListItem = function UserListItem(_a) {
  var user = _a.user,
      className = _a.className,
      currentUser = _a.currentUser,
      action = _a.action;
  var actionRef = useRef(null);
  var parentRef = useRef(null);
  var avatarRef = useRef(null);
  var stringSet = useContext(LocalizationContext).stringSet;

  var _b = useContext(UserProfileContext),
      disableUserProfile = _b.disableUserProfile,
      renderUserProfile = _b.renderUserProfile;

  var injectingClassNames = Array.isArray(className) ? className : [className];
  return /*#__PURE__*/React__default.createElement("div", {
    ref: parentRef,
    className: __spreadArray([COMPONENT_NAME], injectingClassNames, true).join(' ')
  }, user.isMuted && /*#__PURE__*/React__default.createElement(MutedAvatarOverlay, null), /*#__PURE__*/React__default.createElement(ContextMenu, {
    menuTrigger: function menuTrigger(toggleDropdown) {
      return /*#__PURE__*/React__default.createElement(Avatar, {
        onClick: function onClick() {
          if (!disableUserProfile) {
            toggleDropdown();
          }
        },
        ref: avatarRef,
        className: COMPONENT_NAME + "__avatar",
        src: user.profileUrl,
        width: 24,
        height: 24
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
        user: user,
        currentUserId: currentUser,
        onSuccess: closeDropdown
      }));
    }
  }), /*#__PURE__*/React__default.createElement(Label, {
    className: COMPONENT_NAME + "__title",
    type: LabelTypography.SUBTITLE_1,
    color: LabelColors.ONBACKGROUND_1
  }, user.nickname || stringSet.NO_NAME, currentUser === user.userId && " (You)"), // if there is now nickname, display userId
  !user.nickname && /*#__PURE__*/React__default.createElement(Label, {
    className: COMPONENT_NAME + "__subtitle",
    type: LabelTypography.CAPTION_3,
    color: LabelColors.ONBACKGROUND_2
  }, user.userId), user.role === 'operator' && /*#__PURE__*/React__default.createElement(Label, {
    className: COMPONENT_NAME + "__operator",
    type: LabelTypography.SUBTITLE_2,
    color: LabelColors.ONBACKGROUND_2
  }, "Operator"), action && /*#__PURE__*/React__default.createElement("div", {
    ref: actionRef,
    className: COMPONENT_NAME + "__action"
  }, action({
    actionRef: actionRef,
    parentRef: parentRef
  })));
};

function OperatorsModal(_a) {
  var hideModal = _a.hideModal,
      channel = _a.channel,
      currentUser = _a.currentUser;

  var _b = useState([]),
      operators = _b[0],
      setOperators = _b[1];

  var _c = useState(null),
      operatorQuery = _c[0],
      setOperatorQuery = _c[1];

  useEffect(function () {
    var operatorListQuery = channel.createOperatorListQuery();
    operatorListQuery.limit = 20;
    operatorListQuery.next(function (operators, error) {
      if (error) {
        return;
      }

      setOperators(operators);
    });
    setOperatorQuery(operatorListQuery);
  }, []);
  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(Modal, {
    hideFooter: true,
    onCancel: function onCancel() {
      return hideModal();
    },
    onSubmit: noop,
    titleText: "All operators"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-more-members__popup-scroll",
    onScroll: function onScroll(e) {
      var hasNext = operatorQuery.hasNext;
      var target = e.target;
      var fetchMore = target.clientHeight + target.scrollTop === target.scrollHeight;

      if (hasNext && fetchMore) {
        operatorQuery.next(function (o, error) {
          if (error) {
            return;
          }

          setOperators(__spreadArray(__spreadArray([], operators, true), o, true));
        });
      }
    }
  }, operators.map(function (member) {
    return /*#__PURE__*/React__default.createElement(UserListItem$2, {
      currentUser: currentUser,
      user: member,
      key: member.userId,
      action: function action(_a) {
        var parentRef = _a.parentRef,
            actionRef = _a.actionRef;
        return /*#__PURE__*/React__default.createElement(ContextMenu, {
          menuTrigger: function menuTrigger(toggleDropdown) {
            return /*#__PURE__*/React__default.createElement(IconButton, {
              className: "sendbird-user-message__more__menu",
              width: "32px",
              height: "32px",
              onClick: toggleDropdown
            }, /*#__PURE__*/React__default.createElement(Icon, {
              width: "24px",
              height: "24px",
              type: IconTypes.MORE,
              fillColor: IconColors.CONTENT_INVERSE
            }));
          },
          menuItems: function menuItems(closeDropdown) {
            return /*#__PURE__*/React__default.createElement(MenuItems, {
              parentContainRef: parentRef,
              parentRef: actionRef // for catching location(x, y) of MenuItems
              ,
              closeDropdown: closeDropdown,
              openLeft: true
            }, /*#__PURE__*/React__default.createElement(MenuItem, {
              onClick: function onClick() {
                channel.removeOperators([member.userId], function (response, error) {
                  if (error) {
                    return;
                  }

                  setOperators(operators.filter(function (_a) {
                    var userId = _a.userId;
                    return userId !== member.userId;
                  }));
                });
                closeDropdown();
              }
            }, "Dismiss operator"));
          }
        });
      }
    });
  }))));
}

function AddOperatorsModal(_a) {
  var hideModal = _a.hideModal,
      channel = _a.channel,
      _onSubmit = _a.onSubmit;

  var _b = useState([]),
      members = _b[0],
      setMembers = _b[1];

  var _c = useState({}),
      selectedMembers = _c[0],
      setSelectedMembers = _c[1];

  var _d = useState(null),
      memberQuery = _d[0],
      setMemberQuery = _d[1];

  var stringSet = useContext(LocalizationContext).stringSet;
  useEffect(function () {
    var memberListQuery = channel.createMemberListQuery();
    memberListQuery.limit = 20;
    memberListQuery.next(function (members, error) {
      if (error) {
        return;
      }

      setMembers(members);
    });
    setMemberQuery(memberListQuery);
  }, []);
  var selectedCount = Object.keys(selectedMembers).filter(function (m) {
    return selectedMembers[m];
  }).length;
  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(Modal, {
    type: Type.PRIMARY,
    submitText: "Add",
    onCancel: function onCancel() {
      return hideModal();
    },
    onSubmit: function onSubmit() {
      var members = Object.keys(selectedMembers).filter(function (m) {
        return selectedMembers[m];
      });

      _onSubmit(members);
    },
    titleText: "Select members"
  }, /*#__PURE__*/React__default.createElement(Label, {
    color: selectedCount > 0 ? LabelColors.PRIMARY : LabelColors.ONBACKGROUND_3,
    type: LabelTypography.CAPTION_1
  }, selectedCount + " " + stringSet.MODAL__INVITE_MEMBER__SELECTEC), /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-more-members__popup-scroll",
    onScroll: function onScroll(e) {
      var hasNext = memberQuery.hasNext;
      var target = e.target;
      var fetchMore = target.clientHeight + target.scrollTop === target.scrollHeight;

      if (hasNext && fetchMore) {
        memberQuery.next(function (o, error) {
          if (error) {
            return;
          }

          setMembers(__spreadArray(__spreadArray([], members, true), o, true));
        });
      }
    }
  }, members.map(function (member) {
    return /*#__PURE__*/React__default.createElement(UserListItem$2, {
      checkBox: true,
      checked: selectedMembers[member.userId],
      onChange: function onChange(event) {
        var _a;

        var modifiedSelectedMembers = __assign(__assign({}, selectedMembers), (_a = {}, _a[event.target.id] = event.target.checked, _a));

        if (!event.target.checked) {
          delete modifiedSelectedMembers[event.target.id];
        }

        setSelectedMembers(modifiedSelectedMembers);
      },
      user: member,
      key: member.userId
    });
  }))));
}

var OperatorList = function OperatorList(_a) {
  var sdk = _a.sdk,
      channel = _a.channel;

  var _b = useState([]),
      operators = _b[0],
      setOperators = _b[1];

  var _c = useState(false),
      showMore = _c[0],
      setShowMore = _c[1];

  var _d = useState(false),
      showAdd = _d[0],
      setShowAdd = _d[1];

  var _e = useState(false),
      hasNext = _e[0],
      setHasNext = _e[1];

  var stringSet = useContext(LocalizationContext).stringSet;
  useEffect(function () {
    if (!channel) {
      setOperators([]);
      return;
    }

    var operatorListQuery = channel.createOperatorListQuery();
    operatorListQuery.limit = 10;
    operatorListQuery.next(function (operators, error) {
      if (error) {
        return;
      }

      setOperators(operators);
      setHasNext(operatorListQuery.hasNext);
    });
  }, [channel]);
  var refershList = useCallback(function () {
    if (!channel) {
      setOperators([]);
      return;
    }

    var operatorListQuery = channel.createOperatorListQuery();
    operatorListQuery.limit = 10;
    operatorListQuery.next(function (operators, error) {
      if (error) {
        return;
      }

      setOperators(operators);
      setHasNext(operatorListQuery.hasNext);
    });
  }, [channel]);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, operators.map(function (operator) {
    return /*#__PURE__*/React__default.createElement(UserListItem, {
      key: operator.userId,
      user: operator,
      currentUser: sdk.currentUser.userId,
      action: function action(_a) {
        var actionRef = _a.actionRef,
            parentRef = _a.parentRef;
        return /*#__PURE__*/React__default.createElement(ContextMenu, {
          menuTrigger: function menuTrigger(toggleDropdown) {
            return /*#__PURE__*/React__default.createElement(IconButton, {
              className: "sendbird-user-message__more__menu",
              width: "32px",
              height: "32px",
              onClick: toggleDropdown
            }, /*#__PURE__*/React__default.createElement(Icon, {
              width: "24px",
              height: "24px",
              type: IconTypes.MORE,
              fillColor: IconColors.CONTENT_INVERSE
            }));
          },
          menuItems: function menuItems(closeDropdown) {
            return /*#__PURE__*/React__default.createElement(MenuItems, {
              parentContainRef: parentRef,
              parentRef: actionRef // for catching location(x, y) of MenuItems
              ,
              closeDropdown: closeDropdown,
              openLeft: true
            }, /*#__PURE__*/React__default.createElement(MenuItem, {
              onClick: function onClick() {
                channel.removeOperators([operator.userId], function (response, error) {
                  if (error) {
                    return;
                  }

                  setOperators(operators.filter(function (_a) {
                    var userId = _a.userId;
                    return userId !== operator.userId;
                  }));
                });
                closeDropdown();
              }
            }, "Dismiss operator"));
          }
        });
      }
    });
  }), hasNext && /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-channel-settings-accordion__footer"
  }, /*#__PURE__*/React__default.createElement(Button, {
    type: ButtonTypes.SECONDARY,
    size: ButtonSizes.SMALL,
    onClick: function onClick() {
      setShowMore(true);
    }
  }, stringSet.CHANNEL_SETTING__OPERATORS__TITLE_ALL), /*#__PURE__*/React__default.createElement(Button, {
    type: ButtonTypes.SECONDARY,
    size: ButtonSizes.SMALL,
    onClick: function onClick() {
      setShowAdd(true);
    }
  }, stringSet.CHANNEL_SETTING__OPERATORS__TITLE_ADD)), showMore && /*#__PURE__*/React__default.createElement(OperatorsModal, {
    currentUser: sdk.currentUser.userId,
    hideModal: function hideModal() {
      setShowMore(false);
      refershList();
    },
    channel: channel
  }), showAdd && /*#__PURE__*/React__default.createElement(AddOperatorsModal, {
    hideModal: function hideModal() {
      return setShowAdd(false);
    },
    channel: channel,
    onSubmit: function onSubmit(members) {
      setShowAdd(false);
      channel.addOperators(members, function () {
        refershList();
      });
    }
  }));
};

var mapStoreToProps$3 = function mapStoreToProps(store) {
  return {
    sdk: getSdk(store)
  };
};

var OperatorList$1 = withSendbirdContext(OperatorList, mapStoreToProps$3);

function InviteMembers(_a) {
  var hideModal = _a.hideModal,
      userQueryCreator = _a.userQueryCreator,
      _onSubmit = _a.onSubmit;

  var _b = useState([]),
      members = _b[0],
      setMembers = _b[1];

  var _c = useState({}),
      selectedMembers = _c[0],
      setSelectedMembers = _c[1];

  var _d = useState(null),
      userQuery = _d[0],
      setUserQuery = _d[1];

  useEffect(function () {
    var userListQuery = userQueryCreator();
    userListQuery.limit = 20;
    userListQuery.next(function (members, error) {
      if (error) {
        return;
      }

      setMembers(members);
    });
    setUserQuery(userListQuery);
  }, []);
  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(Modal, {
    disabled: Object.keys(selectedMembers).length === 0,
    submitText: "Invite",
    type: Type.PRIMARY,
    onCancel: function onCancel() {
      return hideModal();
    },
    onSubmit: function onSubmit() {
      var members = Object.keys(selectedMembers).filter(function (m) {
        return selectedMembers[m];
      });

      _onSubmit(members);
    },
    titleText: "Select members"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-more-members__popup-scroll",
    onScroll: function onScroll(e) {
      var hasNext = userQuery.hasNext;
      var target = e.target;
      var fetchMore = target.clientHeight + target.scrollTop === target.scrollHeight;

      if (hasNext && fetchMore) {
        userQuery.next(function (o, error) {
          if (error) {
            return;
          }

          setMembers(__spreadArray(__spreadArray([], members, true), o, true));
        });
      }
    }
  }, members.map(function (member) {
    return /*#__PURE__*/React__default.createElement(UserListItem$2, {
      checkBox: true,
      checked: selectedMembers[member.userId],
      onChange: function onChange(event) {
        var _a;

        var modifiedSelectedMembers = __assign(__assign({}, selectedMembers), (_a = {}, _a[event.target.id] = event.target.checked, _a));

        if (!event.target.checked) {
          delete modifiedSelectedMembers[event.target.id];
        }

        setSelectedMembers(modifiedSelectedMembers);
      },
      user: member,
      key: member.userId
    });
  }))));
}

var MemberList = function MemberList(_a) {
  var sdk = _a.sdk,
      channel = _a.channel,
      userQueryCreator = _a.userQueryCreator,
      userId = _a.userId;

  var _b = useState([]),
      members = _b[0],
      setMembers = _b[1];

  var _c = useState(false),
      hasNext = _c[0],
      setHasNext = _c[1];

  var _d = useState(false),
      showAllMembers = _d[0],
      setShowAllMembers = _d[1];

  var _e = useState(false),
      showInviteMembers = _e[0],
      setShowInviteMembers = _e[1];

  useEffect(function () {
    if (!channel) {
      setMembers([]);
      return;
    }

    var memberUserListQuery = channel.createMemberListQuery();
    memberUserListQuery.limit = 10;
    memberUserListQuery.next(function (members, error) {
      if (error) {
        return;
      }

      setMembers(members);
      setHasNext(memberUserListQuery.hasNext);
    });
  }, [channel]);
  var refershList = useCallback(function () {
    if (!channel) {
      setMembers([]);
      return;
    }

    var memberUserListQuery = channel.createMemberListQuery();
    memberUserListQuery.limit = 10;
    memberUserListQuery.next(function (members, error) {
      if (error) {
        return;
      }

      setMembers(members);
      setHasNext(memberUserListQuery.hasNext);
    });
  }, [channel]);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, members.map(function (member) {
    return /*#__PURE__*/React__default.createElement(UserListItem, {
      key: member.userId,
      user: member,
      currentUser: sdk.currentUser.userId,
      action: userId !== member.userId ? function (_a) {
        var actionRef = _a.actionRef,
            parentRef = _a.parentRef;
        return /*#__PURE__*/React__default.createElement(ContextMenu, {
          menuTrigger: function menuTrigger(toggleDropdown) {
            return /*#__PURE__*/React__default.createElement(IconButton, {
              className: "sendbird-user-message__more__menu",
              width: "32px",
              height: "32px",
              onClick: toggleDropdown
            }, /*#__PURE__*/React__default.createElement(Icon, {
              width: "24px",
              height: "24px",
              type: IconTypes.MORE,
              fillColor: IconColors.CONTENT_INVERSE
            }));
          },
          menuItems: function menuItems(closeDropdown) {
            return /*#__PURE__*/React__default.createElement(MenuItems, {
              parentContainRef: parentRef,
              parentRef: actionRef // for catching location(x, y) of MenuItems
              ,
              closeDropdown: closeDropdown,
              openLeft: true
            }, /*#__PURE__*/React__default.createElement(MenuItem, {
              onClick: function onClick() {
                if (member.role !== 'operator') {
                  channel.addOperators([member.userId], function () {
                    refershList();
                    closeDropdown();
                  });
                } else {
                  channel.removeOperators([member.userId], function () {
                    refershList();
                    closeDropdown();
                  });
                }
              }
            }, member.role !== 'operator' ? 'Promote to operator' : 'Demote operator'), // No muted members in broadcast channel
            !channel.isBroadcast && /*#__PURE__*/React__default.createElement(MenuItem, {
              onClick: function onClick() {
                if (member.isMuted) {
                  channel.unmuteUser(member, function () {
                    refershList();
                    closeDropdown();
                  });
                } else {
                  channel.muteUser(member, function () {
                    refershList();
                    closeDropdown();
                  });
                }
              }
            }, member.isMuted ? 'Unmute' : 'Mute'), /*#__PURE__*/React__default.createElement(MenuItem, {
              onClick: function onClick() {
                channel.banUser(member, -1, '', function () {
                  refershList();
                  closeDropdown();
                });
              }
            }, "Ban"));
          }
        });
      } : null
    });
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-channel-settings-accordion__footer"
  }, hasNext && /*#__PURE__*/React__default.createElement(Button, {
    type: ButtonTypes.SECONDARY,
    size: ButtonSizes.SMALL,
    onClick: function onClick() {
      return setShowAllMembers(true);
    }
  }, "All members"), /*#__PURE__*/React__default.createElement(Button, {
    type: ButtonTypes.SECONDARY,
    size: ButtonSizes.SMALL,
    onClick: function onClick() {
      return setShowInviteMembers(true);
    }
  }, "Invite members")), showAllMembers && /*#__PURE__*/React__default.createElement(MembersModal, {
    currentUser: sdk.currentUser.userId,
    channel: channel,
    hideModal: function hideModal() {
      setShowAllMembers(false);
      refershList();
    }
  }), showInviteMembers && /*#__PURE__*/React__default.createElement(InviteMembers, {
    userQueryCreator: userQueryCreator,
    onSubmit: function onSubmit(selectedMembers) {
      channel.inviteWithUserIds(selectedMembers, function () {
        setShowInviteMembers(false);
        refershList();
      });
    },
    channel: channel,
    hideModal: function hideModal() {
      return setShowInviteMembers(false);
    }
  }));
};

var mapStoreToProps$2 = function mapStoreToProps(store) {
  return {
    sdk: getSdk(store)
  };
};

var MemberList$1 = withSendbirdContext(MemberList, mapStoreToProps$2);

function BannedMembersModal(_a) {
  var hideModal = _a.hideModal,
      channel = _a.channel;

  var _b = useState([]),
      members = _b[0],
      setMembers = _b[1];

  var _c = useState(null),
      memberQuery = _c[0],
      setMemberQuery = _c[1];

  useEffect(function () {
    var bannedUserListQuery = channel.createBannedUserListQuery();
    bannedUserListQuery.next(function (users, error) {
      if (error) {
        return;
      }

      setMembers(users);
    });
    setMemberQuery(bannedUserListQuery);
  }, []);
  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(Modal, {
    hideFooter: true,
    onCancel: function onCancel() {
      return hideModal();
    },
    onSubmit: noop,
    titleText: "Muted members"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-more-members__popup-scroll",
    onScroll: function onScroll(e) {
      var hasNext = memberQuery.hasNext;
      var target = e.target;
      var fetchMore = target.clientHeight + target.scrollTop === target.scrollHeight;

      if (hasNext && fetchMore) {
        memberQuery.next(function (o, error) {
          if (error) {
            return;
          }

          setMembers(__spreadArray(__spreadArray([], members, true), o, true));
        });
      }
    }
  }, members.map(function (member) {
    return /*#__PURE__*/React__default.createElement(UserListItem$2, {
      user: member,
      key: member.userId,
      action: function action(_a) {
        var parentRef = _a.parentRef,
            actionRef = _a.actionRef;
        return /*#__PURE__*/React__default.createElement(ContextMenu, {
          menuTrigger: function menuTrigger(toggleDropdown) {
            return /*#__PURE__*/React__default.createElement(IconButton, {
              className: "sendbird-user-message__more__menu",
              width: "32px",
              height: "32px",
              onClick: toggleDropdown
            }, /*#__PURE__*/React__default.createElement(Icon, {
              width: "24px",
              height: "24px",
              type: IconTypes.MORE,
              fillColor: IconColors.CONTENT_INVERSE
            }));
          },
          menuItems: function menuItems(closeDropdown) {
            return /*#__PURE__*/React__default.createElement(MenuItems, {
              parentContainRef: parentRef,
              parentRef: actionRef // for catching location(x, y) of MenuItems
              ,
              closeDropdown: closeDropdown,
              openLeft: true
            }, /*#__PURE__*/React__default.createElement(MenuItem, {
              onClick: function onClick() {
                channel.unbanUser(member, function () {
                  closeDropdown();
                  setMembers(members.filter(function (m) {
                    return m.userId !== member.userId;
                  }));
                });
              }
            }, "Unban"));
          }
        });
      }
    });
  }))));
}

var BannedMemberList = function BannedMemberList(_a) {
  var channel = _a.channel;

  var _b = useState([]),
      members = _b[0],
      setMembers = _b[1];

  var _c = useState(false),
      hasNext = _c[0],
      setHasNext = _c[1];

  var _d = useState(false),
      showModal = _d[0],
      setShowModal = _d[1];

  useEffect(function () {
    if (!channel) {
      setMembers([]);
      return;
    }

    var bannedUserListQuery = channel.createBannedUserListQuery();
    bannedUserListQuery.next(function (users, error) {
      if (error) {
        return;
      }

      setMembers(users);
      setHasNext(bannedUserListQuery.hasNext);
    });
  }, [channel]);
  var refreshList = useCallback(function () {
    if (!channel) {
      setMembers([]);
      return;
    }

    var bannedUserListQuery = channel.createBannedUserListQuery();
    bannedUserListQuery.next(function (users, error) {
      if (error) {
        return;
      }

      setMembers(users);
      setHasNext(bannedUserListQuery.hasNext);
    });
  }, [channel]);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, members.map(function (member) {
    return /*#__PURE__*/React__default.createElement(UserListItem, {
      key: member.userId,
      user: member,
      action: function action(_a) {
        var actionRef = _a.actionRef,
            parentRef = _a.parentRef;
        return /*#__PURE__*/React__default.createElement(ContextMenu, {
          menuTrigger: function menuTrigger(toggleDropdown) {
            return /*#__PURE__*/React__default.createElement(IconButton, {
              className: "sendbird-user-message__more__menu",
              width: "32px",
              height: "32px",
              onClick: toggleDropdown
            }, /*#__PURE__*/React__default.createElement(Icon, {
              width: "24px",
              height: "24px",
              type: IconTypes.MORE,
              fillColor: IconColors.CONTENT_INVERSE
            }));
          },
          menuItems: function menuItems(closeDropdown) {
            return /*#__PURE__*/React__default.createElement(MenuItems, {
              parentContainRef: parentRef,
              parentRef: actionRef // for catching location(x, y) of MenuItems
              ,
              closeDropdown: closeDropdown,
              openLeft: true
            }, /*#__PURE__*/React__default.createElement(MenuItem, {
              onClick: function onClick() {
                channel.unbanUser(member, function () {
                  closeDropdown();
                  refreshList();
                });
              }
            }, "Unban"));
          }
        });
      }
    });
  }), members && members.length === 0 && /*#__PURE__*/React__default.createElement(Label, {
    className: "sendbird-channel-settings__empty-list",
    type: LabelTypography.SUBTITLE_2,
    color: LabelColors.ONBACKGROUND_3
  }, "No banned members yet"), hasNext && /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-channel-settings-accordion__footer"
  }, /*#__PURE__*/React__default.createElement(Button, {
    type: ButtonTypes.SECONDARY,
    size: ButtonSizes.SMALL,
    onClick: function onClick() {
      setShowModal(true);
    }
  }, "All banned members")), showModal && /*#__PURE__*/React__default.createElement(BannedMembersModal, {
    channel: channel,
    hideModal: function hideModal() {
      setShowModal(false);
      refreshList();
    }
  }));
};

var mapStoreToProps$1 = function mapStoreToProps(store) {
  return {
    sdk: getSdk(store)
  };
};

var BannedMemberList$1 = withSendbirdContext(BannedMemberList, mapStoreToProps$1);

function MutedMembersModal(_a) {
  var hideModal = _a.hideModal,
      channel = _a.channel,
      currentUser = _a.currentUser;

  var _b = useState([]),
      members = _b[0],
      setMembers = _b[1];

  var _c = useState(null),
      memberQuery = _c[0],
      setMemberQuery = _c[1];

  useEffect(function () {
    var memberUserListQuery = channel.createMemberListQuery();
    memberUserListQuery.limit = 10;
    memberUserListQuery.mutedMemberFilter = 'muted';
    memberUserListQuery.next(function (members, error) {
      if (error) {
        return;
      }

      setMembers(members);
    });
    setMemberQuery(memberUserListQuery);
  }, []);
  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(Modal, {
    hideFooter: true,
    onCancel: function onCancel() {
      return hideModal();
    },
    onSubmit: noop,
    titleText: "Muted members"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-more-members__popup-scroll",
    onScroll: function onScroll(e) {
      var hasNext = memberQuery.hasNext;
      var target = e.target;
      var fetchMore = target.clientHeight + target.scrollTop === target.scrollHeight;

      if (hasNext && fetchMore) {
        memberQuery.next(function (o, error) {
          if (error) {
            return;
          }

          setMembers(__spreadArray(__spreadArray([], members, true), o, true));
        });
      }
    }
  }, members.map(function (member) {
    return /*#__PURE__*/React__default.createElement(UserListItem$2, {
      currentUser: currentUser,
      user: member,
      key: member.userId,
      action: function action(_a) {
        var actionRef = _a.actionRef,
            parentRef = _a.parentRef;
        return /*#__PURE__*/React__default.createElement(ContextMenu, {
          menuTrigger: function menuTrigger(toggleDropdown) {
            return /*#__PURE__*/React__default.createElement(IconButton, {
              className: "sendbird-user-message__more__menu",
              width: "32px",
              height: "32px",
              onClick: toggleDropdown
            }, /*#__PURE__*/React__default.createElement(Icon, {
              width: "24px",
              height: "24px",
              type: IconTypes.MORE,
              fillColor: IconColors.CONTENT_INVERSE
            }));
          },
          menuItems: function menuItems(closeDropdown) {
            return /*#__PURE__*/React__default.createElement(MenuItems, {
              parentContainRef: parentRef,
              parentRef: actionRef // for catching location(x, y) of MenuItems
              ,
              closeDropdown: closeDropdown,
              openLeft: true
            }, /*#__PURE__*/React__default.createElement(MenuItem, {
              onClick: function onClick() {
                channel.unmuteUser(member, function () {
                  closeDropdown();
                  setMembers(members.filter(function (m) {
                    return m.userId !== member.userId;
                  }));
                });
              }
            }, "Unmute"));
          }
        });
      }
    });
  }))));
}

var MutedMemberList = function MutedMemberList(_a) {
  var sdk = _a.sdk,
      channel = _a.channel;

  var _b = useState([]),
      members = _b[0],
      setMembers = _b[1];

  var _c = useState(false),
      hasNext = _c[0],
      setHasNext = _c[1];

  var _d = useState(false),
      showModal = _d[0],
      setShowModal = _d[1];

  useEffect(function () {
    if (!channel) {
      setMembers([]);
      return;
    }

    var memberUserListQuery = channel.createMemberListQuery();
    memberUserListQuery.limit = 10;
    memberUserListQuery.mutedMemberFilter = 'muted';
    memberUserListQuery.next(function (members, error) {
      if (error) {
        return;
      }

      setMembers(members);
      setHasNext(memberUserListQuery.hasNext);
    });
  }, [channel]);
  var refreshList = useCallback(function () {
    if (!channel) {
      setMembers([]);
      return;
    }

    var memberUserListQuery = channel.createMemberListQuery();
    memberUserListQuery.limit = 10;
    memberUserListQuery.mutedMemberFilter = 'muted';
    memberUserListQuery.next(function (members, error) {
      if (error) {
        return;
      }

      setMembers(members);
      setHasNext(memberUserListQuery.hasNext);
    });
  }, [channel]);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, members.map(function (member) {
    return /*#__PURE__*/React__default.createElement(UserListItem, {
      key: member.userId,
      user: member,
      currentUser: sdk.currentUser.userId,
      action: function action(_a) {
        var actionRef = _a.actionRef,
            parentRef = _a.parentRef;
        return /*#__PURE__*/React__default.createElement(ContextMenu, {
          menuTrigger: function menuTrigger(toggleDropdown) {
            return /*#__PURE__*/React__default.createElement(IconButton, {
              className: "sendbird-user-message__more__menu",
              width: "32px",
              height: "32px",
              onClick: toggleDropdown
            }, /*#__PURE__*/React__default.createElement(Icon, {
              width: "24px",
              height: "24px",
              type: IconTypes.MORE,
              fillColor: IconColors.CONTENT_INVERSE
            }));
          },
          menuItems: function menuItems(closeDropdown) {
            return /*#__PURE__*/React__default.createElement(MenuItems, {
              closeDropdown: closeDropdown,
              openLeft: true,
              parentContainRef: parentRef,
              parentRef: actionRef // for catching location(x, y) of MenuItems

            }, /*#__PURE__*/React__default.createElement(MenuItem, {
              onClick: function onClick() {
                channel.unmuteUser(member, function () {
                  refreshList();
                  closeDropdown();
                });
              }
            }, "Unmute"));
          }
        });
      }
    });
  }), members && members.length === 0 && /*#__PURE__*/React__default.createElement(Label, {
    className: "sendbird-channel-settings__empty-list",
    type: LabelTypography.SUBTITLE_2,
    color: LabelColors.ONBACKGROUND_3
  }, "No muted members yet"), hasNext && /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-channel-settings-accordion__footer"
  }, /*#__PURE__*/React__default.createElement(Button, {
    type: ButtonTypes.SECONDARY,
    size: ButtonSizes.SMALL,
    onClick: function onClick() {
      setShowModal(true);
    }
  }, "All muted members")), showModal && /*#__PURE__*/React__default.createElement(MutedMembersModal, {
    currentUser: sdk.currentUser.userId,
    channel: channel,
    hideModal: function hideModal() {
      setShowModal(false);
      refreshList();
    }
  }));
};

var mapStoreToProps = function mapStoreToProps(store) {
  return {
    sdk: getSdk(store)
  };
};

var MutedMemberList$1 = withSendbirdContext(MutedMemberList, mapStoreToProps);

var kFormatter$1 = function kFormatter(num) {
  return Math.abs(num) > 999 ? (Math.abs(num) / 1000).toFixed(1) + "K" : num;
};

function AdminPannel(_a) {
  var userQueryCreator = _a.userQueryCreator,
      channel = _a.channel,
      userId = _a.userId;

  var _b = useState(false),
      frozen = _b[0],
      setFrozen = _b[1]; // work around for
  // https://sendbird.slack.com/archives/G01290GCDCN/p1595922832000900
  // SDK bug - after frozen/unfrozen myRole becomes "none"


  useEffect(function () {
    setFrozen(channel.isFrozen);
  }, [channel]);
  var stringSet = useContext(LocalizationContext).stringSet;
  return /*#__PURE__*/React__default.createElement(AccordionGroup, {
    className: "sendbird-channel-settings__operator"
  }, /*#__PURE__*/React__default.createElement(Accordion, {
    className: "sendbird-channel-settings__operators-list",
    id: "operators",
    renderTitle: function renderTitle() {
      return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(Icon, {
        type: IconTypes.OPERATOR,
        fillColor: IconColors.PRIMARY,
        width: 24,
        height: 24,
        className: "sendbird-channel-settings__accordion-icon"
      }), /*#__PURE__*/React__default.createElement(Label, {
        type: LabelTypography.SUBTITLE_1,
        color: LabelColors.ONBACKGROUND_1
      }, stringSet.CHANNEL_SETTING__OPERATORS__TITLE));
    },
    renderContent: function renderContent() {
      return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(OperatorList$1, {
        channel: channel
      }));
    }
  }), /*#__PURE__*/React__default.createElement(Accordion, {
    className: "sendbird-channel-settings__members-list",
    id: "members",
    renderTitle: function renderTitle() {
      return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(Icon, {
        type: IconTypes.MEMBERS,
        fillColor: IconColors.PRIMARY,
        width: 24,
        height: 24,
        className: "sendbird-channel-settings__accordion-icon"
      }), /*#__PURE__*/React__default.createElement(Label, {
        type: LabelTypography.SUBTITLE_1,
        color: LabelColors.ONBACKGROUND_1
      }, stringSet.CHANNEL_SETTING__MEMBERS__TITLE), /*#__PURE__*/React__default.createElement(Badge, {
        count: kFormatter$1(channel.memberCount)
      }));
    },
    renderContent: function renderContent() {
      return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(MemberList$1, {
        userQueryCreator: userQueryCreator,
        channel: channel,
        userId: userId
      }));
    }
  }), // No muted members in broadcast channel
  !channel.isBroadcast && /*#__PURE__*/React__default.createElement(Accordion, {
    id: "mutedMembers",
    className: "sendbird-channel-settings__muted-members-list",
    renderTitle: function renderTitle() {
      return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(Icon, {
        type: IconTypes.MUTE,
        fillColor: IconColors.PRIMARY,
        width: 24,
        height: 24,
        className: "sendbird-channel-settings__accordion-icon"
      }), /*#__PURE__*/React__default.createElement(Label, {
        type: LabelTypography.SUBTITLE_1,
        color: LabelColors.ONBACKGROUND_1
      }, stringSet.CHANNEL_SETTING__MUTED_MEMBERS__TITLE));
    },
    renderContent: function renderContent() {
      return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(MutedMemberList$1, {
        channel: channel
      }));
    }
  }), /*#__PURE__*/React__default.createElement(Accordion, {
    className: "sendbird-channel-settings__banned-members-list",
    id: "bannedMembers",
    renderTitle: function renderTitle() {
      return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(Icon, {
        type: IconTypes.BAN,
        fillColor: IconColors.PRIMARY,
        width: 24,
        height: 24,
        className: "sendbird-channel-settings__accordion-icon"
      }), /*#__PURE__*/React__default.createElement(Label, {
        type: LabelTypography.SUBTITLE_1,
        color: LabelColors.ONBACKGROUND_1
      }, stringSet.CHANNEL_SETTING__BANNED_MEMBERS__TITLE));
    },
    renderContent: function renderContent() {
      return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(BannedMemberList$1, {
        channel: channel
      }));
    }
  }), // cannot frozen broadcast channel
  !channel.isBroadcast && /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-channel-settings__freeze"
  }, /*#__PURE__*/React__default.createElement(Icon, {
    type: IconTypes.FREEZE,
    fillColor: IconColors.PRIMARY,
    width: 24,
    height: 24,
    className: "sendbird-channel-settings__accordion-icon"
  }), /*#__PURE__*/React__default.createElement(Label, {
    type: LabelTypography.SUBTITLE_1,
    color: LabelColors.ONBACKGROUND_1
  }, stringSet.CHANNEL_SETTING__FREEZE_CHANNEL), /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-channel-settings__frozen-icon"
  }, frozen ? /*#__PURE__*/React__default.createElement(Icon, {
    onClick: function onClick() {
      channel.unfreeze(function () {
        setFrozen(false);
      });
    },
    type: IconTypes.TOGGLE_ON,
    fillColor: IconColors.PRIMARY,
    width: 44,
    height: 24
  }) : /*#__PURE__*/React__default.createElement(Icon, {
    onClick: function onClick() {
      channel.freeze(function () {
        setFrozen(true);
      });
    },
    type: IconTypes.TOGGLE_OFF,
    fillColor: IconColors.PRIMARY,
    width: 44,
    height: 24
  }))));
}

var COMPONENT_CLASS_NAME = 'sendbird-channel-settings';

var kFormatter = function kFormatter(num) {
  return Math.abs(num) > 999 ? "".concat((Math.abs(num) / 1000).toFixed(1), "K") : num;
};

function ChannelSettings(props) {
  var className = props.className,
      onCloseClick = props.onCloseClick,
      channelUrl = props.channelUrl,
      disableUserProfile = props.disableUserProfile,
      renderUserProfile = props.renderUserProfile,
      _onChannelModified = props.onChannelModified,
      renderChannelProfile = props.renderChannelProfile,
      onBeforeUpdateChannel = props.onBeforeUpdateChannel;
  var sdkStore = props.stores.sdkStore,
      _props$config = props.config,
      userListQuery = _props$config.userListQuery,
      theme = _props$config.theme,
      userId = _props$config.userId,
      logger = _props$config.logger,
      isOnline = _props$config.isOnline,
      _props$queries = props.queries,
      queries = _props$queries === void 0 ? {} : _props$queries;
  var _props$config2 = props.config,
      config = _props$config2 === void 0 ? {} : _props$config2;
  var userDefinedDisableUserProfile = disableUserProfile || config.disableUserProfile;
  var userDefinedRenderProfile = renderUserProfile || config.renderUserProfile;
  var userFilledApplicationUserListQuery = queries.applicationUserListQuery;

  var _useContext = useContext(LocalizationContext),
      stringSet = _useContext.stringSet;

  var sdk = sdkStore.sdk,
      initialized = sdkStore.initialized; // hack to kepp track of channel updates by triggering useEffect

  var _useState = useState(uuidv4()),
      _useState2 = _slicedToArray(_useState, 2),
      channelUpdateId = _useState2[0],
      setChannelUpdateId = _useState2[1];

  var _useState3 = useState(null),
      _useState4 = _slicedToArray(_useState3, 2),
      channel = _useState4[0],
      setChannel = _useState4[1];

  var _useState5 = useState(false),
      _useState6 = _slicedToArray(_useState5, 2),
      invalidChannel = _useState6[0],
      setInvalidChannel = _useState6[1];

  var _useState7 = useState(false),
      _useState8 = _slicedToArray(_useState7, 2),
      showAccordion = _useState8[0],
      setShowAccordion = _useState8[1];

  var _useState9 = useState(false),
      _useState10 = _slicedToArray(_useState9, 2),
      showLeaveChannelModal = _useState10[0],
      setShowLeaveChannelModal = _useState10[1];

  var componentClassNames = (Array.isArray(className) ? [COMPONENT_CLASS_NAME].concat(_toConsumableArray(className)) : [COMPONENT_CLASS_NAME, className]).join(' ');
  useEffect(function () {
    logger.info('ChannelSettings: Setting up');

    if (!channelUrl || !initialized || !sdk) {
      logger.warning('ChannelSettings: Setting up failed', 'No channelUrl or sdk uninitialized');
      setInvalidChannel(false);
    } else {
      if (!sdk || !sdk.GroupChannel) {
        logger.warning('ChannelSettings: No GroupChannel');
        return;
      }

      sdk.GroupChannel.getChannel(channelUrl, function (groupChannel) {
        if (!groupChannel) {
          logger.warning('ChannelSettings: Channel not found');
          setInvalidChannel(true);
        } else {
          logger.info('ChannelSettings: Fetched group channel', groupChannel);
          setInvalidChannel(false);
          setChannel(groupChannel);
        }
      });
    }
  }, [channelUrl, initialized, channelUpdateId]);

  if (!channel || invalidChannel) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: componentClassNames
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "sendbird-channel-settings__header"
    }, /*#__PURE__*/React__default.createElement(Label, {
      type: LabelTypography.H_2,
      color: LabelColors.ONBACKGROUND_1
    }, stringSet.CHANNEL_SETTING__HEADER__TITLE), /*#__PURE__*/React__default.createElement(Icon, {
      className: "sendbird-channel-settings__close-icon",
      type: IconTypes.CLOSE,
      height: "24px",
      width: "24px",
      onClick: function onClick() {
        logger.info('ChannelSettings: Click close');
        onCloseClick();
      }
    })), /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(PlaceHolder, {
      type: PlaceHolderTypes.WRONG
    })));
  }

  return /*#__PURE__*/React__default.createElement(UserProfileProvider, {
    className: componentClassNames,
    disableUserProfile: userDefinedDisableUserProfile,
    renderUserProfile: userDefinedRenderProfile
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-channel-settings__header"
  }, /*#__PURE__*/React__default.createElement(Label, {
    type: LabelTypography.H_2,
    color: LabelColors.ONBACKGROUND_1
  }, stringSet.CHANNEL_SETTING__HEADER__TITLE), /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-channel-settings__header-icon"
  }, /*#__PURE__*/React__default.createElement(IconButton, {
    width: "32px",
    height: "32px",
    onClick: function onClick() {
      logger.info('ChannelSettings: Click close');
      onCloseClick();
    }
  }, /*#__PURE__*/React__default.createElement(Icon, {
    className: "sendbird-channel-settings__close-icon",
    type: IconTypes.CLOSE,
    height: "22px",
    width: "22px"
  })))), /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-channel-settings__scroll-area"
  }, renderChannelProfile ? renderChannelProfile({
    channel: channel
  }) : /*#__PURE__*/React__default.createElement(ChannelProfile, {
    disabled: !isOnline,
    channel: channel,
    userId: userId,
    theme: theme,
    onChannelInfoChange: function onChannelInfoChange(currentImg, currentTitle) {
      logger.info('ChannelSettings: Channel information being updated');
      var swapParams = sdk.getErrorFirstCallback();

      if (onBeforeUpdateChannel) {
        var params = onBeforeUpdateChannel(currentTitle, currentImg, channel.data); // swapParams

        channel.updateChannel(params, function (response, error) {
          var groupChannel = response;

          if (swapParams) {
            groupChannel = error;
          }

          _onChannelModified(groupChannel);

          setChannelUpdateId(uuidv4());
        });
        return;
      }

      channel.updateChannel(currentTitle, currentImg, channel.data, function (response, error) {
        var groupChannel = response;

        if (swapParams) {
          groupChannel = error;
        }

        logger.info('ChannelSettings: Channel information updated', groupChannel);

        _onChannelModified(groupChannel);

        setChannelUpdateId(uuidv4());
      });
    }
  }), channel.myRole === 'operator' ? /*#__PURE__*/React__default.createElement(AdminPannel, {
    channel: channel,
    userId: userId,
    onChannelModified: function onChannelModified(groupChannel) {
      // setChannelUpdateId(uuidv4());
      _onChannelModified(groupChannel);
    },
    userQueryCreator: function userQueryCreator() {
      return userListQuery && typeof userListQuery === 'function' ? userListQuery() : createDefaultUserListQuery({
        sdk: sdk,
        userFilledApplicationUserListQuery: userFilledApplicationUserListQuery
      });
    }
  }) : /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: ['sendbird-channel-settings__panel-item', 'sendbird-channel-settings__members'].join(' '),
    role: "switch",
    "aria-checked": showAccordion,
    onKeyDown: function onKeyDown() {
      return setShowAccordion(!showAccordion);
    },
    onClick: function onClick() {
      return setShowAccordion(!showAccordion);
    },
    tabIndex: 0
  }, /*#__PURE__*/React__default.createElement(Icon, {
    className: "sendbird-channel-settings__panel-icon-left",
    type: IconTypes.MEMBERS,
    fillColor: IconColors.PRIMARY,
    height: "24px",
    width: "24px"
  }), /*#__PURE__*/React__default.createElement(Label, {
    type: LabelTypography.SUBTITLE_1,
    color: LabelColors.ONBACKGROUND_1
  }, stringSet.CHANNEL_SETTING__MEMBERS__TITLE, /*#__PURE__*/React__default.createElement(Badge, {
    count: kFormatter(channel.memberCount)
  })), /*#__PURE__*/React__default.createElement(Icon, {
    className: ['sendbird-channel-settings__panel-icon-right', 'sendbird-channel-settings__panel-icon--chevron', showAccordion ? 'sendbird-channel-settings__panel-icon--open' : ''].join(' '),
    type: IconTypes.CHEVRON_RIGHT,
    height: "24px",
    width: "24px"
  })), showAccordion && /*#__PURE__*/React__default.createElement(MembersAccordion, {
    currentUser: userId,
    disabled: !isOnline // eslint-disable-next-line
    ,
    userQueryCreator: function userQueryCreator() {
      return userListQuery && typeof userListQuery === 'function' ? userListQuery() : createDefaultUserListQuery({
        sdk: sdk,
        userFilledApplicationUserListQuery: userFilledApplicationUserListQuery
      });
    },
    swapParams: sdk && sdk.getErrorFirstCallback && sdk.getErrorFirstCallback(),
    channel: channel,
    members: channel.members,
    onInviteMembers: function onInviteMembers(selectedMembers) {
      logger.info('ChannelSettings: Inviting new users');
      channel.inviteWithUserIds(selectedMembers).then(function (res) {
        _onChannelModified(res);

        setChannelUpdateId(uuidv4());
        logger.info('ChannelSettings: Inviting new users success!', res);
      });
    }
  })), /*#__PURE__*/React__default.createElement("div", {
    className: ['sendbird-channel-settings__panel-item', 'sendbird-channel-settings__leave-channel', !isOnline ? 'sendbird-channel-settings__panel-item__disabled' : ''].join(' '),
    role: "button",
    disabled: true,
    onKeyDown: function onKeyDown() {
      if (!isOnline) {
        return;
      }

      setShowLeaveChannelModal(true);
    },
    onClick: function onClick() {
      if (!isOnline) {
        return;
      }

      setShowLeaveChannelModal(true);
    },
    tabIndex: 0
  }, /*#__PURE__*/React__default.createElement(Icon, {
    className: ['sendbird-channel-settings__panel-icon-left', 'sendbird-channel-settings__panel-icon__leave'].join(' '),
    type: IconTypes.LEAVE,
    fillColor: IconColors.ERROR,
    height: "24px",
    width: "24px"
  }), /*#__PURE__*/React__default.createElement(Label, {
    type: LabelTypography.SUBTITLE_1,
    color: LabelColors.ONBACKGROUND_1
  }, stringSet.CHANNEL_SETTING__LEAVE_CHANNEL__TITLE)), showLeaveChannelModal && /*#__PURE__*/React__default.createElement(LeaveChannel, {
    onCloseModal: function onCloseModal() {
      return setShowLeaveChannelModal(false);
    },
    onLeaveChannel: function onLeaveChannel() {
      logger.info('ChannelSettings: Leaving channel', channel);
      channel.leave().then(function () {
        logger.info('ChannelSettings: Leaving channel successful!', channel);
        onCloseClick();
      });
    }
  })));
}

ChannelSettings.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  onCloseClick: PropTypes.func,
  onChannelModified: PropTypes.func,
  onBeforeUpdateChannel: PropTypes.func,
  renderChannelProfile: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  disableUserProfile: PropTypes.bool,
  renderUserProfile: PropTypes.func,
  channelUrl: PropTypes.string.isRequired,
  queries: PropTypes.shape({
    applicationUserListQuery: PropTypes.shape({
      limit: PropTypes.number,
      userIdsFilter: PropTypes.arrayOf(PropTypes.string),
      metaDataKeyFilter: PropTypes.string,
      metaDataValuesFilter: PropTypes.arrayOf(PropTypes.string)
    })
  }),
  // from withSendbirdContext
  stores: PropTypes.shape({
    sdkStore: PropTypes.shape({
      sdk: PropTypes.shape({
        getErrorFirstCallback: PropTypes.func,
        GroupChannel: PropTypes.oneOfType([PropTypes.shape({
          getChannel: PropTypes.func
        }), PropTypes.func]),
        createApplicationUserListQuery: PropTypes.any
      }),
      initialized: PropTypes.bool
    })
  }).isRequired,
  config: PropTypes.shape({
    userId: PropTypes.string,
    theme: PropTypes.string,
    userListQuery: PropTypes.func,
    isOnline: PropTypes.bool,
    logger: PropTypes.shape({
      info: PropTypes.func,
      error: PropTypes.func,
      warning: PropTypes.func
    })
  }).isRequired
};
ChannelSettings.defaultProps = {
  className: '',
  onBeforeUpdateChannel: null,
  queries: {},
  disableUserProfile: false,
  renderUserProfile: null,
  renderChannelProfile: null,
  onCloseClick: function onCloseClick() {},
  onChannelModified: function onChannelModified() {}
};
var ChannelSettings$1 = withSendbirdContext(ChannelSettings);

export { ChannelSettings$1 as default };
//# sourceMappingURL=ChannelSettings.js.map
