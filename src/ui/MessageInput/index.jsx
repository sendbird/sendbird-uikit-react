import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import { MessageInputKeys, NodeNames, NodeTypes } from './const';

import { USER_MENTION_TEMP_CHAR } from '../../modules/Channel/context/const';
import IconButton from '../IconButton';
import Button, { ButtonTypes, ButtonSizes } from '../Button';
import renderMentionLabelToString from '../MentionUserLabel/renderToString';
import Icon, { IconTypes, IconColors } from '../Icon';
import Label, { LabelTypography, LabelColors } from '../Label';
import { useLocalization } from '../../lib/LocalizationContext';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';

import { isChannelTypeSupportsMultipleFilesMessage, nodeListToArray, sanitizeString } from './utils';
import {
  arrayEqual,
  getClassName,
  getMimeTypesUIKitAccepts,
} from '../../utils';
import usePaste from './hooks/usePaste';
import { tokenizeMessage } from '../../modules/Message/utils/tokens/tokenize';
import { USER_MENTION_PREFIX } from '../../modules/Message/consts';
import { TOKEN_TYPES } from '../../modules/Message/utils/tokens/types';
import { checkIfFileUploadEnabled } from './messageInputUtils';

const TEXT_FIELD_ID = 'sendbird-message-input-text-field';
const LINE_HEIGHT = 76;
const noop = () => { };

const displayCaret = (element, position) => {
  const range = document.createRange();
  const sel = window.getSelection();
  range.setStart(element.childNodes[0], position);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
  element.focus();
};

const resetInput = (ref) => {
  try {
    /* eslint-disable no-param-reassign */
    ref.current.innerHTML = '';
  } catch {
    //
  }
};

const initialTargetStringInfo = {
  targetString: '',
  startNodeIndex: null,
  startOffsetIndex: null,
  endNodeIndex: null,
  endOffsetIndex: null,
};

const MessageInput = React.forwardRef((props, ref) => {
  const {
    className,
    messageFieldId,
    isEdit,
    isMentionEnabled,
    isVoiceMessageEnabled,
    isSelectingMultipleFilesEnabled,
    disabled,
    message,
    placeholder,
    maxLength,
    onFileUpload,
    onSendMessage,
    onUpdateMessage,
    onCancelEdit,
    onStartTyping,
    channelUrl,
    channel,
    mentionSelectedUser,
    onUserMentioned,
    onMentionStringChange,
    onMentionedUserIdsUpdated,
    onVoiceMessageIconClick,
    onKeyUp,
    onKeyDown,
    renderFileUploadIcon,
    renderVoiceMessageIcon,
    renderSendMessageIcon,
    setMentionedUsers,
    acceptableMimeTypes,
  } = props;
  const textFieldId = messageFieldId || TEXT_FIELD_ID;
  const { stringSet } = useLocalization();
  const { config } = useSendbirdStateContext();

  const isFileUploadEnabled = checkIfFileUploadEnabled({
    channel,
    config,
  });

  const fileInputRef = useRef(null);
  const [isInput, setIsInput] = useState(false);
  const [mentionedUserIds, setMentionedUserIds] = useState([]);
  const [targetStringInfo, setTargetStringInfo] = useState({ ...initialTargetStringInfo });
  const setHeight = useMemo(() => (
    () => {
      try {
        const elem = ref?.current;
        const MAX_HEIGHT = window.document.body.offsetHeight * 0.6;
        if (elem && elem.scrollHeight >= LINE_HEIGHT) {
          if (MAX_HEIGHT < elem.scrollHeight) {
            elem.style.height = 'auto';
            elem.style.height = `${MAX_HEIGHT}px`;
          } else {
            elem.style.height = 'auto';
            elem.style.height = `${elem.scrollHeight}px`;
          }
        } else {
          elem.style.height = '';
        }
      } catch (error) {
        // error
      }
    }
  ), []);

  // #Edit mode
  // for easilly initialize input value from outside, but
  // useEffect(_, [channelUrl]) erase it
  const initialValue = props?.value;
  useEffect(() => {
    const textField = ref?.current;
    try {
      textField.innerHTML = initialValue;
      displayCaret(textField, initialValue?.length);
    } catch {
      //
    }
    setMentionedUserIds([]);
    setIsInput(textField?.textContent?.trim().length > 0);
    setHeight();
  }, [initialValue]);

  // #Mention | Clear input value when channel changes
  useEffect(() => {
    if (!isEdit) {
      setIsInput(false);
      resetInput(ref);
    }
  }, [channelUrl]);

  // #Mention & #Edit | Fill message input values
  useEffect(() => {
    if (isEdit && message?.messageId) {
      // const textField = document.getElementById(textFieldId);
      const textField = ref?.current;
      if (isMentionEnabled
        && message?.mentionedUsers?.length > 0
        && message?.mentionedMessageTemplate?.length > 0
      ) {
        /* mention enabled */
        const { mentionedUsers = [] } = message;
        const tokens = tokenizeMessage({
          messageText: message?.mentionedMessageTemplate,
          mentionedUsers,
        });
        textField.innerHTML = tokens.map((token) => {
          if (token.type === TOKEN_TYPES.mention) {
            const mentionedUser = mentionedUsers.find((user) => user.userId === token.userId);
            const nickname = `${USER_MENTION_PREFIX}${mentionedUser?.nickname || token.value || stringSet.MENTION_NAME__NO_NAME}`;
            return renderMentionLabelToString({
              userId: token.userId,
              nickname,
            });
          }
          return sanitizeString(token.value);
        }).join(' ');
      } else {
        /* mention disabled */
        try {
          textField.innerHTML = sanitizeString(message?.message);
        } catch {
          //
        }
        setMentionedUserIds([]);
      }
      setIsInput(textField?.textContent?.trim().length > 0);
      setHeight();
    }
  }, [isEdit, message]);

  // #Mention | Detect MentionedLabel modified
  const useMentionedLabelDetection = useCallback(() => {
    const textField = ref?.current;
    if (isMentionEnabled) {
      const newMentionedUserIds = [...textField.getElementsByClassName('sendbird-mention-user-label')].map((node) => node?.dataset?.userid);
      if (!arrayEqual(mentionedUserIds, newMentionedUserIds) || newMentionedUserIds.length === 0) {
        onMentionedUserIdsUpdated(newMentionedUserIds);
        setMentionedUserIds(newMentionedUserIds);
      }
    }
    setIsInput(textField.textContent?.trim().length > 0);
  }, [targetStringInfo, isMentionEnabled]);

  // #Mention | Replace selected user nickname to the MentionedUserLabel
  useEffect(() => {
    if (isMentionEnabled && mentionSelectedUser) {
      const {
        targetString,
        startNodeIndex,
        startOffsetIndex,
        endNodeIndex,
        endOffsetIndex,
      } = targetStringInfo;
      if (targetString && startNodeIndex !== null && startOffsetIndex !== null) {
        // const textField = document.getElementById(textFieldId);
        const textField = ref?.current;
        const childNodes = nodeListToArray(textField?.childNodes);
        const frontTextNode = document?.createTextNode(
          childNodes[startNodeIndex]?.textContent.slice(0, startOffsetIndex),
        );
        const backTextNode = document?.createTextNode(
          `\u00A0${childNodes[endNodeIndex]?.textContent.slice(endOffsetIndex)}`,
        );
        const mentionLabel = renderMentionLabelToString({
          userId: mentionSelectedUser?.userId,
          nickname: `${USER_MENTION_TEMP_CHAR}${mentionSelectedUser?.nickname || stringSet.MENTION_NAME__NO_NAME}`,
        });
        const div = document.createElement('div');
        div.innerHTML = mentionLabel;
        const newNodes = [
          ...childNodes.slice(0, startNodeIndex),
          frontTextNode,
          div.childNodes[0],
          backTextNode,
          ...childNodes.slice(endNodeIndex + 1),
        ];
        textField.innerHTML = '';
        newNodes.forEach((newNode) => {
          textField.appendChild(newNode);
        });
        onUserMentioned(mentionSelectedUser);
        if (window.getSelection || document.getSelection) {
          // set caret postion
          const selection = window.getSelection() || document.getSelection();
          selection.removeAllRanges();
          const range = new Range();
          range.selectNodeContents(textField);
          range.setStart(textField.childNodes[startNodeIndex + 2], 1);
          range.setEnd(textField.childNodes[startNodeIndex + 2], 1);
          range.collapse(false);
          selection.addRange(range);
          textField.focus();
        }
        setTargetStringInfo({ ...initialTargetStringInfo });
        setHeight();
        useMentionedLabelDetection();
      }
    }
  }, [mentionSelectedUser, isMentionEnabled]);

  // #Mention | Detect mentioning user nickname
  const useMentionInputDetection = useCallback(() => {
    const selection = window?.getSelection?.() || document?.getSelection?.();
    const textField = ref?.current;
    if (selection.anchorNode === textField) {
      onMentionStringChange('');
    }
    if (isMentionEnabled && selection
      && selection.anchorNode === selection.focusNode
      && selection.anchorOffset === selection.focusOffset
    ) {
      let textStack = '';
      let startNodeIndex = null;
      let startOffsetIndex = null;
      for (let index = 0; index < textField.childNodes.length; index += 1) {
        const currentNode = textField.childNodes[index];
        if (currentNode.nodeType === NodeTypes.TextNode) {
          /* text node */
          const textContent = (currentNode === selection.anchorNode)
            ? currentNode?.textContent.slice(0, selection.anchorOffset) || ''
            : currentNode?.textContent || '';
          if (textStack.length > 0) {
            textStack += textContent;
          } else {
            let charLastIndex = textContent.lastIndexOf(USER_MENTION_TEMP_CHAR);
            for (let i = charLastIndex - 1; i > -1; i -= 1) {
              if (textContent[i] === USER_MENTION_TEMP_CHAR) {
                charLastIndex = i;
              } else {
                break;
              }
            }
            if (charLastIndex > -1) {
              textStack = textContent;
              startNodeIndex = index;
              startOffsetIndex = charLastIndex;
            }
          }
        } else {
          /* other nodes */
          textStack = '';
          startNodeIndex = null;
          startOffsetIndex = null;
        }
        if (currentNode === selection.anchorNode) {
          /**
           * targetString could be ''
           * startNodeIndex and startOffsetIndex could be null
           */
          const targetString = textStack ? textStack.slice(startOffsetIndex) : '';// include template character
          setTargetStringInfo({
            targetString,
            startNodeIndex,
            startOffsetIndex,
            endNodeIndex: index,
            endOffsetIndex: selection.anchorOffset,
          });
          onMentionStringChange(targetString);
          return;
        }
      }
    }
  }, [isMentionEnabled]);

  const sendMessage = () => {
    const textField = ref?.current;
    if (!isEdit && textField?.textContent) {
      let messageText = '';
      let mentionTemplate = '';
      textField.childNodes.forEach((node) => {
        if (node.nodeType === NodeTypes.ElementNode && node.nodeName === NodeNames.Span) {
          const { innerText, dataset = {} } = node;
          const { userid = '' } = dataset;
          messageText += innerText;
          mentionTemplate += `${USER_MENTION_TEMP_CHAR}{${userid}}`;
        } else if (node.nodeType === NodeTypes.ElementNode && node.nodeName === NodeNames.Br) {
          messageText += '\n';
          mentionTemplate += '\n';
        } else if (node?.nodeType === NodeTypes.ElementNode && node?.nodeName === NodeNames.Div) {
          // handles newline in safari
          const { textContent = '' } = node;
          messageText += `\n${textContent}`;
          mentionTemplate += `\n${textContent}`;
        } else { // other nodes including text node
          const { textContent = '' } = node;
          messageText += textContent;
          mentionTemplate += textContent;
        }
      });
      const params = { message: messageText, mentionTemplate };
      onSendMessage(params);
      resetInput(ref);
      // important: keeps the keyboard open -> must add test on refactor
      textField.focus();
      setIsInput(false);
      setHeight();
    }
  };
  const isEditDisabled = !(ref?.current?.textContent?.trim());
  const editMessage = () => {
    const textField = ref?.current;
    const messageId = message?.messageId;
    if (isEdit && messageId) {
      let messageText = '';
      let mentionTemplate = '';
      textField.childNodes.forEach((node) => {
        if (node.nodeType === NodeTypes.ElementNode && node.nodeName === NodeNames.Span) {
          const { innerText, dataset = {} } = node;
          const { userid = '' } = dataset;
          messageText += innerText;
          mentionTemplate += `${USER_MENTION_TEMP_CHAR}{${userid}}`;
          messageText += '\n';
          mentionTemplate += '\n';
        } else { // other nodes including text node
          const { textContent = '' } = node;
          messageText += textContent;
          mentionTemplate += textContent;
        }
      });
      const params = { messageId, message: messageText, mentionTemplate };
      onUpdateMessage(params);
      resetInput(ref);
    }
  };
  const onPaste = usePaste({
    ref,
    setMentionedUserIds,
    setMentionedUsers,
    channel,
    setIsInput,
    setHeight,
  });

  const textField = ref?.current;
  return (
    <form
      className={getClassName([
        className,
        isEdit ? 'sendbird-message-input__edit' : '',
        disabled ? 'sendbird-message-input-form__disabled' : '',
      ])}
    >
      <div
        className={getClassName([
          'sendbird-message-input',
          disabled ? 'sendbird-message-input__disabled' : '',
        ])}
      >
        <div
          id={`${textFieldId}${isEdit ? message?.messageId : ''}`}
          className={`sendbird-message-input--textarea ${textFieldId}`}
          contentEditable={!disabled}
          role="textbox"
          aria-label="Text Input"
          disabled={disabled}
          ref={ref}
          maxLength={maxLength}
          onKeyDown={(e) => {
            const preventEvent = onKeyDown(e);
            if (preventEvent) {
              e.preventDefault();
            } else {
              if (!e.shiftKey && e.key === MessageInputKeys.Enter
                && textField?.textContent?.trim().length > 0
                && e?.nativeEvent?.isComposing !== true
              ) {
                e.preventDefault();
                sendMessage();
              }
              if (e.key === MessageInputKeys.Backspace
                && ref?.current?.childNodes?.length === 2
                && !ref?.current?.childNodes?.[0]?.textContent
                && ref?.current.childNodes?.[1]?.nodeType === NodeTypes.ElementNode
              ) {
                ref?.current.removeChild(ref?.current.childNodes[1]);
              }
            }
          }}
          onKeyUp={(e) => {
            const preventEvent = onKeyUp(e);
            if (preventEvent) {
              e.preventDefault();
            } else {
              useMentionInputDetection();
            }
          }}
          onClick={() => {
            useMentionInputDetection();
          }}
          onInput={() => {
            setHeight();
            onStartTyping();
            setIsInput(textField?.textContent?.trim().length > 0);
            useMentionedLabelDetection();
          }}
          onPaste={onPaste}
        />
        {/* placeholder */}
        {textField?.innerText?.length === 0 && (
          <Label
            className="sendbird-message-input--placeholder"
            type={LabelTypography.BODY_1}
            color={disabled ? LabelColors.ONBACKGROUND_4 : LabelColors.ONBACKGROUND_3}
          >
            {placeholder || stringSet.MESSAGE_INPUT__PLACE_HOLDER}
          </Label>
        )}
        {/* send icon */}
        {
          (!isEdit && isInput) && (
            <IconButton
              className="sendbird-message-input--send"
              height="32px"
              width="32px"
              onClick={() => sendMessage()}
            >
              {
                renderSendMessageIcon?.() || (
                  <Icon
                    type={IconTypes.SEND}
                    fillColor={disabled ? IconColors.ON_BACKGROUND_4 : IconColors.PRIMARY}
                    width="20px"
                    height="20px"
                  />
                )
              }
            </IconButton>
          )
        }
        {/* file upload icon */}
        {
          (!isEdit && !isInput) && (
            (renderFileUploadIcon?.()
              // UIKit Dashboard configuration should have lower priority than
              // renderFileUploadIcon which is set in code level
              || (isFileUploadEnabled && (
              <IconButton
                className={`sendbird-message-input--attach ${isVoiceMessageEnabled ? 'is-voice-message-enabled' : ''}`}
                height="32px"
                width="32px"
                onClick={() => {
                  // todo: clear previous input
                  fileInputRef?.current?.click?.();
                }}
              >
                <Icon
                  type={IconTypes.ATTACH}
                  fillColor={disabled ? IconColors.ON_BACKGROUND_4 : IconColors.CONTENT_INVERSE}
                  width="20px"
                  height="20px"
                />
                <input
                  className="sendbird-message-input--attach-input"
                  type="file"
                  ref={fileInputRef}
                  // It will affect to <Channel /> and <Thread />
                  onChange={(event) => {
                    const { files } = event.currentTarget;
                    onFileUpload(files && files.length === 1 ? files[0] : [...files]);
                    event.target.value = '';
                  }}
                  accept={getMimeTypesUIKitAccepts(acceptableMimeTypes)}
                  multiple={
                    isSelectingMultipleFilesEnabled
                    && isChannelTypeSupportsMultipleFilesMessage(channel)
                  }
                />
              </IconButton>
              )
              ))
          )
        }
        {/* voice message input trigger */}
        {(isVoiceMessageEnabled && !isEdit && !isInput) && (
          <IconButton
            className="sendbird-message-input--voice-message"
            width="32px"
            height="32px"
            onClick={onVoiceMessageIconClick}
          >
            {
              renderVoiceMessageIcon?.() || (
                <Icon
                  type={IconTypes.AUDIO_ON_LINED}
                  fillColor={disabled ? IconColors.ON_BACKGROUND_4 : IconColors.CONTENT_INVERSE}
                  width="20px"
                  height="20px"
                />
              )
            }
          </IconButton>
        )}
      </div>
      {/* Edit */}
      {
        isEdit && (
          <div className="sendbird-message-input--edit-action">
            <Button
              className="sendbird-message-input--edit-action__cancel"
              type={ButtonTypes.SECONDARY}
              size={ButtonSizes.SMALL}
              onClick={onCancelEdit}
            >
              {stringSet.BUTTON__CANCEL}
            </Button>
            <Button
              className="sendbird-message-input--edit-action__save"
              type={ButtonTypes.PRIMARY}
              size={ButtonSizes.SMALL}
              disabled={isEditDisabled}
              onClick={() => editMessage()}
            >
              {stringSet.BUTTON__SAVE}
            </Button>
          </div>
        )
      }
    </form>
  );
});

MessageInput.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  isEdit: PropTypes.bool,
  isMentionEnabled: PropTypes.bool,
  isVoiceMessageEnabled: PropTypes.bool,
  isSelectingMultipleFilesEnabled: PropTypes.bool,
  disabled: PropTypes.bool,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
  onFileUpload: PropTypes.func,
  onSendMessage: PropTypes.func,
  onUpdateMessage: PropTypes.func,
  onStartTyping: PropTypes.func,
  onCancelEdit: PropTypes.func,
  channelUrl: PropTypes.string,
  channel: PropTypes.shape({
    channelType: PropTypes.string,
  }).isRequired,
  messageFieldId: PropTypes.string,
  acceptableMimeTypes: PropTypes.arrayOf(PropTypes.string),
  // Mention
  message: PropTypes.shape({
    messageId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    message: PropTypes.string,
    mentionedMessageTemplate: PropTypes.string,
    mentionedUsers: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  setMentionedUsers: PropTypes.func,
  mentionSelectedUser: PropTypes.shape({
    userId: PropTypes.string,
    nickname: PropTypes.string,
  }),
  onUserMentioned: PropTypes.func,
  onMentionStringChange: PropTypes.func,
  onMentionedUserIdsUpdated: PropTypes.func,
  onKeyUp: PropTypes.func,
  onKeyDown: PropTypes.func,
  // Voice Message
  onVoiceMessageIconClick: PropTypes.func,
  renderVoiceMessageIcon: PropTypes.func,
  renderSendMessageIcon: PropTypes.func,
  renderFileUploadIcon: PropTypes.func,
};

MessageInput.defaultProps = {
  className: '',
  messageFieldId: '',
  channelUrl: '',
  onSendMessage: noop,
  onUpdateMessage: noop,
  value: null,
  message: null,
  isEdit: false,
  isMentionEnabled: false,
  isVoiceMessageEnabled: true,
  isSelectingMultipleFilesEnabled: false,
  onVoiceMessageIconClick: noop,
  disabled: false,
  placeholder: '',
  maxLength: 5000,
  onFileUpload: noop,
  onCancelEdit: noop,
  onStartTyping: noop,
  mentionSelectedUser: null,
  onUserMentioned: noop,
  onMentionStringChange: noop,
  onMentionedUserIdsUpdated: noop,
  onKeyUp: noop,
  onKeyDown: noop,
  setMentionedUsers: noop,
  renderVoiceMessageIcon: noop,
  renderFileUploadIcon: noop,
  renderSendMessageIcon: noop,
  acceptableMimeTypes: null,
};

export default MessageInput;
