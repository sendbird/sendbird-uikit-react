import React__default, { useContext, useMemo, useRef, useState, useEffect } from 'react';
import { M as Modal, T as Type, a as TextButton, B as Button, d as ButtonTypes, e as ButtonSizes, U as UserProfileContext, C as ContextMenu, b as MenuItems, f as ConnectedUserProfile, s as selectors, h as UserProfileProvider, z as copyToClipboard } from './index-516d7fed.js';
import { c as LocalizationContext, d as __spreadArray, w as withSendbirdContext } from './LocalizationContext-73398a14.js';
import { A as Avatar, L as Label, a as LabelTypography, b as LabelColors, I as Icon, c as IconTypes, d as IconColors, P as PlaceHolder, f as PlaceHolderTypes } from './index-c5ac5612.js';
import { g as getOpenChannelAvatar } from './utils-0de3e9d3.js';
import { I as InputLabel, a as Input, n as noop, U as UserListItem$1 } from './index-a7d2d399.js';
import { a as Accordion, A as AccordionGroup } from './index-82155b40.js';
import 'prop-types';
import 'react-dom';

function ChannelAvatar(_a) {
  var channel = _a.channel,
      theme = _a.theme,
      _b = _a.height,
      height = _b === void 0 ? 56 : _b,
      _c = _a.width,
      width = _c === void 0 ? 56 : _c;
  var stringSet = useContext(LocalizationContext).stringSet;
  var memoizedAvatar = useMemo(function () {
    return /*#__PURE__*/React__default.createElement(Avatar, {
      className: "sendbird-chat-header__avatar--open-channel",
      src: getOpenChannelAvatar(channel),
      width: width + "px",
      height: height + "px",
      alt: channel.name || stringSet.OPEN_CHANNEL_SETTINGS__NO_TITLE
    });
  }, [channel.coverUrl, theme]);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, memoizedAvatar);
}

var EditDetails = function EditDetails(props) {
  var _onSubmit = props.onSubmit,
      onCancel = props.onCancel,
      channel = props.channel,
      theme = props.theme;
  var inputRef = useRef(null);
  var formRef = useRef(null);
  var hiddenInputRef = useRef(null);

  var _a = useState(null),
      currentImg = _a[0],
      setCurrentImg = _a[1];

  var _b = useState(null),
      newFile = _b[0],
      setNewFile = _b[1];

  var stringSet = useContext(LocalizationContext).stringSet;
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

function ChannelProfile(props) {
  var disabled = props.disabled,
      channel = props.channel,
      theme = props.theme,
      onChannelInfoChange = props.onChannelInfoChange;
  var title = channel.name;

  var _a = useState(false),
      showModal = _a[0],
      setShowModal = _a[1];

  var stringSet = useContext(LocalizationContext).stringSet;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-openchannel-profile"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-openchannel-profile--inner"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-openchannel-profile__avatar"
  }, /*#__PURE__*/React__default.createElement(ChannelAvatar, {
    channel: channel,
    theme: theme,
    height: 80,
    width: 80
  })), /*#__PURE__*/React__default.createElement(Label, {
    type: LabelTypography.SUBTITLE_2,
    color: LabelColors.ONBACKGROUND_1,
    className: "sendbird-openchannel-profile__title"
  }, title || stringSet.OPEN_CHANNEL_SETTINGS__NO_TITLE), /*#__PURE__*/React__default.createElement(TextButton, {
    disabled: disabled,
    className: "sendbird-openchannel-profile__edit",
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
    theme: theme
  })));
}

function ParticipantsModal(_a) {
  var hideModal = _a.hideModal,
      channel = _a.channel;
  var stringSet = useContext(LocalizationContext).stringSet;

  var _b = useState([]),
      participants = _b[0],
      setParticipants = _b[1];

  var _c = useState(null),
      participantListQuery = _c[0],
      setParticipantListQuery = _c[1];

  useEffect(function () {
    if (!channel || !channel.createParticipantListQuery) {
      return;
    }

    var participantListQuery = channel.createParticipantListQuery();
    setParticipantListQuery(participantListQuery);
    participantListQuery.next(function (participantList, error) {
      if (error) {
        return;
      }

      setParticipants(participantList);
    });
  }, []);
  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(Modal, {
    hideFooter: true,
    onCancel: function onCancel() {
      return hideModal();
    },
    onSubmit: noop,
    titleText: stringSet.OPEN_CHANNEL_SETTINGS__ALL_PARTICIPANTS_TITLE
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-more-members__popup-scroll",
    onScroll: function onScroll(e) {
      var hasNext = participantListQuery.hasNext;
      var target = e.target;
      var fetchMore = target.clientHeight + target.scrollTop === target.scrollHeight;

      if (hasNext && fetchMore) {
        participantListQuery.next(function (fetchedParticipants, error) {
          if (error) {
            return;
          }

          setParticipants(__spreadArray(__spreadArray([], participants, true), fetchedParticipants, true));
        });
      }
    }
  }, participants.map(function (p) {
    return /*#__PURE__*/React__default.createElement(UserListItem$1, {
      user: p,
      key: p.userId
    });
  }))));
}

var SHOWN_MEMBER_MAX = 10;
var UserListItem = function UserListItem(_a) {
  var member = _a.member,
      _b = _a.currentUser,
      currentUser = _b === void 0 ? '' : _b;
  var avatarRef = useRef(null);

  var _c = useContext(UserProfileContext),
      disableUserProfile = _c.disableUserProfile,
      renderUserProfile = _c.renderUserProfile;

  var stringSet = useContext(LocalizationContext).stringSet;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-participants-accordion__member"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-participants-accordion__member-avatar"
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
        disableMessaging: true,
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
function ParticipantsAccordion(_a) {
  var channel = _a.channel,
      currentUser = _a.currentUser;

  var _b = useState([]),
      participants = _b[0],
      setParticipants = _b[1];

  var _c = useState(false),
      showMoreModal = _c[0],
      setShowMoreModal = _c[1];

  var stringSet = useContext(LocalizationContext).stringSet;
  useEffect(function () {
    if (!channel || !channel.createParticipantListQuery) {
      return;
    }

    var participantListQuery = channel.createParticipantListQuery();
    participantListQuery.next(function (participantList, error) {
      if (error) {
        return;
      }

      setParticipants(participantList);
    });
  }, [channel]);
  return /*#__PURE__*/React__default.createElement(Accordion, {
    className: "sendbird-participants-accordion",
    id: "participants",
    renderTitle: function renderTitle() {
      return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(Icon, {
        type: IconTypes.MEMBERS,
        fillColor: IconColors.PRIMARY,
        width: 24,
        height: 24,
        className: "sendbird-openchannel-settings__accordion-icon"
      }), /*#__PURE__*/React__default.createElement(Label, {
        type: LabelTypography.SUBTITLE_1,
        color: LabelColors.ONBACKGROUND_1
      }, stringSet.OPEN_CHANNEL_SETTINGS__PARTICIPANTS_ACCORDION_TITLE));
    },
    renderContent: function renderContent() {
      return /*#__PURE__*/React__default.createElement("div", {
        className: ""
      }, /*#__PURE__*/React__default.createElement("div", {
        className: "sendbird-participants-accordion__list"
      }, participants.slice(0, SHOWN_MEMBER_MAX).map(function (p) {
        return /*#__PURE__*/React__default.createElement(UserListItem, {
          member: p,
          currentUser: currentUser,
          key: p.userId
        });
      }), participants && participants.length === 0 ? /*#__PURE__*/React__default.createElement(Label, {
        className: "sendbird-channel-settings__empty-list",
        type: LabelTypography.SUBTITLE_2,
        color: LabelColors.ONBACKGROUND_3
      }, stringSet.OPEN_CHANNEL_SETTINGS__EMPTY_LIST) : null), participants.length >= SHOWN_MEMBER_MAX && /*#__PURE__*/React__default.createElement("div", {
        className: "sendbird-participants-accordion__footer"
      }, /*#__PURE__*/React__default.createElement(Button, {
        className: "sendbird-participants-accordion__footer__all-participants",
        type: ButtonTypes.SECONDARY,
        size: ButtonSizes.SMALL,
        onClick: function onClick() {
          return setShowMoreModal(true);
        }
      }, stringSet.OPEN_CHANNEL_SETTINGS__SEE_ALL), showMoreModal && /*#__PURE__*/React__default.createElement(ParticipantsModal, {
        currentUser: currentUser,
        hideModal: function hideModal() {
          setShowMoreModal(false);
        },
        channel: channel
      })));
    }
  });
}

function DeleteChannel(_a) {
  var isOnline = _a.isOnline,
      onDeleteChannel = _a.onDeleteChannel;

  var _b = useState(false),
      showDeleteChannelModal = _b[0],
      setShowDeleteChannelModal = _b[1];

  var stringSet = useContext(LocalizationContext).stringSet;
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-openchannel-settings__panel-item\n          sendbird-openchannel-settings__delete-channel\n            " + (!isOnline ? 'sendbird-openchannel-settings__panel-item__disabled' : ''),
    role: "button",
    tabIndex: 0,
    onKeyDown: function onKeyDown() {
      if (!isOnline) {
        return;
      }

      setShowDeleteChannelModal(true);
    },
    onClick: function onClick() {
      if (!isOnline) {
        return;
      }

      setShowDeleteChannelModal(true);
    }
  }, /*#__PURE__*/React__default.createElement(Icon, {
    type: IconTypes.DELETE,
    className: ['sendbird-openchannel-settings__panel-icon-left', 'sendbird-openchannel-settings__panel-icon__delete'].join(' '),
    height: "24px",
    width: "24px"
  }), /*#__PURE__*/React__default.createElement(Label, {
    type: LabelTypography.SUBTITLE_1,
    color: LabelColors.ONBACKGROUND_1
  }, stringSet.OPEN_CHANNEL_SETTINGS__DELETE_CHANNEL_PANEL)), showDeleteChannelModal && /*#__PURE__*/React__default.createElement(Modal, {
    onCancel: function onCancel() {
      setShowDeleteChannelModal(false);
    },
    onSubmit: function onSubmit() {
      onDeleteChannel();
    },
    submitText: stringSet.OPEN_CHANNEL_SETTINGS__DELETE_CHANNEL_SUBMIT,
    titleText: stringSet.OPEN_CHANNEL_SETTINGS__DELETE_CHANNEL_TITLE
  }));
}

function ParticipantsList(_a) {
  var channel = _a.channel,
      onCloseClick = _a.onCloseClick,
      currentUser = _a.currentUser;
  var stringSet = useContext(LocalizationContext).stringSet;

  var _b = useState([]),
      participants = _b[0],
      setParticipants = _b[1];

  var _c = useState(null),
      participantListQuery = _c[0],
      setParticipantListQuery = _c[1];

  useEffect(function () {
    if (!channel || !channel.createParticipantListQuery) {
      return;
    }

    var participantListQuery = channel.createParticipantListQuery();
    setParticipantListQuery(participantListQuery);
    participantListQuery.next(function (participantList, error) {
      if (error) {
        return;
      }

      setParticipants(participantList);
    });
  }, [channel]);
  return /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-openchannel-settings__participant"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-openchannel-settings__header"
  }, /*#__PURE__*/React__default.createElement(Label, {
    type: LabelTypography.H_2,
    color: LabelColors.ONBACKGROUND_1
  }, stringSet.OPEN_CHANNEL_SETTINGS__PARTICIPANTS_TITLE), /*#__PURE__*/React__default.createElement(Icon, {
    type: IconTypes.CLOSE,
    className: "sendbird-openchannel-settings__close-icon",
    height: "24px",
    width: "24px",
    onClick: function onClick() {
      onCloseClick();
    }
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-openchannel-settings__participants-list",
    onScroll: function onScroll(e) {
      var hasNext = participantListQuery.hasNext;
      var target = e.target;
      var fetchMore = target.clientHeight + target.scrollTop === target.scrollHeight;

      if (hasNext && fetchMore) {
        participantListQuery.next(function (fetchedParticipants, error) {
          if (error) {
            return;
          }

          setParticipants(__spreadArray(__spreadArray([], participants, true), fetchedParticipants, true));
        });
      }
    }
  }, /*#__PURE__*/React__default.createElement("div", null, participants.map(function (p) {
    return /*#__PURE__*/React__default.createElement(UserListItem, {
      member: p,
      currentUser: currentUser,
      key: p.userId
    });
  }), participants && participants.length === 0 ? /*#__PURE__*/React__default.createElement(Label, {
    className: "sendbird-channel-settings__empty-list",
    type: LabelTypography.SUBTITLE_2,
    color: LabelColors.ONBACKGROUND_3
  }, stringSet.OPEN_CHANNEL_SETTINGS__EMPTY_LIST) : null)));
}

function InvalidChannel(_a) {
  var onCloseClick = _a.onCloseClick;
  var stringSet = useContext(LocalizationContext).stringSet;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-openchannel-settings"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-openchannel-settings__header"
  }, /*#__PURE__*/React__default.createElement(Label, {
    type: LabelTypography.H_2,
    color: LabelColors.ONBACKGROUND_1
  }, stringSet.CHANNEL_SETTING__HEADER__TITLE), /*#__PURE__*/React__default.createElement(Icon, {
    type: IconTypes.CLOSE,
    className: "sendbird-openchannel-settings__close-icon",
    height: "24px",
    width: "24px",
    onClick: function onClick() {
      onCloseClick();
    }
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-openchannel-settings__placeholder"
  }, /*#__PURE__*/React__default.createElement(PlaceHolder, {
    type: PlaceHolderTypes.WRONG
  })));
}

var emptyLogger = function emptyLogger() {
  return {
    info: noop,
    error: noop,
    warning: noop
  };
};

function OpenChannelSettings(props) {
  var channelUrl = props.channelUrl,
      _a = props.onCloseClick,
      _onCloseClick = _a === void 0 ? noop : _a,
      onBeforeUpdateChannel = props.onBeforeUpdateChannel,
      _b = props.onChannelModified,
      onChannelModified = _b === void 0 ? noop : _b,
      renderChannelProfile = props.renderChannelProfile,
      renderUserProfile = props.renderUserProfile,
      _onDeleteChannel = props.onDeleteChannel,
      _c = props.disableUserProfile,
      disableUserProfile = _c === void 0 ? false : _c,
      _d = props.logger,
      logger = _d === void 0 ? emptyLogger() : _d,
      sdk = props.sdk,
      theme = props.theme,
      user = props.user,
      isOnline = props.isOnline;

  var currentUser = user.userId;

  var _e = useState(null),
      channel = _e[0],
      setChannel = _e[1];

  var stringSet = useContext(LocalizationContext).stringSet;
  useEffect(function () {
    if (!channelUrl || !sdk || !sdk.getConnectionState) {
      setChannel(null);
      return;
    }

    sdk.OpenChannel.getChannel(channelUrl, function (openChannel, error) {
      if (!error) {
        setChannel(openChannel);
      } else {
        setChannel(null);
      }
    });
  }, [channelUrl, sdk]);

  if (!channel) {
    return /*#__PURE__*/React__default.createElement(InvalidChannel, {
      onCloseClick: function onCloseClick() {
        logger.info('OpenChannelSettings: Click close');

        if (_onCloseClick) {
          _onCloseClick();
        }
      }
    });
  }

  return /*#__PURE__*/React__default.createElement(UserProfileProvider, {
    className: "sendbird-openchannel-settings",
    disableUserProfile: disableUserProfile,
    renderUserProfile: renderUserProfile
  }, channel.isOperator(user) ? /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-openchannel-settings__header"
  }, /*#__PURE__*/React__default.createElement(Label, {
    type: LabelTypography.H_2,
    color: LabelColors.ONBACKGROUND_1
  }, stringSet.CHANNEL_SETTING__HEADER__TITLE), /*#__PURE__*/React__default.createElement(Icon, {
    className: "sendbird-openchannel-settings__close-icon",
    type: IconTypes.CLOSE,
    height: "24px",
    width: "24px",
    onClick: function onClick() {
      _onCloseClick();
    }
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-openchannel-settings__profile"
  }, renderChannelProfile ? renderChannelProfile({
    channel: channel,
    user: user
  }) : /*#__PURE__*/React__default.createElement(ChannelProfile, {
    disabled: !isOnline,
    channel: channel,
    theme: theme,
    onChannelInfoChange: function onChannelInfoChange(currentImg, currentTitle) {
      logger.info('ChannelSettings: Channel information being updated');

      if (onBeforeUpdateChannel) {
        var params = onBeforeUpdateChannel(currentTitle, currentImg, channel.data);
        logger.info('ChannelSettings: onBeforeUpdateChannel', params);
        channel.updateChannel(params, function (openChannel) {
          onChannelModified(openChannel); // setChannel(openChannel) => alone not working

          setChannel(null);
          setChannel(openChannel);
        });
      } else {
        channel.updateChannel(currentTitle, currentImg, channel.data, function (openChannel) {
          logger.info('ChannelSettings: Channel information updated', openChannel);
          onChannelModified(openChannel); // setChannel(openChannel) => alone not working

          setChannel(null);
          setChannel(openChannel);
        });
      }
    }
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "sendbird-openchannel-settings__url"
  }, /*#__PURE__*/React__default.createElement(Icon, {
    className: "sendbird-openchannel-settings__copy-icon",
    type: IconTypes.COPY,
    height: "22px",
    width: "22px",
    onClick: function onClick() {
      copyToClipboard(channel.url);
    }
  }), /*#__PURE__*/React__default.createElement(Label, {
    className: "sendbird-openchannel-settings__url-label",
    type: LabelTypography.CAPTION_2,
    color: LabelColors.ONBACKGROUND_2
  }, stringSet.OPEN_CHANNEL_SETTINGS__OPERATOR_URL), /*#__PURE__*/React__default.createElement(Label, {
    className: "sendbird-openchannel-settings__url-value",
    type: LabelTypography.SUBTITLE_2
  }, channel.url)), /*#__PURE__*/React__default.createElement(AccordionGroup, null, /*#__PURE__*/React__default.createElement(ParticipantsAccordion, {
    channel: channel,
    currentUser: currentUser
  })), /*#__PURE__*/React__default.createElement(DeleteChannel, {
    isOnline: isOnline,
    onDeleteChannel: function onDeleteChannel() {
      channel.delete(function (response, error) {
        if (error) {
          logger.warning('OpenChannelSettings: Delete channel failed', error);
          return;
        }

        logger.info('OpenChannelSettings: Delete channel success', response);

        if (_onDeleteChannel) {
          _onDeleteChannel(channel);
        }
      });
    }
  })) : /*#__PURE__*/React__default.createElement(ParticipantsList, {
    currentUser: currentUser,
    channel: channel,
    onCloseClick: function onCloseClick() {
      _onCloseClick();
    }
  }));
}

var ChannelSettingsWithSendbird = withSendbirdContext(OpenChannelSettings, function (store) {
  var logger = store && store.config && store.config.logger;
  var theme = store && store.config && store.config.theme || 'light';
  var isOnline = store && store.config && store.config.isOnline;
  var user = store && store.stores && store.stores.userStore && store.stores.userStore.user;
  return {
    sdk: selectors.getSdk(store),
    logger: logger,
    theme: theme,
    isOnline: isOnline,
    user: user
  };
});

export { ChannelSettingsWithSendbird as default };
//# sourceMappingURL=OpenChannelSettings.js.map
