import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';

import './index.scss';
import { MessageInputKeys, NodeTypes } from './const';

import { USER_MENTION_TEMP_CHAR } from '../../modules/Channel/context/const';
import IconButton from '../IconButton';
import Button, { ButtonSizes, ButtonTypes } from '../Button';
import renderMentionLabelToString from '../MentionUserLabel/renderToString';
import Icon, { IconColors, IconTypes } from '../Icon';
import Label, { LabelColors, LabelTypography } from '../Label';
import { useLocalization } from '../../lib/LocalizationContext';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';

import { extractTextAndMentions, isChannelTypeSupportsMultipleFilesMessage, nodeListToArray, sanitizeString } from './utils';
import { arrayEqual, getClassName, getMimeTypesUIKitAccepts } from '../../utils';
import usePaste from './hooks/usePaste';
import { tokenizeMessage } from '../../modules/Message/utils/tokens/tokenize';
import { USER_MENTION_PREFIX } from '../../modules/Message/consts';
import { TOKEN_TYPES } from '../../modules/Message/utils/tokens/types';
import { checkIfFileUploadEnabled } from './messageInputUtils';
import { classnames, isMobileIOS } from '../../utils/utils';

import { GroupChannel } from '@sendbird/chat/groupChannel';
import { User } from '@sendbird/chat';
import { OpenChannel } from '@sendbird/chat/openChannel';
import { UserMessage } from '@sendbird/chat/message';

const TEXT_FIELD_ID = 'sendbird-message-input-text-field';
const LINE_HEIGHT = 76;
const DEFAULT_CHAT_VIEW_HEIGHT = 600;
const noop = () => {
  return null;
};

const displayCaret = (element: HTMLInputElement, position: number) => {
  const range = document.createRange();
  const sel = window.getSelection();
  range.setStart(element.childNodes[0], position);
  range.collapse(true);
  sel?.removeAllRanges();
  sel?.addRange(range);
  element.focus();
};

const resetInput = (ref: MutableRefObject<HTMLInputElement | null> | null) => {
  if (ref && ref.current) {
    ref.current.innerHTML = '';
  }
};

interface TargetStringInfo {
  targetString: string;
  startNodeIndex: number | null;
  startOffsetIndex: number | null;
  endNodeIndex: number | null;
  endOffsetIndex: number | null;
}

const initialTargetStringInfo : TargetStringInfo = {
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
  isMobile?: boolean;
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
    isMobile = false,
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

  const fileInputRef = useRef<HTMLInputElement>();
  const [isInput, setIsInput] = useState(false);
  const [mentionedUserIds, setMentionedUserIds] = useState<string[]>([]);
  const [targetStringInfo, setTargetStringInfo] = useState({ ...initialTargetStringInfo });
  const setHeight = useCallback(
    () => {
      const elem = internalRef?.current;
      if (!elem) return;

      try {
        const estimatedChatViewHeight = window.document.body.offsetHeight || DEFAULT_CHAT_VIEW_HEIGHT;
        const MAX_HEIGHT = estimatedChatViewHeight * 0.6;
        if (elem.scrollHeight >= LINE_HEIGHT) {
          if (MAX_HEIGHT < elem.scrollHeight) {
            elem.style.height = 'auto';
            elem.style.height = `${MAX_HEIGHT}px`;
          } else {
            elem.style.height = '';
          }
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
      if (textField && initialValue) {
        textField.innerHTML = initialValue;
        displayCaret(textField, initialValue?.length);
      }
    } catch {
      //
    }
    setMentionedUserIds([]);
    setIsInput(textField?.textContent ? textField.textContent.trim().length > 0 : false);
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
      if (isMentionEnabled
        && message?.mentionedUsers
        && message.mentionedUsers.length > 0
        && message?.mentionedMessageTemplate
        && message.mentionedMessageTemplate.length > 0) {
        /* mention enabled */
        const { mentionedUsers = [] } = message;
        const tokens = tokenizeMessage({
          messageText: message?.mentionedMessageTemplate,
          mentionedUsers,
        });
        if (textField) {
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
        }
      } else {
        /* mention disabled */
        try {
          if (textField) {
            textField.innerHTML = sanitizeString(message?.message) ?? '';
          }
        } catch {
          //
        }
        setMentionedUserIds([]);
      }
      setIsInput(textField?.textContent ? textField?.textContent?.trim().length > 0 : false);
      setHeight();
    }
  }, [isEdit, message]);

  // #Mention | Detect MentionedLabel modified
  const useMentionedLabelDetection = useCallback(() => {
    const textField = internalRef?.current;
    if (isMentionEnabled && textField) {
      const newMentionedUserIds = Array.from(textField.getElementsByClassName('sendbird-mention-user-label')).map(
        // @ts-ignore
        (node) => node?.dataset?.userid,
      );
      if (!arrayEqual(mentionedUserIds, newMentionedUserIds) || newMentionedUserIds.length === 0) {
        onMentionedUserIdsUpdated(newMentionedUserIds);
        setMentionedUserIds(newMentionedUserIds);
      }
    }
    setIsInput(textField?.textContent ? textField.textContent?.trim().length > 0 : false);
  }, [targetStringInfo, isMentionEnabled]);

  // #Mention | Replace selected user nickname to the MentionedUserLabel
  useEffect(() => {
    if (isMentionEnabled && mentionSelectedUser) {
      const { targetString, startNodeIndex, startOffsetIndex, endNodeIndex, endOffsetIndex } = targetStringInfo;
      const textField = internalRef?.current;
      if (targetString && startNodeIndex && startOffsetIndex && textField && endNodeIndex) {
        // const textField = document.getElementById(textFieldId);
        const childNodes = nodeListToArray(textField?.childNodes);
        const startNodeTextContent: string = childNodes[startNodeIndex]?.textContent ?? '';
        const frontTextNode = document?.createTextNode(
          startNodeTextContent.slice(0, startOffsetIndex),
        );
        const endNodeTextContent: string = childNodes[endNodeIndex]?.textContent ?? '';
        const backTextNode = endOffsetIndex && document?.createTextNode(
          `\u00A0${endNodeTextContent.slice(endOffsetIndex)}`,
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
        if (textField) {
          textField.innerHTML = '';
          newNodes.forEach((newNode) => {
            if (newNode) {
              textField.appendChild(newNode);
            }
          });
        }
        onUserMentioned(mentionSelectedUser);
        if (window.getSelection || document.getSelection) {
          // set caret postion
          const selection = window.getSelection() || document.getSelection();
          selection?.removeAllRanges();
          const range = new Range();
          range.selectNodeContents(textField);
          range.setStart(textField.childNodes[startNodeIndex + 2], 1);
          range.setEnd(textField.childNodes[startNodeIndex + 2], 1);
          range.collapse(false);
          selection?.addRange(range);
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
    if (selection?.anchorNode === textField) {
      onMentionStringChange('');
    }
    if (
      isMentionEnabled
      && textField
      && selection
      && selection.anchorNode === selection.focusNode
      && selection.anchorOffset === selection.focusOffset
    ) {
      let textStack = '';
      let startNodeIndex: number | null = null;
      let startOffsetIndex: number | null = null;
      for (let index = 0; index < textField.childNodes.length; index += 1) {
        const currentNode = textField.childNodes[index];
        if (currentNode.nodeType === NodeTypes.TextNode) {
          /* text node */
          const textContent: string = ((): string => {
            if (currentNode === selection.anchorNode) {
              return currentNode?.textContent ? currentNode?.textContent.slice(0, selection.anchorOffset) : '';
            }
            return currentNode?.textContent ?? '';
          })();
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
          const targetString = textStack && startOffsetIndex ? textStack.slice(startOffsetIndex) : ''; // include template character
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
      const { messageText, mentionTemplate } = extractTextAndMentions(textField.childNodes);
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
    if (isEdit && messageId && textField) {
      const { messageText, mentionTemplate } = extractTextAndMentions(textField.childNodes);
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
                && !isMobile
                && internalRef?.current?.textContent
                && internalRef.current.textContent.trim().length > 0
                && e?.nativeEvent?.isComposing !== true
                /**
                 * NOTE: What isComposing does?
                 * Check if the user has finished composing characters
                 * (e.g., for languages like Korean, Japanese, where characters are composed from multiple keystrokes)
                 * Prevents executing the code while the user is still composing characters.
                 */
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
                && !internalRef.current.childNodes[0].textContent
                && internalRef.current.childNodes[1].nodeType === NodeTypes.ElementNode
              ) {
                internalRef.current.removeChild(internalRef.current.childNodes[1]);
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
            setIsInput(internalRef?.current?.textContent ? internalRef.current.textContent.trim().length > 0 : false);
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
                className={classnames('sendbird-message-input--attach', isVoiceMessageEnabled && 'is-voice-message-enabled')}
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
                    if (files) {
                      onFileUpload(files && files.length === 1 ? [files[0]] : Array.from(files));
                    }
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
