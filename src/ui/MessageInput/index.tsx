import React, { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import './index.scss';
import { MessageInputKeys, NodeNames, NodeTypes } from './const';

import { USER_MENTION_TEMP_CHAR } from '../../modules/Channel/context/const';
import IconButton from '../IconButton';
import Button, { ButtonSizes, ButtonTypes } from '../Button';
import renderMentionLabelToString from '../MentionUserLabel/renderToString';
import Icon, { IconColors, IconTypes } from '../Icon';
import Label, { LabelColors, LabelTypography } from '../Label';
import { useLocalization } from '../../lib/LocalizationContext';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';

import { isChannelTypeSupportsMultipleFilesMessage, nodeListToArray, sanitizeString } from './utils';
import { arrayEqual, getClassName, getMimeTypesUIKitAccepts } from '../../utils';
import usePaste from './hooks/usePaste';
import { tokenizeMessage } from '../../modules/Message/utils/tokens/tokenize';
import { USER_MENTION_PREFIX } from '../../modules/Message/consts';
import { TOKEN_TYPES } from '../../modules/Message/utils/tokens/types';
import { checkIfFileUploadEnabled } from './messageInputUtils';
import { isMobileIOS } from '../../utils/utils';

import { GroupChannel } from '@sendbird/chat/groupChannel';
import { User } from '@sendbird/chat';
import { OpenChannel } from '@sendbird/chat/openChannel';
import { UserMessage } from '@sendbird/chat/message';

const TEXT_FIELD_ID = 'sendbird-message-input-text-field';
const LINE_HEIGHT = 76;
const noop = () => {
  return null;
};

const displayCaret = (element: HTMLInputElement, position: number) => {
  const range = document.createRange();
  const sel = window.getSelection();
  range.setStart(element.childNodes[0], position);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
  element.focus();
};

const resetInput = (ref: MutableRefObject<HTMLElement>) => {
  try {
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

type MessageInputProps = {
  channel: GroupChannel | OpenChannel;
  message?: UserMessage;
  value?: null | string;
  className?: string | string[];
  messageFieldId?: string;
  isEdit?: boolean;
  isMentionEnabled?: boolean;
  isVoiceMessageEnabled?: boolean;
  isSelectingMultipleFilesEnabled?: boolean;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  onFileUpload?: (file: File[]) => void;
  onSendMessage?: (params: { message: string; mentionTemplate: string }) => void;
  onUpdateMessage?: (params: { messageId: number; message: string; mentionTemplate: string }) => void;
  onCancelEdit?: () => void;
  onStartTyping?: () => void;
  channelUrl?: string;
  mentionSelectedUser?: null | User;
  onUserMentioned?: (user: User) => void;
  onMentionStringChange?: (mentionString: string) => void;
  onMentionedUserIdsUpdated?: (mentionedUserIds: string[]) => void;
  onVoiceMessageIconClick?: () => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLDivElement>) => boolean;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => boolean;
  renderVoiceMessageIcon?: () => React.ReactNode;
  renderFileUploadIcon?: () => React.ReactNode;
  renderSendMessageIcon?: () => React.ReactNode;
  setMentionedUsers?: React.Dispatch<React.SetStateAction<User[]>>;
  acceptableMimeTypes?: string[];
};
const MessageInput = React.forwardRef<HTMLInputElement, MessageInputProps>((props, externalRef) => {
  const {
    channel,
    className = '',
    messageFieldId = '',
    isEdit = false,
    isMentionEnabled = false,
    isVoiceMessageEnabled = true,
    isSelectingMultipleFilesEnabled = false,
    disabled = false,
    message = null,
    placeholder = '',
    maxLength = 5000,
    onFileUpload = noop,
    onSendMessage = noop,
    onUpdateMessage = noop,
    onCancelEdit = noop,
    onStartTyping = noop,
    channelUrl = '',
    mentionSelectedUser = null,
    onUserMentioned = noop,
    onMentionStringChange = noop,
    onMentionedUserIdsUpdated = noop,
    onVoiceMessageIconClick = noop,
    onKeyUp = noop,
    onKeyDown = noop,
    renderFileUploadIcon = noop,
    renderVoiceMessageIcon = noop,
    renderSendMessageIcon = noop,
    setMentionedUsers = noop,
    acceptableMimeTypes,
  } = props;

  const internalRef = (externalRef && 'current' in externalRef) ? externalRef : null;

  const textFieldId = messageFieldId || TEXT_FIELD_ID;
  const { stringSet } = useLocalization();
  const { config } = useSendbirdStateContext();

  const isFileUploadEnabled = checkIfFileUploadEnabled({
    channel,
    config,
  });

  const fileInputRef = useRef(null);
  const [isInput, setIsInput] = useState(false);
  const [mentionedUserIds, setMentionedUserIds] = useState<string[]>([]);
  const [targetStringInfo, setTargetStringInfo] = useState({ ...initialTargetStringInfo });
  const setHeight = useMemo(
    () => () => {
      try {
        const elem = internalRef?.current;
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
    },
    [],
  );

  // #Edit mode
  // for easilly initialize input value from outside, but
  // useEffect(_, [channelUrl]) erase it
  const initialValue = props?.value;
  useEffect(() => {
    const textField = internalRef?.current;
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
      resetInput(internalRef);
    }
  }, [channelUrl]);

  // #Mention & #Edit | Fill message input values
  useEffect(() => {
    if (isEdit && message?.messageId) {
      // const textField = document.getElementById(textFieldId);
      const textField = internalRef?.current;
      if (isMentionEnabled && message?.mentionedUsers?.length > 0 && message?.mentionedMessageTemplate?.length > 0) {
        /* mention enabled */
        const { mentionedUsers = [] } = message;
        const tokens = tokenizeMessage({
          messageText: message?.mentionedMessageTemplate,
          mentionedUsers,
        });
        textField.innerHTML = tokens
          .map((token) => {
            if (token.type === TOKEN_TYPES.mention) {
              const mentionedUser = mentionedUsers.find((user) => user.userId === token.userId);
              const nickname = `${USER_MENTION_PREFIX}${
                mentionedUser?.nickname || token.value || stringSet.MENTION_NAME__NO_NAME
              }`;
              return renderMentionLabelToString({
                userId: token.userId,
                nickname,
              });
            }
            return sanitizeString(token.value);
          })
          .join(' ');
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
    const textField = internalRef?.current;
    if (isMentionEnabled) {
      const newMentionedUserIds = Array.from(textField.getElementsByClassName('sendbird-mention-user-label')).map(
        // @ts-ignore
        (node) => node?.dataset?.userid,
      );
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
      const { targetString, startNodeIndex, startOffsetIndex, endNodeIndex, endOffsetIndex } = targetStringInfo;
      if (targetString && startNodeIndex !== null && startOffsetIndex !== null) {
        // const textField = document.getElementById(textFieldId);
        const textField = internalRef?.current;
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
    const textField = internalRef?.current;
    if (selection.anchorNode === textField) {
      onMentionStringChange('');
    }
    if (
      isMentionEnabled
      && selection
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
          const textContent = currentNode === selection.anchorNode
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
          const targetString = textStack ? textStack.slice(startOffsetIndex) : ''; // include template character
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
    const textField = internalRef?.current;
    if (!isEdit && textField?.textContent) {
      let messageText = '';
      let mentionTemplate = '';
      textField.childNodes.forEach((node) => {
        if (node.nodeType === NodeTypes.ElementNode && node.nodeName === NodeNames.Span) {
          // @ts-ignore
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
        } else {
          // other nodes including text node
          const { textContent = '' } = node;
          messageText += textContent;
          mentionTemplate += textContent;
        }
      });
      const params = { message: messageText, mentionTemplate };
      onSendMessage(params);
      resetInput(internalRef);
      // important: keeps the keyboard open -> must add test on refactor
      textField.focus();
      setIsInput(false);
      setHeight();
    }
  };
  const isEditDisabled = !internalRef?.current?.textContent?.trim();
  const editMessage = () => {
    const textField = internalRef?.current;
    const messageId = message?.messageId;
    if (isEdit && messageId) {
      let messageText = '';
      let mentionTemplate = '';
      textField.childNodes.forEach((node) => {
        if (node.nodeType === NodeTypes.ElementNode && node.nodeName === NodeNames.Span) {
          // @ts-ignore
          const { innerText, dataset = {} } = node;
          const { userid = '' } = dataset;
          messageText += innerText;
          mentionTemplate += `${USER_MENTION_TEMP_CHAR}{${userid}}`;
          messageText += '\n';
          mentionTemplate += '\n';
        } else {
          // other nodes including text node
          const { textContent = '' } = node;
          messageText += textContent;
          mentionTemplate += textContent;
        }
      });
      const params = { messageId, message: messageText, mentionTemplate };
      onUpdateMessage(params);
      resetInput(internalRef);
    }
  };
  const onPaste = usePaste({
    ref: internalRef,
    setMentionedUsers,
    channel,
    setIsInput,
    setHeight,
  });

  return (
    <form
      className={getClassName([
        className,
        isEdit ? 'sendbird-message-input__edit' : '',
        disabled ? 'sendbird-message-input-form__disabled' : '',
      ])}
    >
      <div className={getClassName(['sendbird-message-input', disabled ? 'sendbird-message-input__disabled' : ''])}>
        <div
          id={`${textFieldId}${isEdit ? message?.messageId : ''}`}
          className={`sendbird-message-input--textarea ${textFieldId}`}
          contentEditable={!disabled}
          role="textbox"
          aria-label="Text Input"
          ref={externalRef}
          // @ts-ignore
          disabled={disabled}
          maxLength={maxLength}
          onKeyDown={(e) => {
            const preventEvent = onKeyDown(e);
            if (preventEvent) {
              e.preventDefault();
            } else {
              if (
                !e.shiftKey
                && e.key === MessageInputKeys.Enter
                && internalRef?.current?.textContent?.trim().length > 0
                && e?.nativeEvent?.isComposing !== true
              ) {
                /**
                 * NOTE: contentEditable does not work as expected in mobile WebKit(Safari).
                 * Events and properties related to composing, necessary for combining characters like Hangul, also seem to be not handled properly.
                 * When calling e.preventDefault(), it appears that string composition-related behaviors, in addition to the default actions, are also prevented. (maybe)
                 *
                 * Due to this issue, even though reset the input with innerHTML, incomplete text compositions from the previous input are displayed in the next input.
                 * */
                if (!isMobileIOS(navigator.userAgent)) {
                  e.preventDefault();
                }
                sendMessage();
              }
              if (
                e.key === MessageInputKeys.Backspace
                && internalRef?.current?.childNodes?.length === 2
                && !internalRef?.current?.childNodes?.[0]?.textContent
                && internalRef?.current.childNodes?.[1]?.nodeType === NodeTypes.ElementNode
              ) {
                internalRef?.current.removeChild(internalRef?.current.childNodes[1]);
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
            setIsInput(internalRef?.current?.textContent?.trim().length > 0);
            useMentionedLabelDetection();
          }}
          onPaste={onPaste}
        />
        {/* placeholder */}
        {(internalRef?.current?.textContent?.length ?? 0) === 0 && (
          <Label
            className="sendbird-message-input--placeholder"
            type={LabelTypography.BODY_1}
            color={disabled ? LabelColors.ONBACKGROUND_4 : LabelColors.ONBACKGROUND_3}
          >
            {placeholder || stringSet.MESSAGE_INPUT__PLACE_HOLDER}
          </Label>
        )}
        {/* send icon */}
        {!isEdit && isInput && (
          <IconButton className="sendbird-message-input--send" height="32px" width="32px" onClick={() => sendMessage()}>
            {renderSendMessageIcon?.() || (
              <Icon
                type={IconTypes.SEND}
                fillColor={disabled ? IconColors.ON_BACKGROUND_4 : IconColors.PRIMARY}
                width="20px"
                height="20px"
              />
            )}
          </IconButton>
        )}
        {/* file upload icon */}
        {!isEdit
          && !isInput
          && (renderFileUploadIcon?.()
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
                    onFileUpload(files && files.length === 1 ? [files[0]] : Array.from(files));
                    event.target.value = '';
                  }}
                  accept={getMimeTypesUIKitAccepts(acceptableMimeTypes)}
                  multiple={isSelectingMultipleFilesEnabled && isChannelTypeSupportsMultipleFilesMessage(channel)}
                />
              </IconButton>
            )))}
        {/* voice message input trigger */}
        {isVoiceMessageEnabled && !isEdit && !isInput && (
          <IconButton
            className="sendbird-message-input--voice-message"
            width="32px"
            height="32px"
            onClick={onVoiceMessageIconClick}
          >
            {renderVoiceMessageIcon?.() || (
              <Icon
                type={IconTypes.AUDIO_ON_LINED}
                fillColor={disabled ? IconColors.ON_BACKGROUND_4 : IconColors.CONTENT_INVERSE}
                width="20px"
                height="20px"
              />
            )}
          </IconButton>
        )}
      </div>
      {/* Edit */}
      {isEdit && (
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
      )}
    </form>
  );
});

export default MessageInput;
