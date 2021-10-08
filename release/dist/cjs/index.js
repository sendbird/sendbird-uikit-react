'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var SendbirdProvider = require('./SendbirdProvider.js');
var App = require('./App.js');
var LocalizationContext = require('./LocalizationContext-268fddf9.js');
var index$1 = require('./index-b9297e41.js');
var React = require('react');
var PropTypes = require('prop-types');
var index$2 = require('./index-74786eb0.js');
var index$3 = require('./index-bc5b754c.js');
var Channel = require('./index-d5a1faa9.js');
var index$4 = require('./index-e1691af4.js');
require('sendbird');
require('./actionTypes-b982fb24.js');
require('css-vars-ponyfill');
require('./ChannelList.js');
require('./index-cd5bc665.js');
require('./utils-5cc86980.js');
require('./LeaveChannel-6c530bb4.js');
require('./index-cda29404.js');
require('./index-0bd55ee3.js');
require('./ChannelSettings.js');
require('./index-874dbbfe.js');
require('./MessageSearch.js');
require('react-dom');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var PropTypes__default = /*#__PURE__*/_interopDefaultLegacy(PropTypes);

/**
 * Example:
 * const MyComponent = () => {
 *  const context = useSendbirdStateContext();
 *  const sdk = sendbirdSelectors.getSdk(context);
 *  return (<div>...</div>);
 * }
 */

function useSendbirdStateContext() {
  var context = React.useContext(LocalizationContext.SendbirdSdkContext);
  return context;
}

var RESET_MESSAGES = 'RESET_MESSAGES';
var RESET_STATE = 'RESET_STATE';
var CLEAR_SENT_MESSAGES = 'CLEAR_SENT_MESSAGES';
var GET_PREV_MESSAGES_START = 'GET_PREV_MESSAGES_START';
var GET_PREV_MESSAGES_SUCESS = 'GET_PREV_MESSAGES_SUCESS';
var GET_NEXT_MESSAGES_SUCESS = 'GET_NEXT_MESSAGES_SUCESS';
var GET_NEXT_MESSAGES_FAILURE = 'GET_NEXT_MESSAGES_FAILURE';
var SEND_MESSAGEGE_START = 'SEND_MESSAGEGE_START';
var SEND_MESSAGEGE_SUCESS = 'SEND_MESSAGEGE_SUCESS';
var SEND_MESSAGEGE_FAILURE = 'SEND_MESSAGEGE_FAILURE';
var RESEND_MESSAGEGE_START = 'RESEND_MESSAGEGE_START';
var ON_MESSAGE_RECEIVED = 'ON_MESSAGE_RECEIVED';
var UPDATE_UNREAD_COUNT = 'UPDATE_UNREAD_COUNT';
var ON_MESSAGE_UPDATED = 'ON_MESSAGE_UPDATED';
var ON_MESSAGE_DELETED = 'ON_MESSAGE_DELETED';
var ON_MESSAGE_DELETED_BY_REQ_ID = 'ON_MESSAGE_DELETED_BY_REQ_ID';
var SET_CURRENT_CHANNEL = 'SET_CURRENT_CHANNEL';
var SET_CHANNEL_INVALID = 'SET_CHANNEL_INVALID';
var MARK_AS_READ = 'MARK_AS_READ';
var ON_REACTION_UPDATED = 'ON_REACTION_UPDATED';
var SET_EMOJI_CONTAINER = 'SET_EMOJI_CONTAINER';
var MESSAGE_LIST_PARAMS_CHANGED = 'MESSAGE_LIST_PARAMS_CHANGED';

index$1.getOutgoingMessageStates();
var UNDEFINED = 'undefined';

var _getSendingMessageSta$1 = index$1.getSendingMessageStatus(),
    SUCCEEDED$1 = _getSendingMessageSta$1.SUCCEEDED;
    _getSendingMessageSta$1.FAILED;
    var PENDING$1 = _getSendingMessageSta$1.PENDING;

var scrollIntoLast = function scrollIntoLast() {
  var intialTry = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var MAX_TRIES = 10;
  var currentTry = intialTry;

  if (currentTry > MAX_TRIES) {
    return;
  }

  try {
    var scrollDOM = document.querySelector('.sendbird-conversation__scroll-container'); // eslint-disable-next-line no-multi-assign

    scrollDOM.scrollTop = scrollDOM.scrollHeight;
  } catch (error) {
    setTimeout(function () {
      scrollIntoLast(currentTry + 1);
    }, 500 * currentTry);
  }
};
var pubSubHandleRemover = function pubSubHandleRemover(subscriber) {
  subscriber.forEach(function (s) {
    try {
      s.remove();
    } catch (_unused) {//
    }
  });
};
var pubSubHandler = function pubSubHandler(channelUrl, pubSub, dispatcher) {
  var subscriber = new Map();
  if (!pubSub || !pubSub.subscribe) return subscriber;
  subscriber.set(index$1.SEND_USER_MESSAGE, pubSub.subscribe(index$1.SEND_USER_MESSAGE, function (msg) {
    var channel = msg.channel,
        message = msg.message;
    scrollIntoLast();

    if (channel && channelUrl === channel.url) {
      dispatcher({
        type: SEND_MESSAGEGE_SUCESS,
        payload: message
      });
    }
  }));
  subscriber.set(index$1.SEND_MESSAGE_START, pubSub.subscribe(index$1.SEND_MESSAGE_START, function (msg) {
    var channel = msg.channel,
        message = msg.message;

    if (channel && channelUrl === channel.url) {
      dispatcher({
        type: SEND_MESSAGEGE_START,
        payload: message
      });
    }
  }));
  subscriber.set(index$1.SEND_FILE_MESSAGE, pubSub.subscribe(index$1.SEND_FILE_MESSAGE, function (msg) {
    var channel = msg.channel,
        message = msg.message;
    scrollIntoLast();

    if (channel && channelUrl === channel.url) {
      dispatcher({
        type: SEND_MESSAGEGE_SUCESS,
        payload: message
      });
    }
  }));
  subscriber.set(index$1.UPDATE_USER_MESSAGE, pubSub.subscribe(index$1.UPDATE_USER_MESSAGE, function (msg) {
    var channel = msg.channel,
        message = msg.message,
        fromSelector = msg.fromSelector;

    if (fromSelector && channel && channelUrl === channel.url) {
      dispatcher({
        type: ON_MESSAGE_UPDATED,
        payload: {
          channel: channel,
          message: message
        }
      });
    }
  }));
  subscriber.set(index$1.DELETE_MESSAGE, pubSub.subscribe(index$1.DELETE_MESSAGE, function (msg) {
    var channel = msg.channel,
        messageId = msg.messageId;

    if (channel && channelUrl === channel.url) {
      dispatcher({
        type: ON_MESSAGE_DELETED,
        payload: messageId
      });
    }
  }));
  return subscriber;
};
var isOperator = function isOperator() {
  var groupChannel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var myRole = groupChannel.myRole;
  return myRole === 'operator';
};
var isDisabledBecauseFrozen = function isDisabledBecauseFrozen() {
  var groupChannel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var isFrozen = groupChannel.isFrozen;
  return isFrozen && !isOperator(groupChannel);
};
var isDisabledBecauseMuted = function isDisabledBecauseMuted() {
  var groupChannel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var myMutedState = groupChannel.myMutedState;
  return myMutedState === 'muted';
};
var getAllEmojisFromEmojiContainer = function getAllEmojisFromEmojiContainer() {
  var emojiContainer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _emojiContainer$emoji = emojiContainer.emojiCategories,
      emojiCategories = _emojiContainer$emoji === void 0 ? [] : _emojiContainer$emoji;
  var allEmojis = [];

  for (var categoryIndex = 0; categoryIndex < emojiCategories.length; categoryIndex += 1) {
    var emojis = emojiCategories[categoryIndex].emojis;

    for (var emojiIndex = 0; emojiIndex < emojis.length; emojiIndex += 1) {
      allEmojis.push(emojis[emojiIndex]);
    }
  }

  return allEmojis;
};
var getAllEmojisMapFromEmojiContainer = function getAllEmojisMapFromEmojiContainer() {
  var emojiContainer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _emojiContainer$emoji2 = emojiContainer.emojiCategories,
      emojiCategories = _emojiContainer$emoji2 === void 0 ? [] : _emojiContainer$emoji2;
  var allEmojisMap = new Map();

  for (var categoryIndex = 0; categoryIndex < emojiCategories.length; categoryIndex += 1) {
    var emojis = emojiCategories[categoryIndex].emojis;

    for (var emojiIndex = 0; emojiIndex < emojis.length; emojiIndex += 1) {
      var _emojis$emojiIndex = emojis[emojiIndex],
          key = _emojis$emojiIndex.key,
          url = _emojis$emojiIndex.url;
      allEmojisMap.set(key, url);
    }
  }

  return allEmojisMap;
};
var getNicknamesMapFromMembers = function getNicknamesMapFromMembers() {
  var members = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var nicknamesMap = new Map();

  for (var memberIndex = 0; memberIndex < members.length; memberIndex += 1) {
    var _members$memberIndex = members[memberIndex],
        userId = _members$memberIndex.userId,
        nickname = _members$memberIndex.nickname;
    nicknamesMap.set(userId, nickname);
  }

  return nicknamesMap;
};
var getMessageCreatedAt = function getMessageCreatedAt(message) {
  return index$2.format(message.createdAt, 'p');
};
var isSameGroup = function isSameGroup(message, comparingMessage) {
  if (!message || !comparingMessage || !message.sender || !comparingMessage.sender || !message.createdAt || !comparingMessage.createdAt || !message.sender.userId || !comparingMessage.sender.userId) {
    return false;
  }

  return message.sendingStatus === comparingMessage.sendingStatus && message.sender.userId === comparingMessage.sender.userId && getMessageCreatedAt(message) === getMessageCreatedAt(comparingMessage);
};
var compareMessagesForGrouping = function compareMessagesForGrouping(prevMessage, currMessage, nextMessage) {
  return [isSameGroup(prevMessage, currMessage), isSameGroup(currMessage, nextMessage)];
};
var hasOwnProperty = function hasOwnProperty(property) {
  return function (payload) {
    // eslint-disable-next-line no-prototype-builtins
    if (payload && payload.hasOwnProperty && payload.hasOwnProperty(property)) {
      return true;
    }

    return false;
  };
};
var passUnsuccessfullMessages = function passUnsuccessfullMessages(allMessages, newMessage) {
  var _newMessage$sendingSt = newMessage.sendingStatus,
      sendingStatus = _newMessage$sendingSt === void 0 ? UNDEFINED : _newMessage$sendingSt;

  if (sendingStatus === SUCCEEDED$1 || sendingStatus === PENDING$1) {
    var lastIndexOfSucceededMessage = allMessages.map(function (message) {
      return message.sendingStatus || (message.isAdminMessage && message.isAdminMessage() ? SUCCEEDED$1 : UNDEFINED);
    }).lastIndexOf(SUCCEEDED$1);

    if (lastIndexOfSucceededMessage + 1 < allMessages.length) {
      var messages = LocalizationContext._toConsumableArray(allMessages);

      messages.splice(lastIndexOfSucceededMessage + 1, 0, newMessage);
      return messages;
    }
  }

  return [].concat(LocalizationContext._toConsumableArray(allMessages), [newMessage]);
};
var pxToNumber = function pxToNumber(px) {
  if (typeof px === 'number') {
    return px;
  }

  if (typeof px === 'string') {
    var parsed = Number.parseFloat(px);

    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return null;
};

var messagesInitialState = {
  initialized: false,
  loading: false,
  allMessages: [],
  currentGroupChannel: {
    members: []
  },
  // for scrollup
  hasMore: false,
  lastMessageTimeStamp: 0,
  // for scroll down
  // onScrollDownCallback is added for navigation to different timestamps on messageSearch
  // hasMoreToBottom, onScrollDownCallback -> scroll down
  // hasMore, onScrollCallback -> scroll up(default behavior)
  hasMoreToBottom: false,
  latestFetchedMessageTimeStamp: 0,
  emojiContainer: {},
  unreadCount: 0,
  unreadSince: null,
  isInvalid: false,
  messageListParams: null
};

var _getSendingMessageSta = index$1.getSendingMessageStatus(),
    SUCCEEDED = _getSendingMessageSta.SUCCEEDED,
    FAILED = _getSendingMessageSta.FAILED,
    PENDING = _getSendingMessageSta.PENDING;

function reducer(state, action) {
  switch (action.type) {
    case RESET_STATE:
      return messagesInitialState;

    case RESET_MESSAGES:
      return LocalizationContext._objectSpread2(LocalizationContext._objectSpread2({}, state), {}, {
        // when user switches channel, if the previous channel `hasMore`
        // the onScroll gets called twice, setting hasMore false prevents this
        hasMore: false,
        allMessages: []
      });

    case GET_PREV_MESSAGES_START:
      return LocalizationContext._objectSpread2(LocalizationContext._objectSpread2({}, state), {}, {
        loading: true
      });

    case CLEAR_SENT_MESSAGES:
      return LocalizationContext._objectSpread2(LocalizationContext._objectSpread2({}, state), {}, {
        allMessages: LocalizationContext._toConsumableArray(state.allMessages.filter(function (m) {
          return m.sendingStatus !== SUCCEEDED;
        }))
      });

    case GET_PREV_MESSAGES_SUCESS:
      {
        var receivedMessages = action.payload.messages || [];
        var _action$payload$curre = action.payload.currentGroupChannel,
            currentGroupChannel = _action$payload$curre === void 0 ? {} : _action$payload$curre;
        var stateChannel = state.currentGroupChannel || {};
        var stateChannelUrl = stateChannel.url;
        var actionChannelUrl = currentGroupChannel.url;

        if (actionChannelUrl !== stateChannelUrl) {
          return state;
        } // remove duplicate messages


        var filteredAllMessages = state.allMessages.filter(function (msg) {
          return !receivedMessages.find(function (_ref) {
            var messageId = _ref.messageId;
            return index$3.compareIds(messageId, msg.messageId);
          });
        });
        var hasHasMoreToBottom = hasOwnProperty('hasMoreToBottom')(action.payload);
        var hasLatestFetchedMessageTimeStamp = hasOwnProperty('latestFetchedMessageTimeStamp')(action.payload);
        return LocalizationContext._objectSpread2(LocalizationContext._objectSpread2(LocalizationContext._objectSpread2(LocalizationContext._objectSpread2({}, state), {}, {
          loading: false,
          initialized: true,
          hasMore: action.payload.hasMore,
          lastMessageTimeStamp: action.payload.lastMessageTimeStamp
        }, hasHasMoreToBottom && {
          hasMoreToBottom: action.payload.hasMoreToBottom
        }), hasLatestFetchedMessageTimeStamp && {
          latestFetchedMessageTimeStamp: action.payload.latestFetchedMessageTimeStamp
        }), {}, {
          allMessages: [].concat(LocalizationContext._toConsumableArray(receivedMessages), LocalizationContext._toConsumableArray(filteredAllMessages))
        });
      }

    case GET_NEXT_MESSAGES_SUCESS:
      {
        var _receivedMessages = action.payload.messages || [];

        var _action$payload$curre2 = action.payload.currentGroupChannel,
            _currentGroupChannel = _action$payload$curre2 === void 0 ? {} : _action$payload$curre2;

        var _stateChannel = state.currentGroupChannel || {};

        var _stateChannelUrl = _stateChannel.url;
        var _actionChannelUrl = _currentGroupChannel.url;

        if (_actionChannelUrl !== _stateChannelUrl) {
          return state;
        } // remove duplicate messages


        var _filteredAllMessages = state.allMessages.filter(function (msg) {
          return !_receivedMessages.find(function (_ref2) {
            var messageId = _ref2.messageId;
            return index$3.compareIds(messageId, msg.messageId);
          });
        });

        return LocalizationContext._objectSpread2(LocalizationContext._objectSpread2({}, state), {}, {
          loading: false,
          initialized: true,
          hasMore: action.payload.hasMore,
          lastMessageTimeStamp: action.payload.lastMessageTimeStamp,
          hasMoreToBottom: action.payload.hasMoreToBottom,
          latestFetchedMessageTimeStamp: action.payload.latestFetchedMessageTimeStamp,
          allMessages: [].concat(LocalizationContext._toConsumableArray(_filteredAllMessages), LocalizationContext._toConsumableArray(_receivedMessages))
        });
      }

    case GET_NEXT_MESSAGES_FAILURE:
      {
        return LocalizationContext._objectSpread2({}, state);
      }

    case SEND_MESSAGEGE_START:
      return LocalizationContext._objectSpread2(LocalizationContext._objectSpread2({}, state), {}, {
        allMessages: [].concat(LocalizationContext._toConsumableArray(state.allMessages), [LocalizationContext._objectSpread2({}, action.payload)])
      });

    case SEND_MESSAGEGE_SUCESS:
      {
        var newMessages = state.allMessages.map(function (m) {
          return index$3.compareIds(m.reqId, action.payload.reqId) ? action.payload : m;
        });

        LocalizationContext._toConsumableArray(newMessages).sort(function (a, b) {
          return a.sendingStatus && b.sendingStatus && a.sendingStatus === SUCCEEDED && (b.sendingStatus === PENDING || b.sendingStatus === FAILED) ? -1 : 1;
        });

        return LocalizationContext._objectSpread2(LocalizationContext._objectSpread2({}, state), {}, {
          allMessages: newMessages
        });
      }

    case SEND_MESSAGEGE_FAILURE:
      {
        // eslint-disable-next-line no-param-reassign
        action.payload.failed = true;
        return LocalizationContext._objectSpread2(LocalizationContext._objectSpread2({}, state), {}, {
          allMessages: state.allMessages.map(function (m) {
            return index$3.compareIds(m.reqId, action.payload.reqId) ? action.payload : m;
          })
        });
      }

    case SET_CURRENT_CHANNEL:
      {
        return LocalizationContext._objectSpread2(LocalizationContext._objectSpread2({}, state), {}, {
          currentGroupChannel: action.payload,
          isInvalid: false
        });
      }

    case SET_CHANNEL_INVALID:
      {
        return LocalizationContext._objectSpread2(LocalizationContext._objectSpread2({}, state), {}, {
          isInvalid: true
        });
      }

    case UPDATE_UNREAD_COUNT:
      {
        var channel = action.payload.channel;

        var _state$currentGroupCh = state.currentGroupChannel,
            _currentGroupChannel2 = _state$currentGroupCh === void 0 ? {} : _state$currentGroupCh,
            unreadCount = state.unreadCount;

        var currentGroupChannelUrl = _currentGroupChannel2.url;

        if (!index$3.compareIds(channel.url, currentGroupChannelUrl)) {
          return state;
        }

        return LocalizationContext._objectSpread2(LocalizationContext._objectSpread2({}, state), {}, {
          unreadSince: unreadCount + 1
        });
      }

    case ON_MESSAGE_RECEIVED:
      {
        var _action$payload = action.payload,
            _channel = _action$payload.channel,
            message = _action$payload.message,
            scrollToEnd = _action$payload.scrollToEnd;
        var _unreadCount = 0;

        var _state$currentGroupCh2 = state.currentGroupChannel,
            _currentGroupChannel3 = _state$currentGroupCh2 === void 0 ? {} : _state$currentGroupCh2,
            unreadSince = state.unreadSince;

        var _currentGroupChannelUrl = _currentGroupChannel3.url;

        if (!index$3.compareIds(_channel.url, _currentGroupChannelUrl)) {
          return state;
        } // Excluded overlapping messages


        if (state.allMessages.some(function (msg) {
          return msg.messageId === message.messageId;
        })) {
          return state;
        } // Filter by userFilledQuery


        if (state.messageListParams && !index$1.filterMessageListParams(state.messageListParams, message)) {
          return state;
        }

        _unreadCount = state.unreadCount + 1; // reset unreadCount if have to scrollToEnd

        if (scrollToEnd) {
          _unreadCount = 0;
        }

        if (message.isAdminMessage && message.isAdminMessage()) {
          return LocalizationContext._objectSpread2(LocalizationContext._objectSpread2({}, state), {}, {
            allMessages: passUnsuccessfullMessages(state.allMessages, message)
          });
        }

        return LocalizationContext._objectSpread2(LocalizationContext._objectSpread2({}, state), {}, {
          unreadCount: _unreadCount,
          unreadSince: _unreadCount === 1 ? index$2.format(new Date(), 'p MMM dd') : unreadSince,
          allMessages: passUnsuccessfullMessages(state.allMessages, message)
        });
      }

    case ON_MESSAGE_UPDATED:
      {
        var _message = action.payload.message;

        if (state.messageListParams && !index$1.filterMessageListParams(state.messageListParams, _message)) {
          // Delete the message if it doesn't match to the params anymore
          return LocalizationContext._objectSpread2(LocalizationContext._objectSpread2({}, state), {}, {
            allMessages: state.allMessages.filter(function (m) {
              return !index$3.compareIds(m.messageId, _message === null || _message === void 0 ? void 0 : _message.messageId);
            })
          });
        }

        return LocalizationContext._objectSpread2(LocalizationContext._objectSpread2({}, state), {}, {
          allMessages: state.allMessages.map(function (m) {
            return index$3.compareIds(m.messageId, action.payload.message.messageId) ? action.payload.message : m;
          })
        });
      }

    case RESEND_MESSAGEGE_START:
      return LocalizationContext._objectSpread2(LocalizationContext._objectSpread2({}, state), {}, {
        allMessages: state.allMessages.map(function (m) {
          return index$3.compareIds(m.reqId, action.payload.reqId) ? action.payload : m;
        })
      });

    case MARK_AS_READ:
      return LocalizationContext._objectSpread2(LocalizationContext._objectSpread2({}, state), {}, {
        unreadCount: 0,
        unreadSince: null
      });

    case ON_MESSAGE_DELETED:
      return LocalizationContext._objectSpread2(LocalizationContext._objectSpread2({}, state), {}, {
        allMessages: state.allMessages.filter(function (m) {
          return !index$3.compareIds(m.messageId, action.payload);
        })
      });

    case ON_MESSAGE_DELETED_BY_REQ_ID:
      return LocalizationContext._objectSpread2(LocalizationContext._objectSpread2({}, state), {}, {
        allMessages: state.allMessages.filter(function (m) {
          return !index$3.compareIds(m.reqId, action.payload);
        })
      });

    case SET_EMOJI_CONTAINER:
      {
        return LocalizationContext._objectSpread2(LocalizationContext._objectSpread2({}, state), {}, {
          emojiContainer: action.payload
        });
      }

    case ON_REACTION_UPDATED:
      {
        return LocalizationContext._objectSpread2(LocalizationContext._objectSpread2({}, state), {}, {
          allMessages: state.allMessages.map(function (m) {
            if (index$3.compareIds(m.messageId, action.payload.messageId)) {
              if (m.applyReactionEvent && typeof m.applyReactionEvent === 'function') {
                m.applyReactionEvent(action.payload);
              }

              return m;
            }

            return m;
          })
        });
      }

    case MESSAGE_LIST_PARAMS_CHANGED:
      {
        return LocalizationContext._objectSpread2(LocalizationContext._objectSpread2({}, state), {}, {
          messageListParams: action.payload
        });
      }

    default:
      return state;
  }
}

/**
 * Handles ChannelEvents and send values to dispatcher using messagesDispatcher
 * messagesDispatcher: Dispatcher
 * sdk: sdkInstance
 * logger: loggerInstance
 * channelUrl: string
 * sdkInit: bool
 */

function useHandleChannelEvents(_ref, _ref2) {
  var currentGroupChannel = _ref.currentGroupChannel,
      sdkInit = _ref.sdkInit,
      hasMoreToBottom = _ref.hasMoreToBottom;
  var messagesDispatcher = _ref2.messagesDispatcher,
      sdk = _ref2.sdk,
      logger = _ref2.logger,
      scrollRef = _ref2.scrollRef;
  var channelUrl = currentGroupChannel && currentGroupChannel.url;
  React.useEffect(function () {
    var messageReceiverId = LocalizationContext.uuidv4();

    if (channelUrl && sdk && sdk.ChannelHandler) {
      var ChannelHandler = new sdk.ChannelHandler();
      logger.info('Channel | useHandleChannelEvents: Setup event handler', messageReceiverId);

      ChannelHandler.onMessageReceived = function (channel, message) {
        // donot update if hasMoreToBottom
        if (index$3.compareIds(channel.url, currentGroupChannel.url) && !hasMoreToBottom) {
          var scrollToEnd = false;

          try {
            var current = scrollRef.current;
            scrollToEnd = current.offsetHeight + current.scrollTop >= current.scrollHeight;
          } catch (error) {//
          }

          logger.info('Channel | useHandleChannelEvents: onMessageReceived', message);
          messagesDispatcher({
            type: ON_MESSAGE_RECEIVED,
            payload: {
              channel: channel,
              message: message,
              scrollToEnd: scrollToEnd
            }
          });

          if (scrollToEnd) {
            try {
              setTimeout(function () {
                currentGroupChannel.markAsRead();
                scrollIntoLast();
              });
            } catch (error) {
              logger.warning('Channel | onMessageReceived | scroll to end failed');
            }
          }
        }

        if (index$3.compareIds(channel.url, currentGroupChannel.url) && hasMoreToBottom) {
          messagesDispatcher({
            type: UPDATE_UNREAD_COUNT,
            payload: {
              channel: channel
            }
          });
        }
      };

      ChannelHandler.onMessageUpdated = function (channel, message) {
        logger.info('Channel | useHandleChannelEvents: onMessageUpdated', message);
        messagesDispatcher({
          type: ON_MESSAGE_UPDATED,
          payload: {
            channel: channel,
            message: message
          }
        });
      };

      ChannelHandler.onMessageDeleted = function (_, messageId) {
        logger.info('Channel | useHandleChannelEvents: onMessageDeleted', messageId);
        messagesDispatcher({
          type: ON_MESSAGE_DELETED,
          payload: messageId
        });
      };

      ChannelHandler.onReactionUpdated = function (_, reactionEvent) {
        logger.info('Channel | useHandleChannelEvents: onReactionUpdated', reactionEvent);
        messagesDispatcher({
          type: ON_REACTION_UPDATED,
          payload: reactionEvent
        });
      };

      ChannelHandler.onChannelChanged = function (groupChannel) {
        if (index$3.compareIds(groupChannel.url, currentGroupChannel.url)) {
          logger.info('Channel | useHandleChannelEvents: onChannelChanged', groupChannel);
          messagesDispatcher({
            type: SET_CURRENT_CHANNEL,
            payload: groupChannel
          });
        }
      };

      ChannelHandler.onChannelFrozen = function (groupChannel) {
        if (index$3.compareIds(groupChannel.url, currentGroupChannel.url)) {
          logger.info('Channel | useHandleChannelEvents: onChannelFrozen', groupChannel);
          messagesDispatcher({
            type: SET_CURRENT_CHANNEL,
            payload: groupChannel
          });
        }
      };

      ChannelHandler.onChannelUnfrozen = function (groupChannel) {
        if (index$3.compareIds(groupChannel.url, currentGroupChannel.url)) {
          logger.info('Channel | useHandleChannelEvents: onChannelUnFrozen', groupChannel);
          messagesDispatcher({
            type: SET_CURRENT_CHANNEL,
            payload: groupChannel
          });
        }
      };

      ChannelHandler.onUserMuted = function (groupChannel) {
        if (index$3.compareIds(groupChannel.url, currentGroupChannel.url)) {
          logger.info('Channel | useHandleChannelEvents: onUserMuted', groupChannel);
          messagesDispatcher({
            type: SET_CURRENT_CHANNEL,
            payload: groupChannel
          });
        }
      };

      ChannelHandler.onUserUnmuted = function (groupChannel) {
        if (index$3.compareIds(groupChannel.url, currentGroupChannel.url)) {
          logger.info('Channel | useHandleChannelEvents: onUserUnmuted', groupChannel);
          messagesDispatcher({
            type: SET_CURRENT_CHANNEL,
            payload: groupChannel
          });
        }
      };

      ChannelHandler.onUserBanned = function (groupChannel) {
        if (index$3.compareIds(groupChannel.url, currentGroupChannel.url)) {
          logger.info('Channel | useHandleChannelEvents: onUserBanned', groupChannel);
          messagesDispatcher({
            type: SET_CURRENT_CHANNEL,
            payload: groupChannel
          });
        }
      };

      ChannelHandler.onOperatorUpdated = function (groupChannel) {
        if (index$3.compareIds(groupChannel.url, currentGroupChannel.url)) {
          logger.info('Channel | useHandleChannelEvents: onOperatorUpdated', groupChannel);
          messagesDispatcher({
            type: SET_CURRENT_CHANNEL,
            payload: groupChannel
          });
        }
      }; // Add this channel event handler to the SendBird object.


      sdk.addChannelHandler(messageReceiverId, ChannelHandler);
    }

    return function () {
      if (sdk && sdk.removeChannelHandler) {
        logger.info('Channel | useHandleChannelEvents: Removing message reciver handler', messageReceiverId);
        sdk.removeChannelHandler(messageReceiverId);
      }
    };
  }, [channelUrl, sdkInit]);
}

function useSetChannel(_ref, _ref2) {
  var channelUrl = _ref.channelUrl,
      sdkInit = _ref.sdkInit;
  var messagesDispatcher = _ref2.messagesDispatcher,
      sdk = _ref2.sdk,
      logger = _ref2.logger;
  React.useEffect(function () {
    if (channelUrl && sdkInit && sdk && sdk.GroupChannel) {
      logger.info('Channel | useSetChannel fetching channel', channelUrl);
      sdk.GroupChannel.getChannel(channelUrl).then(function (groupChannel) {
        logger.info('Channel | useSetChannel fetched channel', groupChannel);
        messagesDispatcher({
          type: SET_CURRENT_CHANNEL,
          payload: groupChannel
        });
        logger.info('Channel: Mark as read', groupChannel); // this order is important - this mark as read should update the event handler up above

        groupChannel.markAsRead();
      }).catch(function (e) {
        logger.warning('Channel | useSetChannel fetch channel failed', {
          channelUrl: channelUrl,
          e: e
        });
        messagesDispatcher({
          type: SET_CHANNEL_INVALID
        });
      });
      sdk.getAllEmoji(function (emojiContainer_, err) {
        if (err) {
          logger.error('Channel: Getting emojis failed', err);
          return;
        }

        logger.info('Channel: Getting emojis success', emojiContainer_);
        messagesDispatcher({
          type: SET_EMOJI_CONTAINER,
          payload: emojiContainer_
        });
      });
    }
  }, [channelUrl, sdkInit]);
}

var PREV_RESULT_SIZE = 30;
var NEXT_RESULT_SIZE = 10;

var getLatestMessageTimeStamp = function getLatestMessageTimeStamp() {
  var messages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var latestMessage = messages[messages.length - 1];
  return latestMessage && latestMessage.createdAt || null;
};

function useInitialMessagesFetch(_ref, _ref2) {
  var currentGroupChannel = _ref.currentGroupChannel,
      userFilledMessageListQuery = _ref.userFilledMessageListQuery,
      intialTimeStamp = _ref.intialTimeStamp;
  var sdk = _ref2.sdk,
      logger = _ref2.logger,
      messagesDispatcher = _ref2.messagesDispatcher;
  var channelUrl = currentGroupChannel && currentGroupChannel.url;
  React.useEffect(function () {
    logger.info('Channel useInitialMessagesFetch: Setup started', currentGroupChannel);
    messagesDispatcher({
      type: RESET_MESSAGES
    });

    if (sdk && sdk.MessageListParams && currentGroupChannel && currentGroupChannel.getMessagesByTimestamp) {
      var messageListParams = new sdk.MessageListParams();
      messageListParams.prevResultSize = PREV_RESULT_SIZE;
      messageListParams.isInclusive = true;
      messageListParams.includeReplies = false;
      messageListParams.includeReaction = true;

      if (userFilledMessageListQuery) {
        Object.keys(userFilledMessageListQuery).forEach(function (key) {
          messageListParams[key] = userFilledMessageListQuery[key];
        });
        logger.info('Channel useInitialMessagesFetch: Setup messageListParams', messageListParams);
        messagesDispatcher({
          type: MESSAGE_LIST_PARAMS_CHANGED,
          payload: messageListParams
        });
      }

      logger.info('Channel: Fetching messages', {
        currentGroupChannel: currentGroupChannel,
        userFilledMessageListQuery: userFilledMessageListQuery
      });
      messagesDispatcher({
        type: GET_PREV_MESSAGES_START
      });

      if (intialTimeStamp) {
        messageListParams.nextResultSize = NEXT_RESULT_SIZE;
        currentGroupChannel.getMessagesByTimestamp(intialTimeStamp, messageListParams).then(function (messages) {
          var hasMore = messages && messages.length > 0;
          var lastMessageTimeStamp = hasMore ? messages[0].createdAt : null;
          var latestFetchedMessageTimeStamp = getLatestMessageTimeStamp(messages); // to make sure there are no more messages below

          var nextMessageListParams = new sdk.MessageListParams();
          nextMessageListParams.nextResultSize = NEXT_RESULT_SIZE;
          currentGroupChannel.getMessagesByTimestamp(latestFetchedMessageTimeStamp || new Date().getTime(), nextMessageListParams).then(function (nextMessages) {
            messagesDispatcher({
              type: GET_PREV_MESSAGES_SUCESS,
              payload: {
                messages: messages,
                hasMore: hasMore,
                lastMessageTimeStamp: lastMessageTimeStamp,
                currentGroupChannel: currentGroupChannel,
                latestFetchedMessageTimeStamp: latestFetchedMessageTimeStamp,
                hasMoreToBottom: nextMessages && nextMessages.length > 0
              }
            });
          });
        }).catch(function (error) {
          logger.error('Channel: Fetching messages failed', error);
          messagesDispatcher({
            type: GET_PREV_MESSAGES_SUCESS,
            payload: {
              messages: [],
              hasMore: false,
              lastMessageTimeStamp: 0,
              currentGroupChannel: currentGroupChannel
            }
          });
        }).finally(function () {
          if (!intialTimeStamp) {
            setTimeout(function () {
              return scrollIntoLast();
            });
          }

          currentGroupChannel.markAsRead();
        });
      } else {
        currentGroupChannel.getMessagesByTimestamp(new Date().getTime(), messageListParams).then(function (messages) {
          var hasMore = messages && messages.length > 0;
          var lastMessageTimeStamp = hasMore ? messages[0].createdAt : null;
          var latestFetchedMessageTimeStamp = getLatestMessageTimeStamp(messages);
          messagesDispatcher({
            type: GET_PREV_MESSAGES_SUCESS,
            payload: {
              messages: messages,
              hasMore: hasMore,
              lastMessageTimeStamp: lastMessageTimeStamp,
              currentGroupChannel: currentGroupChannel,
              latestFetchedMessageTimeStamp: latestFetchedMessageTimeStamp,
              hasMoreToBottom: false
            }
          });
        }).catch(function (error) {
          logger.error('Channel: Fetching messages failed', error);
          messagesDispatcher({
            type: GET_PREV_MESSAGES_SUCESS,
            payload: {
              messages: [],
              hasMore: false,
              lastMessageTimeStamp: 0,
              currentGroupChannel: currentGroupChannel
            }
          });
        }).finally(function () {
          if (!intialTimeStamp) {
            setTimeout(function () {
              return scrollIntoLast();
            });
          }

          currentGroupChannel.markAsRead();
        });
      }
    }
  }, [channelUrl, userFilledMessageListQuery, intialTimeStamp]);
  /**
   * Note - useEffect(() => {}, [currentGroupChannel])
   * was buggy, that is why we did
   * const channelUrl = currentGroupChannel && currentGroupChannel.url;
   * useEffect(() => {}, [channelUrl])
   * Again, this hook is supposed to execute when currentGroupChannel changes
   * The 'channelUrl' here is not the same memory reference from Conversation.props
   */
}

function useHandleReconnect(_ref, _ref2) {
  var isOnline = _ref.isOnline;
  var logger = _ref2.logger,
      sdk = _ref2.sdk,
      currentGroupChannel = _ref2.currentGroupChannel,
      messagesDispatcher = _ref2.messagesDispatcher,
      userFilledMessageListQuery = _ref2.userFilledMessageListQuery;
  React.useEffect(function () {
    var wasOffline = !isOnline;
    return function () {
      // state changed from offline to online
      if (wasOffline) {
        logger.info('Refreshing conversation state');
        var _sdk$appInfo = sdk.appInfo,
            appInfo = _sdk$appInfo === void 0 ? {} : _sdk$appInfo;
        var useReaction = appInfo.isUsingReaction || false;
        var messageListParams = new sdk.MessageListParams();
        messageListParams.prevResultSize = 30;
        messageListParams.includeReplies = false;
        messageListParams.includeReaction = useReaction;

        if (userFilledMessageListQuery) {
          Object.keys(userFilledMessageListQuery).forEach(function (key) {
            messageListParams[key] = userFilledMessageListQuery[key];
          });
        }

        logger.info('Channel: Fetching messages', {
          currentGroupChannel: currentGroupChannel,
          userFilledMessageListQuery: userFilledMessageListQuery
        });
        messagesDispatcher({
          type: GET_PREV_MESSAGES_START
        });
        sdk.GroupChannel.getChannel(currentGroupChannel.url).then(function (groupChannel) {
          var lastMessageTime = new Date().getTime();
          groupChannel.getMessagesByTimestamp(lastMessageTime, messageListParams).then(function (messages) {
            messagesDispatcher({
              type: CLEAR_SENT_MESSAGES
            });
            var hasMore = messages && messages.length > 0;
            var lastMessageTimeStamp = hasMore ? messages[0].createdAt : null;
            messagesDispatcher({
              type: GET_PREV_MESSAGES_SUCESS,
              payload: {
                messages: messages,
                hasMore: hasMore,
                lastMessageTimeStamp: lastMessageTimeStamp,
                currentGroupChannel: currentGroupChannel
              }
            });
            setTimeout(function () {
              return scrollIntoLast();
            });
          }).catch(function (error) {
            logger.error('Channel: Fetching messages failed', error);
          }).finally(function () {
            currentGroupChannel.markAsRead();
          });
        });
      }
    };
  }, [isOnline]);
}

function useScrollCallback(_ref, _ref2) {
  var currentGroupChannel = _ref.currentGroupChannel,
      lastMessageTimeStamp = _ref.lastMessageTimeStamp,
      userFilledMessageListQuery = _ref.userFilledMessageListQuery;
  var hasMore = _ref2.hasMore,
      logger = _ref2.logger,
      messagesDispatcher = _ref2.messagesDispatcher,
      sdk = _ref2.sdk;
  return React.useCallback(function (cb) {
    if (!hasMore) {
      return;
    }

    var messageListParams = new sdk.MessageListParams();
    messageListParams.prevResultSize = 30;
    messageListParams.includeReplies = false;
    messageListParams.includeReaction = true;

    if (userFilledMessageListQuery) {
      Object.keys(userFilledMessageListQuery).forEach(function (key) {
        messageListParams[key] = userFilledMessageListQuery[key];
      });
    }

    logger.info('Channel: Fetching messages', {
      currentGroupChannel: currentGroupChannel,
      userFilledMessageListQuery: userFilledMessageListQuery
    });
    currentGroupChannel.getMessagesByTimestamp(lastMessageTimeStamp || new Date().getTime(), messageListParams).then(function (messages) {
      var hasMoreMessages = messages && messages.length > 0;
      var lastMessageTs = hasMoreMessages ? messages[0].createdAt : null;
      messagesDispatcher({
        type: GET_PREV_MESSAGES_SUCESS,
        payload: {
          messages: messages,
          hasMore: hasMoreMessages,
          lastMessageTimeStamp: lastMessageTs,
          currentGroupChannel: currentGroupChannel
        }
      });
      cb([messages, null]);
    }).catch(function (error) {
      logger.error('Channel: Fetching messages failed', error);
      messagesDispatcher({
        type: GET_PREV_MESSAGES_SUCESS,
        payload: {
          messages: [],
          hasMore: false,
          lastMessageTimeStamp: 0,
          currentGroupChannel: currentGroupChannel
        }
      });
      cb([null, error]);
    }).finally(function () {
      currentGroupChannel.markAsRead();
    });
  }, [currentGroupChannel, lastMessageTimeStamp]);
}

var RESULT_SIZE = 30;

function useScrollDownCallback(_ref, _ref2) {
  var currentGroupChannel = _ref.currentGroupChannel,
      latestFetchedMessageTimeStamp = _ref.latestFetchedMessageTimeStamp,
      userFilledMessageListQuery = _ref.userFilledMessageListQuery,
      hasMoreToBottom = _ref.hasMoreToBottom;
  var logger = _ref2.logger,
      messagesDispatcher = _ref2.messagesDispatcher,
      sdk = _ref2.sdk;
  return React.useCallback(function (cb) {
    if (!hasMoreToBottom) {
      return;
    }

    var messageListParams = new sdk.MessageListParams();
    messageListParams.nextResultSize = RESULT_SIZE;
    messageListParams.includeReplies = false;
    messageListParams.includeReaction = true;

    if (userFilledMessageListQuery) {
      Object.keys(userFilledMessageListQuery).forEach(function (key) {
        messageListParams[key] = userFilledMessageListQuery[key];
      });
    }

    logger.info('Channel: Fetching later messages', {
      currentGroupChannel: currentGroupChannel,
      userFilledMessageListQuery: userFilledMessageListQuery
    });
    currentGroupChannel.getMessagesByTimestamp(latestFetchedMessageTimeStamp || new Date().getTime(), messageListParams).then(function (messages) {
      var messagesLength = messages && messages.length || 0;
      var hasMoreMessages = messagesLength > 0 && messageListParams.nextResultSize === messagesLength;
      var lastMessageTs = hasMoreMessages ? messages[messages.length - 1].createdAt : null;
      messagesDispatcher({
        type: GET_NEXT_MESSAGES_SUCESS,
        payload: {
          messages: messages,
          hasMoreToBottom: hasMoreMessages,
          latestFetchedMessageTimeStamp: lastMessageTs,
          currentGroupChannel: currentGroupChannel
        }
      });
      cb([messages, null]);
    }).catch(function (error) {
      logger.error('Channel: Fetching later messages failed', error);
      messagesDispatcher({
        type: GET_NEXT_MESSAGES_FAILURE,
        payload: {
          messages: [],
          hasMoreToBottom: false,
          latestFetchedMessageTimeStamp: 0,
          currentGroupChannel: currentGroupChannel
        }
      });
      cb([null, error]);
    }).finally(function () {
      currentGroupChannel.markAsRead();
    });
  }, [currentGroupChannel, latestFetchedMessageTimeStamp, hasMoreToBottom]);
}

function useDeleteMessageCallback(_ref, _ref2) {
  var currentGroupChannel = _ref.currentGroupChannel,
      messagesDispatcher = _ref.messagesDispatcher;
  var logger = _ref2.logger;
  return React.useCallback(function (message, cb) {
    logger.info('Channel | useDeleteMessageCallback: Deleting message', message);
    var requestState = message.requestState;
    logger.info('Channel | useDeleteMessageCallback: Deleting message requestState:', requestState); // Message is only on local

    if (requestState === 'failed' || requestState === 'pending') {
      logger.info('Channel | useDeleteMessageCallback: Deleted message from local:', message);
      messagesDispatcher({
        type: ON_MESSAGE_DELETED_BY_REQ_ID,
        payload: message.reqId
      });

      if (cb) {
        cb();
      }

      return;
    } // Message is on server


    currentGroupChannel.deleteMessage(message, function (err) {
      logger.info('Channel | useDeleteMessageCallback: Deleting message from remote:', requestState);

      if (cb) {
        cb(err);
      }

      if (!err) {
        logger.info('Channel | useDeleteMessageCallback: Deleting message success!', message);
        messagesDispatcher({
          type: ON_MESSAGE_DELETED,
          payload: message.messageId
        });
      } else {
        logger.warning('Channel | useDeleteMessageCallback: Deleting message failed!', err);
      }
    });
  }, [currentGroupChannel, messagesDispatcher]);
}

function useUpdateMessageCallback(_ref, _ref2) {
  var currentGroupChannel = _ref.currentGroupChannel,
      messagesDispatcher = _ref.messagesDispatcher,
      onBeforeUpdateUserMessage = _ref.onBeforeUpdateUserMessage;
  var logger = _ref2.logger,
      pubSub = _ref2.pubSub,
      sdk = _ref2.sdk;
  return React.useCallback(function (messageId, text, cb) {
    var createParamsDefault = function createParamsDefault(txt) {
      var params = new sdk.UserMessageParams();
      params.message = txt;
      return params;
    };

    var createCustomPrams = onBeforeUpdateUserMessage && typeof onBeforeUpdateUserMessage === 'function';

    if (createCustomPrams) {
      logger.info('Channel: creating params using onBeforeUpdateUserMessage', onBeforeUpdateUserMessage);
    }

    var params = onBeforeUpdateUserMessage ? onBeforeUpdateUserMessage(text) : createParamsDefault(text);
    currentGroupChannel.updateUserMessage(messageId, params, function (r, e) {
      logger.info('Channel: Updating message!', params);
      var swapParams = sdk.getErrorFirstCallback();
      var message = r;
      var err = e;

      if (swapParams) {
        message = e;
        err = r;
      }

      if (cb) {
        cb(err, message);
      }

      if (!err) {
        logger.info('Channel: Updating message success!', message);
        messagesDispatcher({
          type: ON_MESSAGE_UPDATED,
          payload: {
            channel: currentGroupChannel,
            message: message
          }
        });
        pubSub.publish(index$1.UPDATE_USER_MESSAGE, {
          message: message,
          channel: currentGroupChannel
        });
      } else {
        logger.warning('Channel: Updating message failed!', err);
      }
    });
  }, [currentGroupChannel.url, messagesDispatcher, onBeforeUpdateUserMessage]);
}

function useResendMessageCallback(_ref, _ref2) {
  var currentGroupChannel = _ref.currentGroupChannel,
      messagesDispatcher = _ref.messagesDispatcher;
  var logger = _ref2.logger;
  return React.useCallback(function (failedMessage) {
    logger.info('Channel: Resending message has started', failedMessage);
    var messageType = failedMessage.messageType,
        file = failedMessage.file;

    if (failedMessage && typeof failedMessage.isResendable === 'function' && failedMessage.isResendable()) {
      // eslint-disable-next-line no-param-reassign
      failedMessage.requestState = 'pending';
      messagesDispatcher({
        type: RESEND_MESSAGEGE_START,
        payload: failedMessage
      }); // userMessage

      if (messageType === 'user') {
        currentGroupChannel.resendUserMessage(failedMessage).then(function (message) {
          logger.info('Channel: Resending message success!', {
            message: message
          });
          messagesDispatcher({
            type: SEND_MESSAGEGE_SUCESS,
            payload: message
          });
        }).catch(function (e) {
          logger.warning('Channel: Resending message failed!', {
            e: e
          }); // eslint-disable-next-line no-param-reassign

          failedMessage.requestState = 'failed';
          messagesDispatcher({
            type: SEND_MESSAGEGE_FAILURE,
            payload: failedMessage
          });
        }); // eslint-disable-next-line no-param-reassign

        failedMessage.requestState = 'pending';
        messagesDispatcher({
          type: RESEND_MESSAGEGE_START,
          payload: failedMessage
        });
        return;
      }

      if (messageType === 'file') {
        currentGroupChannel.resendFileMessage(failedMessage, file).then(function (message) {
          logger.info('Channel: Resending file message success!', {
            message: message
          });
          messagesDispatcher({
            type: SEND_MESSAGEGE_SUCESS,
            payload: message
          });
        }).catch(function (e) {
          logger.warning('Channel: Resending file message failed!', {
            e: e
          }); // eslint-disable-next-line no-param-reassign

          failedMessage.requestState = 'failed';
          messagesDispatcher({
            type: SEND_MESSAGEGE_FAILURE,
            payload: failedMessage
          });
        }); // eslint-disable-next-line no-param-reassign

        failedMessage.requestState = 'pending';
        messagesDispatcher({
          type: RESEND_MESSAGEGE_START,
          payload: failedMessage
        });
      }
    } else {
      // to alert user on console
      // eslint-disable-next-line no-console
      console.error('Message is not resendable');
      logger.warning('Message is not resendable', failedMessage);
    }
  }, [currentGroupChannel, messagesDispatcher]);
}

function useSendMessageCallback(_ref, _ref2) {
  var currentGroupChannel = _ref.currentGroupChannel,
      onBeforeSendUserMessage = _ref.onBeforeSendUserMessage;
  var sdk = _ref2.sdk,
      logger = _ref2.logger,
      pubSub = _ref2.pubSub,
      messagesDispatcher = _ref2.messagesDispatcher;
  var messageInputRef = React.useRef(null);
  var sendMessage = React.useCallback(function () {
    var text = messageInputRef.current.value;

    var createParamsDefault = function createParamsDefault(txt) {
      var message = typeof txt === 'string' ? txt.trim() : txt;
      var params = new sdk.UserMessageParams();
      params.message = message;
      return params;
    };

    var createCustomPrams = onBeforeSendUserMessage && typeof onBeforeSendUserMessage === 'function';

    if (createCustomPrams) {
      logger.info('Channel: creating params using onBeforeSendUserMessage', onBeforeSendUserMessage);
    }

    var params = onBeforeSendUserMessage ? onBeforeSendUserMessage(text) : createParamsDefault(text);
    logger.info('Channel: Sending message has started', params);
    var pendingMsg = currentGroupChannel.sendUserMessage(params, function (res, err) {
      var swapParams = sdk.getErrorFirstCallback();
      var message = res;
      var error = err;

      if (swapParams) {
        message = err;
        error = res;
      } // sending params instead of pending message
      // to make sure that we can resend the message once it fails


      if (error) {
        logger.warning('Channel: Sending message failed!', {
          message: message
        });
        messagesDispatcher({
          type: SEND_MESSAGEGE_FAILURE,
          payload: message
        });
        return;
      }

      logger.info('Channel: Sending message success!', message);
      messagesDispatcher({
        type: SEND_MESSAGEGE_SUCESS,
        payload: message
      });
    });
    pubSub.publish(index$1.SEND_MESSAGE_START, {
      /* pubSub is used instead of messagesDispatcher
        to avoid redundantly calling `messageActionTypes.SEND_MESSAGEGE_START` */
      message: pendingMsg,
      channel: currentGroupChannel
    });
    setTimeout(function () {
      return scrollIntoLast();
    });
  }, [currentGroupChannel, onBeforeSendUserMessage]);
  return [messageInputRef, sendMessage];
}

function useSendFileMessageCallback(_ref, _ref2) {
  var currentGroupChannel = _ref.currentGroupChannel,
      onBeforeSendFileMessage = _ref.onBeforeSendFileMessage,
      _ref$imageCompression = _ref.imageCompression,
      imageCompression = _ref$imageCompression === void 0 ? {} : _ref$imageCompression;
  var sdk = _ref2.sdk,
      logger = _ref2.logger,
      pubSub = _ref2.pubSub,
      messagesDispatcher = _ref2.messagesDispatcher;
  var sendMessage = React.useCallback(function (file) {
    var compressionRate = imageCompression.compressionRate,
        resizingWidth = imageCompression.resizingWidth,
        resizingHeight = imageCompression.resizingHeight;
    var createCustomParams = onBeforeSendFileMessage && typeof onBeforeSendFileMessage === 'function';
    var compressibleFileType = file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg';
    var compressibleRatio = compressionRate > 0 && compressionRate < 1; // pxToNumber returns null if values are invalid

    var compressibleDiamensions = pxToNumber(resizingWidth) || pxToNumber(resizingHeight);
    var canCompressImage = compressibleFileType && (compressibleRatio || compressibleDiamensions);

    var createParamsDefault = function createParamsDefault(file_) {
      var params = new sdk.FileMessageParams();
      params.file = file_;
      return params;
    };

    if (canCompressImage) {
      // Using image compression
      try {
        var image = document.createElement('img');
        image.src = URL.createObjectURL(file);

        image.onload = function () {
          URL.revokeObjectURL(image.src);
          var canvas = document.createElement('canvas');
          var imageWdith = image.naturalWidth || image.width;
          var imageHeight = image.naturalHeight || image.height;
          var targetWidth = pxToNumber(resizingWidth) || imageWdith;
          var targetHeight = pxToNumber(resizingHeight) || imageHeight; // In canvas.toBlob(callback, mimeType, qualityArgument)
          // qualityArgument doesnt work
          // so in case compressibleDiamensions are not present, we use ratio

          if (file.type === 'image/png' && !compressibleDiamensions) {
            targetWidth *= compressionRate;
            targetHeight *= compressionRate;
          }

          canvas.width = targetWidth;
          canvas.height = targetHeight;
          var context = canvas.getContext('2d');
          context.drawImage(image, 0, 0, targetWidth, targetHeight);
          context.canvas.toBlob(function (newImageBlob) {
            var compressedFile = new File([newImageBlob], file.name, {
              type: file.type
            });

            if (createCustomParams) {
              logger.info('Channel: Creating params using onBeforeSendFileMessage', onBeforeSendFileMessage);
            }

            var params = createCustomParams ? onBeforeSendFileMessage(compressedFile) : createParamsDefault(compressedFile);
            logger.info('Channel: Uploading file message start!', params);
            var pendingMessage = currentGroupChannel.sendFileMessage(params, function (response, err) {
              var swapParams = sdk.getErrorFirstCallback();

              var _ref3 = swapParams ? [err, response] : [response, err],
                  _ref4 = LocalizationContext._slicedToArray(_ref3, 2),
                  message = _ref4[0],
                  error = _ref4[1];

              if (error) {
                // sending params instead of pending message
                // to make sure that we can resend the message once it fails
                logger.error('Channel: Sending file message failed!', {
                  message: message,
                  error: error
                });
                message.localUrl = URL.createObjectURL(compressedFile);
                message.file = compressedFile;
                messagesDispatcher({
                  type: SEND_MESSAGEGE_FAILURE,
                  payload: message
                });
                return;
              }

              logger.info('Channel: Sending file message success!', message);
              messagesDispatcher({
                type: SEND_MESSAGEGE_SUCESS,
                payload: message
              });
            });
            pubSub.publish(index$1.SEND_MESSAGE_START, {
              /* pubSub is used instead of messagesDispatcher
                to avoid redundantly calling `messageActionTypes.SEND_MESSAGEGE_START` */
              message: LocalizationContext._objectSpread2(LocalizationContext._objectSpread2({}, pendingMessage), {}, {
                url: URL.createObjectURL(compressedFile),
                // pending thumbnail message seems to be failed
                requestState: 'pending'
              }),
              channel: currentGroupChannel
            });
            setTimeout(function () {
              return scrollIntoLast();
            }, 1000);
          }, file.type, compressionRate);
        };
      } catch (error) {
        logger.error('Channel: Sending file message failed!', error);
      }
    } else {
      // Not using image compression
      if (createCustomParams) {
        logger.info('Channel: creating params using onBeforeSendFileMessage', onBeforeSendFileMessage);
      }

      var params = onBeforeSendFileMessage ? onBeforeSendFileMessage(file) : createParamsDefault(file);
      logger.info('Channel: Uploading file message start!', params);
      var pendingMsg = currentGroupChannel.sendFileMessage(params, function (response, err) {
        var swapParams = sdk.getErrorFirstCallback();

        var _ref5 = swapParams ? [err, response] : [response, err],
            _ref6 = LocalizationContext._slicedToArray(_ref5, 2),
            message = _ref6[0],
            error = _ref6[1];

        if (error) {
          // sending params instead of pending message
          // to make sure that we can resend the message once it fails
          logger.error('Channel: Sending file message failed!', {
            message: message,
            error: error
          });
          message.localUrl = URL.createObjectURL(file);
          message.file = file;
          messagesDispatcher({
            type: SEND_MESSAGEGE_FAILURE,
            payload: message
          });
          return;
        }

        logger.info('Channel: Sending message success!', message);
        messagesDispatcher({
          type: SEND_MESSAGEGE_SUCESS,
          payload: message
        });
      });
      pubSub.publish(index$1.SEND_MESSAGE_START, {
        /* pubSub is used instead of messagesDispatcher
          to avoid redundantly calling `messageActionTypes.SEND_MESSAGEGE_START` */
        message: LocalizationContext._objectSpread2(LocalizationContext._objectSpread2({}, pendingMsg), {}, {
          url: URL.createObjectURL(file),
          // pending thumbnail message seems to be failed
          requestState: 'pending'
        }),
        channel: currentGroupChannel
      });
      setTimeout(function () {
        return scrollIntoLast();
      }, 1000);
    }
  }, [currentGroupChannel, onBeforeSendFileMessage, imageCompression]);
  return [sendMessage];
}

function useMemoizedEmojiListItems(_ref, _ref2) {
  var emojiContainer = _ref.emojiContainer,
      toggleReaction = _ref.toggleReaction;
  var useReaction = _ref2.useReaction,
      logger = _ref2.logger,
      userId = _ref2.userId,
      emojiAllList = _ref2.emojiAllList;

  /* eslint-disable react/prop-types */
  return React.useMemo(function () {
    return function (_ref3) {
      var parentRef = _ref3.parentRef,
          parentContainRef = _ref3.parentContainRef,
          message = _ref3.message,
          closeDropdown = _ref3.closeDropdown,
          _ref3$spaceFromTrigge = _ref3.spaceFromTrigger,
          spaceFromTrigger = _ref3$spaceFromTrigge === void 0 ? {} : _ref3$spaceFromTrigge;

      if (!useReaction || !(parentRef || parentContainRef || message || closeDropdown)) {
        logger.warning('Channel: Invalid Params in memoizedEmojiListItems');
        return null;
      }

      return /*#__PURE__*/React__default["default"].createElement(index$1.EmojiListItems, {
        parentRef: parentRef,
        parentContainRef: parentContainRef,
        closeDropdown: closeDropdown,
        spaceFromTrigger: spaceFromTrigger
      }, emojiAllList.map(function (emoji) {
        var reactedReaction = message.reactions.filter(function (reaction) {
          return reaction.key === emoji.key;
        })[0];
        var isReacted = reactedReaction ? !(reactedReaction.userIds.indexOf(userId) < 0) : false;
        return /*#__PURE__*/React__default["default"].createElement(Channel.ReactionButton, {
          key: emoji.key,
          width: "36px",
          height: "36px",
          selected: isReacted,
          onClick: function onClick() {
            closeDropdown();
            toggleReaction(message, emoji.key, isReacted);
          }
        }, /*#__PURE__*/React__default["default"].createElement(index$2.ImageRenderer, {
          url: emoji.url,
          width: "28px",
          height: "28px",
          defaultComponent: /*#__PURE__*/React__default["default"].createElement(index$2.Icon, {
            width: "28px",
            height: "28px",
            type: index$2.IconTypes.QUESTION
          })
        }));
      }));
    };
  }, [emojiContainer, toggleReaction]);
}

function useToggleReactionCallback(_ref, _ref2) {
  var currentGroupChannel = _ref.currentGroupChannel;
  var logger = _ref2.logger;
  return React.useCallback(function (message, key, isReacted) {
    if (isReacted) {
      currentGroupChannel.deleteReaction(message, key).then(function (res) {
        logger.info('Delete reaction success', res);
      }).catch(function (err) {
        logger.warning('Delete reaction failed', err);
      });
      return;
    }

    currentGroupChannel.addReaction(message, key).then(function (res) {
      logger.info('Add reaction success', res);
    }).catch(function (err) {
      logger.warning('Add reaction failed', err);
    });
  }, [currentGroupChannel]);
}

function useScrollToMessage(_a, _b) {
  var setIntialTimeStamp = _a.setIntialTimeStamp,
      setHighLightedMessageId = _a.setHighLightedMessageId,
      allMessages = _a.allMessages;
  var logger = _b.logger;
  return React.useCallback(function (createdAt, messageId) {
    var isPresent = allMessages.find(function (m) {
      return m.messageId === messageId;
    });
    setHighLightedMessageId(null);
    setTimeout(function () {
      if (isPresent) {
        logger.info('Channel: scroll to message - message is present');
        setHighLightedMessageId(messageId);
      } else {
        logger.info('Channel: scroll to message - fetching older messages');
        setIntialTimeStamp(null);
        setIntialTimeStamp(createdAt);
        setHighLightedMessageId(messageId);
      }
    });
  }, [setIntialTimeStamp, setHighLightedMessageId, allMessages]);
}

// import IconAttach from '../../svgs/icon-attach.svg';

var LINE_HEIGHT = 36;

var noop$1 = function noop() {};

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
    className: [isEdit ? 'sendbird-message-input__edit' : '', disabled ? 'sendbird-message-input-form__disabled ' : ''].join(' sendbird-message-input__container ')
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
  }), !inputValue && /*#__PURE__*/React__default["default"].createElement(index$2.Label, {
    className: "sendbird-message-input--placeholder",
    type: index$2.LabelTypography.BODY_1,
    color: index$2.LabelColors.ONBACKGROUND_3
  }, placeholder || stringSet.CHANNEL__MESSAGE_INPUT__PLACE_HOLDER), !isEdit && /*#__PURE__*/React__default["default"].createElement(index$1.IconButton, {
    className: "sendbird-message-input--attach",
    height: "32px",
    width: "32px",
    onClick: function onClick() {
      // todo: clear previous input
      fileInputRef.current.click();
    }
  }, /*#__PURE__*/React__default["default"].createElement(index$2.Icon, {
    type: index$2.IconTypes.ATTACH,
    fillColor: index$2.IconColors.CONTENT_INVERSE,
    width: "20px",
    height: "20px"
  }), /*#__PURE__*/React__default["default"].createElement("input", {
    className: "sendbird-message-input--attach-input",
    type: "file",
    ref: fileInputRef,
    onChange: handleUploadFile(onFileUpload)
  })), !isEdit && /*#__PURE__*/React__default["default"].createElement(index$1.IconButton, {
    className: "sendbird-message-input--send",
    height: "36px",
    width: "36px",
    onClick: sendMessage
  }, /*#__PURE__*/React__default["default"].createElement(index$2.Icon, {
    type: index$2.IconTypes.SEND,
    fillColor: index$2.IconColors.WHITE,
    width: "20px",
    height: "20px"
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
  onSendMessage: noop$1,
  name: 'sendbird-message-input',
  isEdit: false,
  disabled: false,
  placeholder: '',
  maxLength: 5000,
  onFileUpload: noop$1,
  onCancelEdit: noop$1,
  onStartTyping: noop$1
};

var RemoveMessage = function RemoveMessage(props) {
  var onCloseModal = props.onCloseModal,
      onDeleteMessage = props.onDeleteMessage;

  var _useContext = React.useContext(LocalizationContext.LocalizationContext),
      stringSet = _useContext.stringSet;

  return /*#__PURE__*/React__default["default"].createElement(index$1.Modal, {
    onCancel: onCloseModal,
    onSubmit: onDeleteMessage,
    submitText: "Delete",
    titleText: stringSet.MODAL__DELETE_MESSAGE__TITLE
  });
};

RemoveMessage.propTypes = {
  onCloseModal: PropTypes__default["default"].func.isRequired,
  onDeleteMessage: PropTypes__default["default"].func.isRequired
};

function MessageHoc(_ref) {
  var message = _ref.message,
      userId = _ref.userId,
      disabled = _ref.disabled,
      editDisabled = _ref.editDisabled,
      hasSeparator = _ref.hasSeparator,
      deleteMessage = _ref.deleteMessage,
      updateMessage = _ref.updateMessage,
      scrollToMessage = _ref.scrollToMessage,
      resendMessage = _ref.resendMessage,
      useReaction = _ref.useReaction,
      chainTop = _ref.chainTop,
      chainBottom = _ref.chainBottom,
      membersMap = _ref.membersMap,
      emojiContainer = _ref.emojiContainer,
      highLightedMessageId = _ref.highLightedMessageId,
      toggleReaction = _ref.toggleReaction,
      renderCustomMessage = _ref.renderCustomMessage,
      currentGroupChannel = _ref.currentGroupChannel;
  var _message$sender = message.sender,
      sender = _message$sender === void 0 ? {} : _message$sender;

  var _useState = React.useState(false),
      _useState2 = LocalizationContext._slicedToArray(_useState, 2),
      showEdit = _useState2[0],
      setShowEdit = _useState2[1];

  var _useState3 = React.useState(false),
      _useState4 = LocalizationContext._slicedToArray(_useState3, 2),
      showRemove = _useState4[0],
      setShowRemove = _useState4[1];

  var _useState5 = React.useState(false),
      _useState6 = LocalizationContext._slicedToArray(_useState5, 2),
      showFileViewer = _useState6[0],
      setShowFileViewer = _useState6[1];

  var _useState7 = React.useState(false),
      _useState8 = LocalizationContext._slicedToArray(_useState7, 2),
      isAnimated = _useState8[0],
      setIsAnimated = _useState8[1];

  var editMessageInputRef = React.useRef(null);
  var useMessageScrollRef = React.useRef(null);
  React.useLayoutEffect(function () {
    if (highLightedMessageId === message.messageId) {
      if (useMessageScrollRef && useMessageScrollRef.current) {
        useMessageScrollRef.current.scrollIntoView({
          block: 'center',
          inline: 'center'
        });
        setTimeout(function () {
          setIsAnimated(true);
        }, 500);
      }
    } else {
      setIsAnimated(false);
    }
  }, [highLightedMessageId, useMessageScrollRef.current, message.messageId]);
  var RenderedMessage = React.useMemo(function () {
    if (renderCustomMessage) {
      return renderCustomMessage(message, currentGroupChannel, chainTop, chainBottom); // TODO: Let's change this to object type on next major version up
      // and add params 'hasSeparator' and 'menuDisabled', scrollToMessage
    }

    return null;
  }, [message, message.message, renderCustomMessage]);
  var isByMe = userId === sender.userId || message.requestState === 'pending' || message.requestState === 'failed';

  if (RenderedMessage) {
    return /*#__PURE__*/React__default["default"].createElement("div", {
      ref: useMessageScrollRef,
      className: "\n          sendbird-msg-hoc sendbird-msg--scroll-ref\n          ".concat(isAnimated ? 'sendbird-msg-hoc__animated' : '', "\n        ")
    }, hasSeparator && /*#__PURE__*/React__default["default"].createElement(index$3.DateSeparator, null, /*#__PURE__*/React__default["default"].createElement(index$2.Label, {
      type: index$2.LabelTypography.CAPTION_2,
      color: index$2.LabelColors.ONBACKGROUND_2
    }, index$2.format(message.createdAt, 'MMMM dd, yyyy'))), /*#__PURE__*/React__default["default"].createElement(RenderedMessage, {
      message: message
    }));
  }

  if (showEdit) {
    return /*#__PURE__*/React__default["default"].createElement(MessageInput, {
      isEdit: true,
      disabled: editDisabled,
      ref: editMessageInputRef,
      name: message.messageId,
      onSendMessage: updateMessage,
      onCancelEdit: function onCancelEdit() {
        setShowEdit(false);
      },
      value: message.message
    });
  }

  return /*#__PURE__*/React__default["default"].createElement("div", {
    ref: useMessageScrollRef,
    className: "\n        sendbird-msg-hoc sendbird-msg--scroll-ref\n        ".concat(isAnimated ? 'sendbird-msg-hoc__animated' : '', "\n      "),
    style: {
      marginBottom: '2px'
    }
  }, hasSeparator && /*#__PURE__*/React__default["default"].createElement(index$3.DateSeparator, null, /*#__PURE__*/React__default["default"].createElement(index$2.Label, {
    type: index$2.LabelTypography.CAPTION_2,
    color: index$2.LabelColors.ONBACKGROUND_2
  }, index$2.format(message.createdAt, 'MMMM dd, yyyy'))), /*#__PURE__*/React__default["default"].createElement(Channel.MessageContent, {
    className: "sendbird-message-hoc__message-content",
    userId: userId,
    scrollToMessage: scrollToMessage,
    channel: currentGroupChannel,
    message: message,
    disabled: disabled,
    chainTop: chainTop,
    chainBottom: chainBottom,
    useReaction: useReaction // useReplying={} TODO: Set useReplying
    ,
    nicknamesMap: membersMap,
    emojiContainer: emojiContainer,
    showEdit: setShowEdit,
    showRemove: setShowRemove,
    showFileViewer: setShowFileViewer,
    resendMessage: resendMessage,
    toggleReaction: toggleReaction
  }), showRemove && /*#__PURE__*/React__default["default"].createElement(RemoveMessage, {
    onCloseModal: function onCloseModal() {
      return setShowRemove(false);
    },
    onDeleteMessage: function onDeleteMessage() {
      deleteMessage(message);
    }
  }), showFileViewer && /*#__PURE__*/React__default["default"].createElement(index$3.FileViewer, {
    onClose: function onClose() {
      return setShowFileViewer(false);
    },
    message: message,
    onDelete: function onDelete() {
      deleteMessage(message, function () {
        setShowFileViewer(false);
      });
    },
    isByMe: isByMe
  }));
}
MessageHoc.propTypes = {
  userId: PropTypes__default["default"].string,
  message: PropTypes__default["default"].shape({
    isFileMessage: PropTypes__default["default"].func,
    isAdminMessage: PropTypes__default["default"].func,
    isUserMessage: PropTypes__default["default"].func,
    isDateseparator: PropTypes__default["default"].func,
    // should be a number, but there's a bug in SDK shich returns string
    messageId: PropTypes__default["default"].number,
    type: PropTypes__default["default"].string,
    createdAt: PropTypes__default["default"].number,
    message: PropTypes__default["default"].string,
    requestState: PropTypes__default["default"].string,
    messageType: PropTypes__default["default"].string,
    sender: PropTypes__default["default"].shape({
      userId: PropTypes__default["default"].string
    }),
    ogMetaData: PropTypes__default["default"].shape({})
  }),
  highLightedMessageId: PropTypes__default["default"].oneOfType([PropTypes__default["default"].string, PropTypes__default["default"].number]),
  renderCustomMessage: PropTypes__default["default"].func,
  currentGroupChannel: PropTypes__default["default"].shape({}),
  hasSeparator: PropTypes__default["default"].bool,
  disabled: PropTypes__default["default"].bool,
  editDisabled: PropTypes__default["default"].bool,
  deleteMessage: PropTypes__default["default"].func.isRequired,
  scrollToMessage: PropTypes__default["default"].func,
  updateMessage: PropTypes__default["default"].func.isRequired,
  resendMessage: PropTypes__default["default"].func.isRequired,
  useReaction: PropTypes__default["default"].bool.isRequired,
  chainTop: PropTypes__default["default"].bool.isRequired,
  chainBottom: PropTypes__default["default"].bool.isRequired,
  membersMap: PropTypes__default["default"].instanceOf(Map).isRequired,
  emojiContainer: PropTypes__default["default"].shape({
    emojiCategories: PropTypes__default["default"].arrayOf(PropTypes__default["default"].shape({
      emojis: PropTypes__default["default"].arrayOf(PropTypes__default["default"].shape({
        key: PropTypes__default["default"].string,
        url: PropTypes__default["default"].string
      }))
    }))
  }),
  toggleReaction: PropTypes__default["default"].func
};
MessageHoc.defaultProps = {
  userId: '',
  editDisabled: false,
  renderCustomMessage: null,
  currentGroupChannel: {},
  message: {},
  hasSeparator: false,
  disabled: false,
  highLightedMessageId: null,
  toggleReaction: function toggleReaction() {},
  scrollToMessage: function scrollToMessage() {},
  emojiContainer: {}
};

var ConversationScroll = /*#__PURE__*/function (_Component) {
  LocalizationContext._inherits(ConversationScroll, _Component);

  var _super = LocalizationContext._createSuper(ConversationScroll);

  function ConversationScroll() {
    var _this;

    LocalizationContext._classCallCheck(this, ConversationScroll);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    LocalizationContext._defineProperty(LocalizationContext._assertThisInitialized(_this), "onScroll", function (e) {
      var _this$props = _this.props,
          scrollRef = _this$props.scrollRef,
          hasMore = _this$props.hasMore,
          messagesDispatcher = _this$props.messagesDispatcher,
          onScroll = _this$props.onScroll,
          onScrollDown = _this$props.onScrollDown,
          currentGroupChannel = _this$props.currentGroupChannel;
      var element = e.target;
      var scrollTop = element.scrollTop,
          clientHeight = element.clientHeight,
          scrollHeight = element.scrollHeight;

      if (scrollTop === 0) {
        if (!hasMore) {
          return;
        }

        var nodes = scrollRef.current.querySelectorAll('.sendbird-msg--scroll-ref');
        var first = nodes && nodes[0];
        onScroll(function (_ref) {
          var _ref2 = LocalizationContext._slicedToArray(_ref, 1),
              messages = _ref2[0];

          if (messages) {
            // https://github.com/scabbiaza/react-scroll-position-on-updating-dom
            try {
              first.scrollIntoView();
            } catch (error) {//
            }
          }
        });
      }

      if (clientHeight + scrollTop === scrollHeight) {
        var _nodes = scrollRef.current.querySelectorAll('.sendbird-msg--scroll-ref');

        var last = _nodes && _nodes[_nodes.length - 1];
        onScrollDown(function (_ref3) {
          var _ref4 = LocalizationContext._slicedToArray(_ref3, 1),
              messages = _ref4[0];

          if (messages) {
            // https://github.com/scabbiaza/react-scroll-position-on-updating-dom
            try {
              last.scrollIntoView();
            } catch (error) {//
            }
          }
        });
      } // do this later


      setTimeout(function () {
        // mark as read if scroll is at end
        if (clientHeight + scrollTop === scrollHeight) {
          messagesDispatcher({
            type: MARK_AS_READ
          });
          currentGroupChannel.markAsRead();
        }
      }, 500);
    });

    return _this;
  }

  LocalizationContext._createClass(ConversationScroll, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          userId = _this$props2.userId,
          disabled = _this$props2.disabled,
          scrollRef = _this$props2.scrollRef,
          membersMap = _this$props2.membersMap,
          allMessages = _this$props2.allMessages,
          scrollToMessage = _this$props2.scrollToMessage,
          useReaction = _this$props2.useReaction,
          emojiAllMap = _this$props2.emojiAllMap,
          editDisabled = _this$props2.editDisabled,
          deleteMessage = _this$props2.deleteMessage,
          updateMessage = _this$props2.updateMessage,
          resendMessage = _this$props2.resendMessage,
          renderCustomMessage = _this$props2.renderCustomMessage,
          renderChatItem = _this$props2.renderChatItem,
          highLightedMessageId = _this$props2.highLightedMessageId,
          emojiContainer = _this$props2.emojiContainer,
          toggleReaction = _this$props2.toggleReaction,
          useMessageGrouping = _this$props2.useMessageGrouping,
          currentGroupChannel = _this$props2.currentGroupChannel,
          memoizedEmojiListItems = _this$props2.memoizedEmojiListItems,
          showScrollBot = _this$props2.showScrollBot,
          onClickScrollBot = _this$props2.onClickScrollBot;

      if (allMessages.length < 1) {
        return /*#__PURE__*/React__default["default"].createElement(index$2.PlaceHolder, {
          className: "sendbird-conversation__no-messages",
          type: index$2.PlaceHolderTypes.NO_MESSAGES
        });
      }

      return /*#__PURE__*/React__default["default"].createElement("div", {
        className: "sendbird-conversation__messages"
      }, /*#__PURE__*/React__default["default"].createElement("div", {
        ref: scrollRef,
        className: "sendbird-conversation__scroll-container",
        onScroll: this.onScroll
      }, /*#__PURE__*/React__default["default"].createElement("div", {
        className: "sendbird-conversation__padding"
      }), /*#__PURE__*/React__default["default"].createElement("div", {
        className: "sendbird-conversation__messages-padding"
      }, allMessages.map(function (m, idx) {
        var previousMessage = allMessages[idx - 1];
        var nextMessage = allMessages[idx + 1];

        var _ref5 = useMessageGrouping ? compareMessagesForGrouping(previousMessage, m, nextMessage) : [false, false],
            _ref6 = LocalizationContext._slicedToArray(_ref5, 2),
            chainTop = _ref6[0],
            chainBottom = _ref6[1];

        var previousMessageCreatedAt = previousMessage && previousMessage.createdAt;
        var currentCreatedAt = m.createdAt; // https://stackoverflow.com/a/41855608

        var hasSeparator = !(previousMessageCreatedAt && index$4.isSameDay(currentCreatedAt, previousMessageCreatedAt));

        if (renderChatItem) {
          return /*#__PURE__*/React__default["default"].createElement("div", {
            key: m.messageId || m.reqId,
            className: "sendbird-msg--scroll-ref"
          }, renderChatItem({
            message: m,
            highLightedMessageId: highLightedMessageId,
            channel: currentGroupChannel,
            onDeleteMessage: deleteMessage,
            onUpdateMessage: updateMessage,
            onResendMessage: resendMessage,
            onScrollToMessage: scrollToMessage,
            emojiContainer: emojiContainer,
            chainTop: chainTop,
            chainBottom: chainBottom,
            hasSeparator: hasSeparator,
            menuDisabled: disabled
          }));
        }

        return /*#__PURE__*/React__default["default"].createElement(MessageHoc, {
          highLightedMessageId: highLightedMessageId,
          renderCustomMessage: renderCustomMessage,
          key: m.messageId || m.reqId,
          userId: userId // show status for pending/failed messages
          ,
          message: m,
          scrollToMessage: scrollToMessage,
          currentGroupChannel: currentGroupChannel,
          disabled: disabled,
          membersMap: membersMap,
          chainTop: chainTop,
          useReaction: useReaction,
          emojiAllMap: emojiAllMap,
          emojiContainer: emojiContainer,
          editDisabled: editDisabled,
          hasSeparator: hasSeparator,
          chainBottom: chainBottom,
          updateMessage: updateMessage,
          deleteMessage: deleteMessage,
          resendMessage: resendMessage,
          toggleReaction: toggleReaction,
          memoizedEmojiListItems: memoizedEmojiListItems
        });
      }))), showScrollBot && /*#__PURE__*/React__default["default"].createElement("div", {
        className: "sendbird-conversation__scroll-bottom-button",
        onClick: onClickScrollBot,
        onKeyDown: onClickScrollBot,
        tabIndex: 0,
        role: "button"
      }, /*#__PURE__*/React__default["default"].createElement(index$2.Icon, {
        width: "24px",
        height: "24px",
        type: index$2.IconTypes.CHEVRON_DOWN,
        fillColor: index$2.IconColors.PRIMARY
      })));
    }
  }]);

  return ConversationScroll;
}(React.Component);
ConversationScroll.propTypes = {
  // https://stackoverflow.com/a/52646941
  scrollRef: PropTypes__default["default"].shape({
    current: PropTypes__default["default"].oneOfType([PropTypes__default["default"].element, PropTypes__default["default"].shape({})])
  }).isRequired,
  hasMore: PropTypes__default["default"].bool,
  messagesDispatcher: PropTypes__default["default"].func.isRequired,
  onScroll: PropTypes__default["default"].func,
  onScrollDown: PropTypes__default["default"].func,
  editDisabled: PropTypes__default["default"].bool,
  disabled: PropTypes__default["default"].bool,
  userId: PropTypes__default["default"].string,
  allMessages: PropTypes__default["default"].arrayOf(PropTypes__default["default"].shape({
    createdAt: PropTypes__default["default"].number
  })).isRequired,
  deleteMessage: PropTypes__default["default"].func.isRequired,
  resendMessage: PropTypes__default["default"].func.isRequired,
  updateMessage: PropTypes__default["default"].func.isRequired,
  readStatus: PropTypes__default["default"].shape({}).isRequired,
  currentGroupChannel: PropTypes__default["default"].shape({
    markAsRead: PropTypes__default["default"].func,
    members: PropTypes__default["default"].arrayOf(PropTypes__default["default"].shape({}))
  }).isRequired,
  highLightedMessageId: PropTypes__default["default"].oneOfType([PropTypes__default["default"].string, PropTypes__default["default"].number]),
  renderChatItem: PropTypes__default["default"].element,
  renderCustomMessage: PropTypes__default["default"].func,
  scrollToMessage: PropTypes__default["default"].func,
  useReaction: PropTypes__default["default"].bool,
  showScrollBot: PropTypes__default["default"].bool,
  onClickScrollBot: PropTypes__default["default"].func,
  emojiContainer: PropTypes__default["default"].shape({}),
  emojiAllMap: PropTypes__default["default"].instanceOf(Map),
  membersMap: PropTypes__default["default"].instanceOf(Map),
  useMessageGrouping: PropTypes__default["default"].bool,
  toggleReaction: PropTypes__default["default"].func,
  memoizedEmojiListItems: PropTypes__default["default"].func
};
ConversationScroll.defaultProps = {
  hasMore: false,
  editDisabled: false,
  disabled: false,
  userId: '',
  renderCustomMessage: null,
  renderChatItem: null,
  highLightedMessageId: null,
  onScroll: null,
  onScrollDown: null,
  useReaction: true,
  emojiContainer: {},
  showScrollBot: false,
  onClickScrollBot: function onClickScrollBot() {},
  scrollToMessage: function scrollToMessage() {},
  emojiAllMap: new Map(),
  membersMap: new Map(),
  useMessageGrouping: true,
  toggleReaction: function toggleReaction() {},
  memoizedEmojiListItems: function memoizedEmojiListItems() {
    return '';
  }
};

function Notification(_ref) {
  var count = _ref.count,
      time = _ref.time,
      onClick = _ref.onClick;

  var _useContext = React.useContext(LocalizationContext.LocalizationContext),
      stringSet = _useContext.stringSet;

  var timeArray = time.split(' ');
  timeArray.splice(-2, 0, stringSet.CHANNEL__MESSAGE_LIST__NOTIFICATION__ON);
  return (
    /*#__PURE__*/
    // eslint-disable-next-line
    React__default["default"].createElement("div", {
      className: "sendbird-notification",
      onClick: onClick
    }, /*#__PURE__*/React__default["default"].createElement(index$2.Label, {
      className: "sendbird-notification__text",
      color: index$2.LabelColors.ONCONTENT_1,
      type: index$2.LabelTypography.CAPTION_2
    }, "".concat(count, " "), stringSet.CHANNEL__MESSAGE_LIST__NOTIFICATION__NEW_MESSAGE, " ".concat(timeArray.join(' '))), /*#__PURE__*/React__default["default"].createElement(index$2.Icon, {
      width: "24px",
      height: "24px",
      type: index$2.IconTypes.CHEVRON_DOWN,
      fillColor: index$2.IconColors.CONTENT
    }))
  );
}
Notification.propTypes = {
  count: PropTypes__default["default"].oneOfType([PropTypes__default["default"].string, PropTypes__default["default"].number]),
  time: PropTypes__default["default"].string,
  onClick: PropTypes__default["default"].func.isRequired
};
Notification.defaultProps = {
  count: 0,
  time: ''
};

var FrozenNotification = function FrozenNotification() {
  var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-notification sendbird-notification--frozen"
  }, /*#__PURE__*/React__default["default"].createElement(index$2.Label, {
    className: "sendbird-notification__text",
    type: index$2.LabelTypography.CAPTION_2
  }, stringSet.CHANNEL_FROZEN));
};

var TypingIndicatorText = function TypingIndicatorText(_ref) {
  var members = _ref.members;

  var _useContext = React.useContext(LocalizationContext.LocalizationContext),
      stringSet = _useContext.stringSet;

  if (!members || members.length === 0) {
    return '';
  }

  if (members && members.length === 1) {
    return "".concat(members[0].nickname, " ").concat(stringSet.TYPING_INDICATOR__IS_TYPING);
  }

  if (members && members.length === 2) {
    return "".concat(members[0].nickname, " ").concat(stringSet.TYPING_INDICATOR__AND, " ").concat(members[1].nickname, " ").concat(stringSet.TYPING_INDICATOR__ARE_TYPING);
  }

  return stringSet.TYPING_INDICATOR__MULTIPLE_TYPING;
};

function TypingIndicator(_ref2) {
  var channelUrl = _ref2.channelUrl,
      sb = _ref2.sb,
      logger = _ref2.logger;

  var _useState = React.useState(LocalizationContext.uuidv4()),
      _useState2 = LocalizationContext._slicedToArray(_useState, 2),
      handlerId = _useState2[0],
      setHandlerId = _useState2[1];

  var _useState3 = React.useState([]),
      _useState4 = LocalizationContext._slicedToArray(_useState3, 2),
      typingMembers = _useState4[0],
      setTypingMembers = _useState4[1];

  React.useEffect(function () {
    if (sb && sb.ChannelHandler) {
      sb.removeChannelHandler(handlerId);
      var newHandlerId = LocalizationContext.uuidv4();
      var handler = new sb.ChannelHandler(); // there is a possible warning in here - setState called after unmount

      handler.onTypingStatusUpdated = function (groupChannel) {
        logger.info('Channel > Typing Indicator: onTypingStatusUpdated', groupChannel);
        var members = groupChannel.getTypingMembers();

        if (groupChannel.url === channelUrl) {
          setTypingMembers(members);
        }
      };

      sb.addChannelHandler(newHandlerId, handler);
      setHandlerId(newHandlerId);
    }

    return function () {
      setTypingMembers([]);

      if (sb && sb.removeChannelHandler) {
        sb.removeChannelHandler(handlerId);
      }
    };
  }, [channelUrl]);
  return /*#__PURE__*/React__default["default"].createElement(index$2.Label, {
    type: index$2.LabelTypography.CAPTION_2,
    color: index$2.LabelColors.ONBACKGROUND_2
  }, /*#__PURE__*/React__default["default"].createElement(TypingIndicatorText, {
    members: typingMembers
  }));
}

TypingIndicator.propTypes = {
  channelUrl: PropTypes__default["default"].string.isRequired,
  sb: PropTypes__default["default"].shape({
    ChannelHandler: PropTypes__default["default"].func,
    removeChannelHandler: PropTypes__default["default"].func,
    addChannelHandler: PropTypes__default["default"].func
  }).isRequired,
  logger: PropTypes__default["default"].shape({
    info: PropTypes__default["default"].func
  }).isRequired
};

// Logic required to handle message input rendering

var MessageInputWrapper = function MessageInputWrapper(_a, ref) {
  var channel = _a.channel,
      user = _a.user,
      onSendMessage = _a.onSendMessage,
      onFileUpload = _a.onFileUpload,
      renderMessageInput = _a.renderMessageInput,
      isOnline = _a.isOnline,
      initialized = _a.initialized;
  var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
  var disabled = !initialized || isDisabledBecauseFrozen(channel) || isDisabledBecauseMuted(channel) || !isOnline;
  var isOperator$1 = isOperator(channel);
  var isBroadcast = channel.isBroadcast; // custom message

  if (renderMessageInput) {
    return renderMessageInput({
      channel: channel,
      user: user,
      disabled: disabled
    });
  } // broadcast channel + not operator


  if (isBroadcast && !isOperator$1) {
    return null;
  } // other conditions


  return /*#__PURE__*/React__default["default"].createElement(MessageInput, {
    placeholder: isDisabledBecauseFrozen(channel) && stringSet.CHANNEL__MESSAGE_INPUT__PLACE_HOLDER__DISABLED || isDisabledBecauseMuted(channel) && stringSet.CHANNEL__MESSAGE_INPUT__PLACE_HOLDER__MUTED,
    ref: ref,
    disabled: disabled,
    onStartTyping: function onStartTyping() {
      channel.startTyping();
    },
    onSendMessage: onSendMessage,
    onFileUpload: onFileUpload
  });
};

var MessageInputWrapper$1 = /*#__PURE__*/React__default["default"].forwardRef(MessageInputWrapper);

var noop = function noop() {};

var ConversationPanel = function ConversationPanel(props) {
  var channelUrl = props.channelUrl,
      _props$stores = props.stores,
      sdkStore = _props$stores.sdkStore,
      userStore = _props$stores.userStore,
      _props$config = props.config,
      userId = _props$config.userId,
      logger = _props$config.logger,
      pubSub = _props$config.pubSub,
      isOnline = _props$config.isOnline,
      theme = _props$config.theme,
      imageCompression = _props$config.imageCompression,
      reconnect = props.dispatchers.reconnect,
      _props$queries = props.queries,
      queries = _props$queries === void 0 ? {} : _props$queries,
      startingPoint = props.startingPoint,
      highlightedMessage = props.highlightedMessage,
      useReaction = props.useReaction,
      showSearchIcon = props.showSearchIcon,
      onSearchClick = props.onSearchClick,
      renderChatItem = props.renderChatItem,
      renderChatHeader = props.renderChatHeader,
      renderCustomMessage = props.renderCustomMessage,
      renderUserProfile = props.renderUserProfile,
      disableUserProfile = props.disableUserProfile,
      renderMessageInput = props.renderMessageInput,
      useMessageGrouping = props.useMessageGrouping,
      onChatHeaderActionClick = props.onChatHeaderActionClick,
      onBeforeSendUserMessage = props.onBeforeSendUserMessage,
      onBeforeSendFileMessage = props.onBeforeSendFileMessage,
      onBeforeUpdateUserMessage = props.onBeforeUpdateUserMessage;
  var sdk = sdkStore.sdk;
  var config = props.config;
  var sdkError = sdkStore.error;
  var sdkInit = sdkStore.initialized;
  var user = userStore.user;

  if (queries.messageListQuery) {
    // eslint-disable-next-line no-console
    console.warn('messageListQuery has been deprecated, please use messageListParams instead');
  }

  var _useState = React.useState(startingPoint),
      _useState2 = LocalizationContext._slicedToArray(_useState, 2),
      intialTimeStamp = _useState2[0],
      setIntialTimeStamp = _useState2[1];

  React.useEffect(function () {
    setIntialTimeStamp(startingPoint);
  }, [startingPoint, channelUrl]);

  var _useState3 = React.useState(highlightedMessage),
      _useState4 = LocalizationContext._slicedToArray(_useState3, 2),
      highLightedMessageId = _useState4[0],
      setHighLightedMessageId = _useState4[1];

  React.useEffect(function () {
    setHighLightedMessageId(highlightedMessage);
  }, [highlightedMessage]);
  var userFilledMessageListQuery = queries.messageListParams;

  var _useReducer = React.useReducer(reducer, messagesInitialState),
      _useReducer2 = LocalizationContext._slicedToArray(_useReducer, 2),
      messagesStore = _useReducer2[0],
      messagesDispatcher = _useReducer2[1];

  var scrollRef = React.useRef(null);
  var allMessages = messagesStore.allMessages,
      loading = messagesStore.loading,
      initialized = messagesStore.initialized,
      unreadCount = messagesStore.unreadCount,
      unreadSince = messagesStore.unreadSince,
      isInvalid = messagesStore.isInvalid,
      _messagesStore$curren = messagesStore.currentGroupChannel,
      currentGroupChannel = _messagesStore$curren === void 0 ? {} : _messagesStore$curren,
      hasMore = messagesStore.hasMore,
      lastMessageTimeStamp = messagesStore.lastMessageTimeStamp,
      hasMoreToBottom = messagesStore.hasMoreToBottom,
      latestFetchedMessageTimeStamp = messagesStore.latestFetchedMessageTimeStamp,
      emojiContainer = messagesStore.emojiContainer,
      readStatus = messagesStore.readStatus;
  var isFrozen = currentGroupChannel.isFrozen,
      isBroadcast = currentGroupChannel.isBroadcast,
      isSuper = currentGroupChannel.isSuper;
  var _sdk$appInfo = sdk.appInfo,
      appInfo = _sdk$appInfo === void 0 ? {} : _sdk$appInfo;
  var usingReaction = appInfo.isUsingReaction && !isBroadcast && !isSuper && useReaction;
  var userDefinedDisableUserProfile = disableUserProfile || config.disableUserProfile;
  var userDefinedRenderProfile = renderUserProfile || config.renderUserProfile;
  var showScrollBot = hasMoreToBottom; // TODO: emojiAllMap, emoijAllList, nicknamesMap => should be moved to messagesStore

  var emojiAllMap = React.useMemo(function () {
    return usingReaction ? getAllEmojisMapFromEmojiContainer(emojiContainer) : new Map();
  }, [emojiContainer]);
  var emojiAllList = React.useMemo(function () {
    return usingReaction ? getAllEmojisFromEmojiContainer(emojiContainer) : [];
  }, [emojiContainer]);
  var nicknamesMap = React.useMemo(function () {
    return usingReaction ? getNicknamesMapFromMembers(currentGroupChannel.members) : new Map();
  }, [currentGroupChannel.members]); // Scrollup is default scroll for channel

  var onScrollCallback = useScrollCallback({
    currentGroupChannel: currentGroupChannel,
    lastMessageTimeStamp: lastMessageTimeStamp,
    userFilledMessageListQuery: userFilledMessageListQuery
  }, {
    hasMore: hasMore,
    logger: logger,
    messagesDispatcher: messagesDispatcher,
    sdk: sdk
  });
  var scrollToMessage = useScrollToMessage({
    setIntialTimeStamp: setIntialTimeStamp,
    setHighLightedMessageId: setHighLightedMessageId,
    allMessages: allMessages
  }, {
    logger: logger
  }); // onScrollDownCallback is added for navigation to different timestamps on messageSearch
  // hasMoreToBottom, onScrollDownCallback -> scroll down
  // hasMore, onScrollCallback -> scroll up(default behavior)

  var onScrollDownCallback = useScrollDownCallback({
    currentGroupChannel: currentGroupChannel,
    latestFetchedMessageTimeStamp: latestFetchedMessageTimeStamp,
    userFilledMessageListQuery: userFilledMessageListQuery,
    hasMoreToBottom: hasMoreToBottom
  }, {
    logger: logger,
    messagesDispatcher: messagesDispatcher,
    sdk: sdk
  });
  var toggleReaction = useToggleReactionCallback({
    currentGroupChannel: currentGroupChannel
  }, {
    logger: logger
  });
  var memoizedEmojiListItems = useMemoizedEmojiListItems({
    emojiContainer: emojiContainer,
    toggleReaction: toggleReaction
  }, {
    useReaction: usingReaction,
    logger: logger,
    userId: userId,
    emojiAllList: emojiAllList
  }); // to create message-datasource
  // this hook sets currentGroupChannel asynchronously

  useSetChannel({
    channelUrl: channelUrl,
    sdkInit: sdkInit
  }, {
    messagesDispatcher: messagesDispatcher,
    sdk: sdk,
    logger: logger
  }); // Hook to handle ChannelEvents and send values to useReducer using messagesDispatcher

  useHandleChannelEvents({
    currentGroupChannel: currentGroupChannel,
    sdkInit: sdkInit,
    hasMoreToBottom: hasMoreToBottom
  }, {
    messagesDispatcher: messagesDispatcher,
    sdk: sdk,
    logger: logger,
    scrollRef: scrollRef
  }); // hook that fetches messages when channel changes
  // to be clear here useGetChannel sets currentGroupChannel
  // and useInitialMessagesFetch executes when currentGroupChannel changes
  // p.s This one executes on intialTimeStamp change too

  useInitialMessagesFetch({
    currentGroupChannel: currentGroupChannel,
    userFilledMessageListQuery: userFilledMessageListQuery,
    intialTimeStamp: intialTimeStamp
  }, {
    sdk: sdk,
    logger: logger,
    messagesDispatcher: messagesDispatcher
  }); // handles API calls from withSendbird

  React.useEffect(function () {
    var subScriber = pubSubHandler(channelUrl, pubSub, messagesDispatcher);
    return function () {
      pubSubHandleRemover(subScriber);
    };
  }, [channelUrl, sdkInit]); // handling connection breaks

  useHandleReconnect({
    isOnline: isOnline
  }, {
    logger: logger,
    sdk: sdk,
    currentGroupChannel: currentGroupChannel,
    messagesDispatcher: messagesDispatcher,
    userFilledMessageListQuery: userFilledMessageListQuery
  }); // callbacks for Message CURD actions

  var deleteMessage = useDeleteMessageCallback({
    currentGroupChannel: currentGroupChannel,
    messagesDispatcher: messagesDispatcher
  }, {
    logger: logger
  });
  var updateMessage = useUpdateMessageCallback({
    currentGroupChannel: currentGroupChannel,
    messagesDispatcher: messagesDispatcher,
    onBeforeUpdateUserMessage: onBeforeUpdateUserMessage
  }, {
    logger: logger,
    sdk: sdk,
    pubSub: pubSub
  });
  var resendMessage = useResendMessageCallback({
    currentGroupChannel: currentGroupChannel,
    messagesDispatcher: messagesDispatcher
  }, {
    logger: logger
  });

  var _useSendMessageCallba = useSendMessageCallback({
    currentGroupChannel: currentGroupChannel,
    onBeforeSendUserMessage: onBeforeSendUserMessage
  }, {
    sdk: sdk,
    logger: logger,
    pubSub: pubSub,
    messagesDispatcher: messagesDispatcher
  }),
      _useSendMessageCallba2 = LocalizationContext._slicedToArray(_useSendMessageCallba, 2),
      messageInputRef = _useSendMessageCallba2[0],
      onSendMessage = _useSendMessageCallba2[1];

  var _useSendFileMessageCa = useSendFileMessageCallback({
    currentGroupChannel: currentGroupChannel,
    onBeforeSendFileMessage: onBeforeSendFileMessage,
    imageCompression: imageCompression
  }, {
    sdk: sdk,
    logger: logger,
    pubSub: pubSub,
    messagesDispatcher: messagesDispatcher
  }),
      _useSendFileMessageCa2 = LocalizationContext._slicedToArray(_useSendFileMessageCa, 1),
      onSendFileMessage = _useSendFileMessageCa2[0];

  if (!channelUrl) {
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sendbird-conversation"
    }, /*#__PURE__*/React__default["default"].createElement(index$2.PlaceHolder, {
      type: index$2.PlaceHolderTypes.NO_CHANNELS
    }));
  }

  if (isInvalid) {
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sendbird-conversation"
    }, /*#__PURE__*/React__default["default"].createElement(index$2.PlaceHolder, {
      type: index$2.PlaceHolderTypes.WRONG
    }));
  }

  if (sdkError) {
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: "sendbird-conversation"
    }, /*#__PURE__*/React__default["default"].createElement(index$2.PlaceHolder, {
      type: index$2.PlaceHolderTypes.WRONG,
      retryToConnect: function retryToConnect() {
        logger.info('Channel: reconnecting');
        reconnect();
      }
    }));
  }

  return /*#__PURE__*/React__default["default"].createElement(index$1.UserProfileProvider, {
    className: "sendbird-conversation",
    disableUserProfile: userDefinedDisableUserProfile,
    renderUserProfile: userDefinedRenderProfile
  }, renderChatHeader ? renderChatHeader({
    channel: currentGroupChannel,
    user: user
  }) : /*#__PURE__*/React__default["default"].createElement(Channel.ChatHeader, {
    theme: theme,
    currentGroupChannel: currentGroupChannel,
    currentUser: user,
    showSearchIcon: showSearchIcon,
    onSearchClick: onSearchClick,
    onActionClick: onChatHeaderActionClick,
    subTitle: currentGroupChannel.members && currentGroupChannel.members.length !== 2,
    isMuted: false
  }), isFrozen && /*#__PURE__*/React__default["default"].createElement(FrozenNotification, null), unreadCount > 0 && /*#__PURE__*/React__default["default"].createElement(Notification, {
    count: unreadCount,
    onClick: function onClick() {
      if (intialTimeStamp) {
        setIntialTimeStamp(null);
        setHighLightedMessageId(null);
      } else {
        scrollIntoLast(); // there is no scroll

        if (scrollRef.current.scrollTop === 0) {
          currentGroupChannel.markAsRead();
          messagesDispatcher({
            type: MARK_AS_READ
          });
        }
      }
    },
    time: unreadSince
  }), loading ? /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-conversation"
  }, /*#__PURE__*/React__default["default"].createElement(index$2.PlaceHolder, {
    type: index$2.PlaceHolderTypes.LOADING
  })) : /*#__PURE__*/React__default["default"].createElement(ConversationScroll, {
    swapParams: sdk && sdk.getErrorFirstCallback && sdk.getErrorFirstCallback(),
    highLightedMessageId: highLightedMessageId,
    userId: userId,
    hasMore: hasMore,
    disabled: !isOnline,
    onScroll: onScrollCallback,
    onScrollDown: onScrollDownCallback,
    scrollRef: scrollRef,
    readStatus: readStatus,
    useReaction: usingReaction,
    allMessages: allMessages,
    scrollToMessage: scrollToMessage,
    emojiAllMap: emojiAllMap,
    membersMap: nicknamesMap,
    editDisabled: isDisabledBecauseFrozen(currentGroupChannel),
    deleteMessage: deleteMessage,
    updateMessage: updateMessage,
    resendMessage: resendMessage,
    toggleReaction: toggleReaction,
    emojiContainer: emojiContainer,
    renderChatItem: renderChatItem,
    showScrollBot: showScrollBot,
    onClickScrollBot: function onClickScrollBot() {
      setIntialTimeStamp(null);
      setHighLightedMessageId(null);
    },
    renderCustomMessage: renderCustomMessage,
    useMessageGrouping: useMessageGrouping,
    messagesDispatcher: messagesDispatcher,
    currentGroupChannel: currentGroupChannel,
    memoizedEmojiListItems: memoizedEmojiListItems
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-conversation__footer"
  }, /*#__PURE__*/React__default["default"].createElement(MessageInputWrapper$1, {
    channel: currentGroupChannel,
    user: user,
    ref: messageInputRef,
    onSendMessage: onSendMessage,
    onFileUpload: onSendFileMessage,
    renderMessageInput: renderMessageInput,
    isOnline: isOnline,
    initialized: initialized
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "sendbird-conversation__typing-indicator"
  }, /*#__PURE__*/React__default["default"].createElement(TypingIndicator, {
    channelUrl: channelUrl,
    sb: sdk,
    logger: logger
  })), !isOnline && /*#__PURE__*/React__default["default"].createElement(Channel.ConnectionStatus, {
    sdkInit: sdkInit,
    sb: sdk,
    logger: logger
  })));
};
ConversationPanel.propTypes = {
  channelUrl: PropTypes__default["default"].string,
  stores: PropTypes__default["default"].shape({
    sdkStore: PropTypes__default["default"].shape({
      initialized: PropTypes__default["default"].bool,
      sdk: PropTypes__default["default"].shape({
        getErrorFirstCallback: PropTypes__default["default"].func,
        removeChannelHandler: PropTypes__default["default"].func,
        GroupChannel: PropTypes__default["default"].any,
        ChannelHandler: PropTypes__default["default"].any,
        addChannelHandler: PropTypes__default["default"].func,
        UserMessageParams: PropTypes__default["default"].any,
        FileMessageParams: PropTypes__default["default"].any,
        getAllEmoji: PropTypes__default["default"].func,
        appInfo: PropTypes__default["default"].shape({})
      }),
      error: PropTypes__default["default"].bool
    }),
    userStore: PropTypes__default["default"].shape({
      user: PropTypes__default["default"].shape({})
    })
  }).isRequired,
  dispatchers: PropTypes__default["default"].shape({
    reconnect: PropTypes__default["default"].func
  }).isRequired,
  config: PropTypes__default["default"].shape({
    disableUserProfile: PropTypes__default["default"].bool,
    renderUserProfile: PropTypes__default["default"].func,
    userId: PropTypes__default["default"].string.isRequired,
    isOnline: PropTypes__default["default"].bool.isRequired,
    theme: PropTypes__default["default"].string,
    logger: PropTypes__default["default"].shape({
      info: PropTypes__default["default"].func,
      error: PropTypes__default["default"].func,
      warning: PropTypes__default["default"].func
    }),
    pubSub: PropTypes__default["default"].shape({
      subscribe: PropTypes__default["default"].func,
      publish: PropTypes__default["default"].func
    }),
    imageCompression: PropTypes__default["default"].shape({
      compressionRate: PropTypes__default["default"].number,
      resizingWidth: PropTypes__default["default"].oneOfType([PropTypes__default["default"].number, PropTypes__default["default"].string]),
      resizingHeight: PropTypes__default["default"].oneOfType([PropTypes__default["default"].number, PropTypes__default["default"].string])
    })
  }).isRequired,
  queries: PropTypes__default["default"].shape({
    messageListParams: PropTypes__default["default"].shape({
      includeMetaArray: PropTypes__default["default"].bool,
      includeParentMessageText: PropTypes__default["default"].bool,
      includeReaction: PropTypes__default["default"].bool,
      includeReplies: PropTypes__default["default"].bool,
      includeThreadInfo: PropTypes__default["default"].bool,
      limit: PropTypes__default["default"].number,
      reverse: PropTypes__default["default"].bool,
      senderUserIdsFilter: PropTypes__default["default"].arrayOf(PropTypes__default["default"].string)
    })
  }),
  startingPoint: PropTypes__default["default"].number,
  highlightedMessage: PropTypes__default["default"].oneOfType([PropTypes__default["default"].string, PropTypes__default["default"].number]),
  onBeforeSendUserMessage: PropTypes__default["default"].func,
  // onBeforeSendUserMessage(text)
  onBeforeSendFileMessage: PropTypes__default["default"].func,
  // onBeforeSendFileMessage(File)
  onBeforeUpdateUserMessage: PropTypes__default["default"].func,
  renderChatItem: PropTypes__default["default"].oneOfType([PropTypes__default["default"].element, PropTypes__default["default"].func]),
  renderCustomMessage: PropTypes__default["default"].func,
  renderMessageInput: PropTypes__default["default"].oneOfType([PropTypes__default["default"].element, PropTypes__default["default"].func]),
  renderChatHeader: PropTypes__default["default"].oneOfType([PropTypes__default["default"].element, PropTypes__default["default"].func]),
  showSearchIcon: PropTypes__default["default"].bool,
  onSearchClick: PropTypes__default["default"].func,
  onChatHeaderActionClick: PropTypes__default["default"].func,
  useReaction: PropTypes__default["default"].bool,
  disableUserProfile: PropTypes__default["default"].bool,
  renderUserProfile: PropTypes__default["default"].func,
  useMessageGrouping: PropTypes__default["default"].bool
};
ConversationPanel.defaultProps = {
  channelUrl: null,
  queries: {},
  onBeforeSendUserMessage: null,
  onBeforeSendFileMessage: null,
  onBeforeUpdateUserMessage: null,
  startingPoint: null,
  highlightedMessage: null,
  renderChatItem: null,
  renderCustomMessage: null,
  renderMessageInput: null,
  renderChatHeader: null,
  useReaction: true,
  showSearchIcon: false,
  onSearchClick: noop,
  disableUserProfile: false,
  renderUserProfile: null,
  useMessageGrouping: true,
  onChatHeaderActionClick: noop
};
var index = LocalizationContext.withSendbirdContext(ConversationPanel);

exports.SendBirdProvider = SendbirdProvider;
exports.App = App;
exports.withSendBird = LocalizationContext.withSendbirdContext;
exports.sendBirdSelectors = index$1.selectors;
exports.Channel = index;
exports.useSendbirdStateContext = useSendbirdStateContext;
//# sourceMappingURL=index.js.map
