import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { renderToString } from 'react-dom/server';
import PropTypes from 'prop-types';

import './index.scss';

import IconButton from '../IconButton';
import Button, { ButtonTypes, ButtonSizes } from '../Button';

import MentionUserLabel from '../MentionUserLabel';
import Icon, { IconTypes, IconColors } from '../Icon';
import Label, { LabelTypography, LabelColors } from '../Label';
import { LocalizationContext } from '../../lib/LocalizationContext';
import { getClassName, arrayEqual, convertWordToStringObj, StringObjType } from '../../utils';

const TEXT_FIELD_ID = 'sendbird-message-input-text-field';
const SPAN_TAG_REGEX = /<span.*?>.*?<\/span>/g;
const LINE_HEIGHT = 76;
const noop = () => { };
const KeyCode = {
  SHIFT: 16,
  ENTER: 13,
};

function decodeEntity(inputStr) {
  var textarea = document.createElement("textarea");
  textarea.innerHTML = inputStr;
  return textarea.value;
}

/* Thanks to https://stackoverflow.com/a/4812022/96100 */
function getSelectionCharacterOffsetWithin(element) {
  let start = null;
  let end = null;
  let doc = element.ownerDocument || element.document;
  let win = doc.defaultView || doc.parentWindow;
  let sel;
  if (typeof win.getSelection != "undefined") {
    sel = win.getSelection();
    if (sel.rangeCount > 0) {
      let range = win.getSelection().getRangeAt(0);
      let preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.startContainer, range.startOffset);
      start = preCaretRange.toString().length;
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      end = preCaretRange.toString().length;
    }
  } else if ((sel = doc.selection) && sel.type != "Control") {
    let textRange = sel.createRange();
    let preCaretTextRange = doc.body.createTextRange();
    preCaretTextRange.moveToElementText(element);
    preCaretTextRange.setEndPoint("EndToStart", textRange);
    start = preCaretTextRange.text.length;
    preCaretTextRange.setEndPoint("EndToEnd", textRange);
    end = preCaretTextRange.text.length;
  }
  return { start: start, end: end };
}

function getMentionStringInfo(currentText, position) {
  const frontString = currentText?.slice(0, position);
  let isMentionActivated = false;
  let targetString = '';
  let start = null;
  let end = position;
  if (frontString?.length > 0 && frontString?.includes('@')) {
    isMentionActivated = true;
    const splitedTextArray = frontString?.split(' @');
    const charIndex = splitedTextArray[splitedTextArray.length - 1].lastIndexOf('@');
    if (splitedTextArray.length === 1 && charIndex >= 0) {
      // Edge case: When the trigger charater is at the front end of the sentence
      targetString = splitedTextArray[0].slice(charIndex + 1);
      start = charIndex;
    } else {
      targetString = splitedTextArray[splitedTextArray.length - 1];
      start = splitedTextArray.slice(0, -1).join(' @').length;
    }
  }
  return { targetString, isMentionActivated, start, end };
}

const getHtmlStringFromNodes = (startNode, start, endNode, end) => {
  const range = new Range();
  range.setStart(startNode, start);
  range.setEnd(endNode, end);
  const tempDom = document.createElement('div');
  tempDom.appendChild(range.cloneContents());
  return tempDom.innerHTML;
};

const getStringFromNode = (element, start, end) => {
  const range = new Range();
  range.setStart(element, start);
  range.setEnd(element, end);
  return range.toString();
};

const handleUploadFile = (callback) => (event) => {
  if (event.target.files && event.target.files[0]) {
    callback(event.target.files[0]);
  }
  // eslint-disable-next-line no-param-reassign
  event.target.value = '';
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
    isEdit,
    isMentionEnabled,
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
    mentionSelectedUser,
    onUserMentioned,
    onMentionStringChange,
    onMentionedUserIdsUpdated,
    onKeyUp,
    onKeyDown,
  } = props;
  const { stringSet } = useContext(LocalizationContext);
  const fileInputRef = useRef(null);
  const [isInput, setIsInput] = useState(false);
  const [mentionedUserIds, setMentionedUserIds] = useState([]);
  const [caretPosition, setCaretPosition] = useState(0);
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [targetStringInfo, setTargetStringInfo] = useState({ ...initialTargetStringInfo });

  const setHeight = () => {
    try {
      const elem = ref.current;
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
  };

  // clear input value when channel changes
  useEffect(() => {
    if (!isEdit) {
      setIsInput(false);
      document.getElementById(TEXT_FIELD_ID).innerHTML = '';
    }
  }, [channelUrl]);

  useEffect(() => {
    if (isEdit && message?.messageId) {
      const textField = document.getElementById(TEXT_FIELD_ID);
      if (isMentionEnabled
        && message?.mentionedUsers?.length > 0
        && message?.mentionedMessageTemplate?.length > 0
      ) {
        /* mention enabled */
        const { mentionedUsers = [] } = message;
        textField.innerHTML = message?.mentionedMessageTemplate?.split(' ').map((word) => {
          console.log('splited word', word);
          return convertWordToStringObj(word, mentionedUsers).map((stringObj) => {
            const { type, value, userId } = stringObj;
            console.log('converted string obj', stringObj)
            if (type === StringObjType.mention
              && mentionedUsers.some((user) => user?.userId === userId)
            ) {
              return renderToString(
                <MentionUserLabel userId={userId}>
                  {`@${mentionedUsers.find((user) => user?.userId === userId)?.nickname || value || '(No name)'}`}
                </MentionUserLabel>
              );
            } else {
              return value;
            }
          }).join('');
        }).join(' ');
      } else {
        /* mention disabled */
        textField.innerHTML = message?.message;
        setMentionedUserIds([]);
      }
      setIsInput(textField?.innerText?.length > 0);
      setHeight();
    }
  }, [isEdit, message]);

  // #Mention | Replace selected user nickname to the MentionedUserLabel
  useEffect(() => {
    // if (isMentionEnabled && mentionSelectedUser) {
    //   const {
    //     targetString,
    //     startNodeIndex,
    //     startOffsetIndex,
    //     endNodeIndex,
    //     endOffsetIndex,
    //   } = targetStringInfo;
    //   if (targetString && startNodeIndex !== null && startOffsetIndex !== null) {
    //     const textField = document.getElementById(TEXT_FIELD_ID);
    //     const childNodes = [...textField?.childNodes]?.map?.((node) => node.cloneNode());
    //     const frontTextNode = document?.createTextNode(childNodes[startNodeIndex]?.textContent.slice(0, startOffsetIndex));
    //     const backTextNode = document?.createTextNode(childNodes[endNodeIndex]?.textContent.slice(endOffsetIndex));
    //     const mentionLabel = renderToString(
    //       <MentionUserLabel>
    //         {mentionSelectedUser?.nickname}
    //       </MentionUserLabel>
    //     );
    //     const div = document.createElement('div');
    //     div.innerHTML = mentionLabel;
    //     const newNodes = [
    //       ...childNodes.slice(0, startNodeIndex),
    //       frontTextNode,
    //       div.childNodes[0],
    //       backTextNode,
    //       ...childNodes.slice(endNodeIndex + 1),
    //     ];
    //     textField.innerHTML = '';
    //     newNodes.forEach((newNode) => {
    //       textField.appendChild(newNode);
    //     });
    //     setTargetStringInfo({ ...initialTargetStringInfo });
    //     setHeight();
    //   }
    // }
    if (isMentionEnabled && mentionSelectedUser) {
      const textField = document.getElementById(TEXT_FIELD_ID);
      for (let index = 0; index < textField.childNodes.length; index++) {
        const previousTextContents = getStringFromNode(textField, 0, index);
        const currentTextContents = getStringFromNode(textField, index, index + 1);
        // search which child node includes the caret
        if (previousTextContents.length + currentTextContents.length >= caretPosition
          && !SPAN_TAG_REGEX.test(currentTextContents)
        ) {
          const { start, end } = getMentionStringInfo(currentTextContents, caretPosition - previousTextContents.length);
          const frontHtmlString = getHtmlStringFromNodes(textField, 0, textField.childNodes[index], start);
          const backHtmlString = getHtmlStringFromNodes(textField.childNodes[index], end, textField, textField.childNodes.length) || '&nbsp;';
          const targetHtmlString = renderToString(
            <MentionUserLabel userId={mentionSelectedUser?.userId}>
              {`@${mentionSelectedUser?.nickname || '(No name)'}`}
            </MentionUserLabel>
          );
          textField.innerHTML = `${frontHtmlString} ${targetHtmlString}${backHtmlString}`;
          onUserMentioned(mentionSelectedUser);
          if (window.getSelection || document.getSelection) {
            // set caret postion
            const selection = window.getSelection() || document.getSelection();
            selection.removeAllRanges();
            const range = new Range();
            range.selectNodeContents(textField);
            range.setStart(textField.childNodes[index + 2], 1);
            range.setEnd(textField.childNodes[index + 2], 1);
            range.collapse(false);
            selection.addRange(range);
            textField.focus();
            const { start, end } = getSelectionCharacterOffsetWithin(document.getElementById(TEXT_FIELD_ID));
            if (start === end) {
              setCaretPosition(start);
            }
          }
          setHeight();
          useMentionedLabelDetection();
          break;
        }
      }
    }
  }, [mentionSelectedUser, isMentionEnabled]);

  // #Mention | Detect MentionedLabel modified
  const useMentionedLabelDetection = useCallback(() => {
    const textField = document.getElementById(TEXT_FIELD_ID);
    if (isMentionEnabled) {
      const newMentionedUserIds = [...textField.getElementsByClassName('sendbird-mention-user-label')].map((node) => node?.dataset?.userid);
      if (!arrayEqual(mentionedUserIds, newMentionedUserIds)) {
        onMentionedUserIdsUpdated(newMentionedUserIds);
        setMentionedUserIds(newMentionedUserIds);
      }
    }
    setIsInput(textField.innerText.length > 0);
  }, [caretPosition, isMentionEnabled]);

  // #Mention | Detect mentioning user nickname
  const useMentionInputDetection = useCallback(() => {
    const selection = window?.getSelection?.() || document?.getSelection?.();
    if (isMentionEnabled && selection
      && selection.anchorNode === selection.focusNode
      && selection.anchorOffset === selection.focusOffset
    ) {
      const textField = document.getElementById(TEXT_FIELD_ID);
      let textStack = '';
      let startNodeIndex = null, startOffsetIndex = null;
      for (let index = 0; index < textField.childNodes.length; index++) {
        const currentNode = textField.childNodes[index];
        if (currentNode.nodeType === 3) {
          /* text node */
          let { textContent = '' } = currentNode;
          if (currentNode === selection.anchorNode) {
            textContent = textContent.slice(0, selection.anchorOffset);
          }
          if (textStack.length > 0) {
            textStack += textContent;
          } else if (textContent.indexOf('@') > -1) {
            textStack = textContent;
            startNodeIndex = index;
            startOffsetIndex = textContent.indexOf('@');
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
          const targetString = textStack ? textStack.slice(startOffsetIndex) : '';  // include template character
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
    const textField = document.getElementById(TEXT_FIELD_ID);
    if (!isEdit && textField?.innerText) {
      let message = '';
      let mentionTemplate = '';
      textField.childNodes.forEach((node) => {
        if (node.nodeType === 1 && node.nodeName === 'SPAN') { // element node (mention)
          const { innerText, dataset = {} } = node;
          const { userid = '' } = dataset;
          message += innerText;
          mentionTemplate += `${'@'}{${userid}}`;
        } else if (node.nodeType === 1 && node.nodeName === 'BR') {
          message += '\n';
          mentionTemplate += '\n';
          // FIXME: Display new line
        } else { // other nodes including text node
          const { textContent = '' } = node;
          message += textContent;
          mentionTemplate += textContent;
        }
      });
      const params = { message, mentionTemplate };
      onSendMessage(params);
      document.getElementById(TEXT_FIELD_ID).innerHTML = '';
    }
  };
  const editMessage = () => {
    const textField = document.getElementById(TEXT_FIELD_ID);
    const messageId = message?.messageId;
    if (isEdit && messageId) {
      let message = '';
      let mentionTemplate = '';
      textField.childNodes.forEach((node) => {
        if (node.nodeType === 1) { // element node (mention)
          const { innerText, dataset = {} } = node;
          const { userid = '' } = dataset;
          message += innerText;
          mentionTemplate += `${'@'}{${userid}}`;
        } else { // other nodes including text node
          const { textContent = '' } = node;
          message += textContent;
          mentionTemplate += textContent;
        }
      });
      const params = { messageId, message, mentionTemplate };
      onUpdateMessage(params);
      document.getElementById(TEXT_FIELD_ID).innerHTML = '';

      // const textField = document.getElementById(TEXT_FIELD_ID);
      // let message = '';
      // let mentionTemplate = '';
      // if (isMentionEnabled) {
      //   const htmlString = getHtmlStringFromNodes(textField, 0, textField, textField.childNodes.length);
      //   const templateList = htmlString.match(SPAN_TAG_REGEX).map((elementString) => {
      //     const frontTagLength = elementString.match(/<span.*?>/i)[0].length;
      //     const backTagLength = elementString.match(/<\/span>/i)[0].length;
      //     const innerText = elementString.slice(frontTagLength, elementString.length - backTagLength);
      //     return { text: `@${innerText}`, template: `@{${innerText}}` };
      //   });
      //   const stringList = htmlString.split(SPAN_TAG_REGEX);
      //   for (let i = 0; i < stringList.length; i++) {
      //     message += stringList[i];
      //     if (templateList[i]) {
      //       message += templateList[i].text;
      //     }
      //     mentionTemplate += stringList[i];
      //     if (templateList[i]) {
      //       mentionTemplate += templateList[i].template;
      //     }
      //   }
      // } else {
      //   const string = getStringFromNode(textField, 0, textField.childNodes.length);
      //   message = string;
      // }
      // onSendMessage(name, message, () => {
      //   onCancelEdit();
      // });
    }
  };

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
          id={TEXT_FIELD_ID}
          className="sendbird-message-input--textarea"
          contentEditable
          role="textbox"
          disabled={disabled}
          ref={ref}
          maxLength={maxLength}
          onKeyDown={(e) => {
            onKeyDown(e);
            if (e.keyCode === KeyCode.SHIFT) {
              setIsShiftPressed(true);
            }
            if (!isShiftPressed && e.keyCode === KeyCode.ENTER) {
              e.preventDefault();
              sendMessage();
            }
          }}
          onKeyUp={(e) => {
            onKeyUp(e);
            if (e.keyCode === KeyCode.SHIFT) {
              setIsShiftPressed(false);
            }
            const { start, end } = getSelectionCharacterOffsetWithin(document.getElementById(TEXT_FIELD_ID));
            if (start === end) {
              setCaretPosition(start);
            }
            useMentionInputDetection();
          }}
          onClick={() => {
            const { start, end } = getSelectionCharacterOffsetWithin(document.getElementById(TEXT_FIELD_ID));
            if (start === end) {
              setCaretPosition(start);
            }
            useMentionInputDetection();
          }}
          onInput={() => {
            setHeight();
            onStartTyping();
            setIsInput(document?.getElementById?.(TEXT_FIELD_ID)?.innerText?.length > 0);
            useMentionedLabelDetection();
          }}
        />
        {/* placeholder */}
        {!isInput && (
          <Label
            className="sendbird-message-input--placeholder"
            type={LabelTypography.BODY_1}
            color={LabelColors.ONBACKGROUND_3}
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
              <Icon type={IconTypes.SEND} fillColor={IconColors.PRIMARY} width="20px" height="20px" />
            </IconButton>
          )
        }
        {/* upload icon */}
        {
          (!isEdit && !isInput) && (
            <IconButton
              className="sendbird-message-input--attach"
              height="32px"
              width="32px"
              onClick={() => {
                // todo: clear previous input
                fileInputRef.current.click();
              }}
            >
              <Icon
                type={IconTypes.ATTACH}
                fillColor={IconColors.CONTENT_INVERSE}
                width="20px"
                height="20px"
              />
              <input
                className="sendbird-message-input--attach-input"
                type="file"
                ref={fileInputRef}
                onChange={handleUploadFile(onFileUpload)}
              />
            </IconButton>
          )
        }
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
  placeholder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  isEdit: PropTypes.bool,
  isMentionEnabled: PropTypes.bool,
  message: PropTypes.shape({
    messageId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  value: PropTypes.string,
  disabled: PropTypes.bool,
  maxLength: PropTypes.number,
  onFileUpload: PropTypes.func,
  onSendMessage: PropTypes.func,
  onUpdateMessage: PropTypes.func,
  onStartTyping: PropTypes.func,
  onCancelEdit: PropTypes.func,
  channelUrl: PropTypes.string,
  mentionSelectedUser: PropTypes.shape({
    userId: PropTypes.string,
    nickname: PropTypes.string,
  }),
  onUserMentioned: PropTypes.func,
  onMentionStringChange: PropTypes.func,
  onMentionedUserIdsUpdated: PropTypes.func,
  onKeyUp: PropTypes.func,
  onKeyDown: PropTypes.func,
};

MessageInput.defaultProps = {
  className: '',
  value: '',
  channelUrl: '',
  onSendMessage: noop,
  onUpdateMessage: noop,
  message: null,
  isEdit: false,
  isMentionEnabled: false,
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
};

export default MessageInput;
