import React, {
  useState,
  useRef,
  useEffect,
  useContext,
} from 'react';
import PropTypes from 'prop-types';

import './index.scss';

import IconButton from '../../../ui/IconButton';
import Button, { ButtonTypes, ButtonSizes } from '../../../ui/Button';

import Icon, { IconTypes, IconColors } from '../../../ui/Icon';
import Label, { LabelTypography, LabelColors } from '../../../ui/Label';
import { LocalizationContext } from '../../../lib/LocalizationContext';
// import IconSend from '../../svgs/icon-send.svg';
// import IconAttach from '../../svgs/icon-attach.svg';

const LINE_HEIGHT = 36;
const noop = () => { };
const KeyCode = {
  SHIFT: 16,
  ENTER: 13,
};

const handleUploadFile = (callback) => (event) => {
  if (event.target.files && event.target.files[0]) {
    callback(event.target.files[0]);
  }
  // eslint-disable-next-line no-param-reassign
  event.target.value = '';
};

const MessageInput = React.forwardRef((props, ref) => {
  const {
    isEdit,
    disabled,
    value,
    name,
    placeholder,
    maxLength,
    onFileUpload,
    onSendMessage,
    onCancelEdit,
    onStartTyping,
  } = props;

  const { stringSet } = useContext(LocalizationContext);
  const fileInputRef = useRef(null);
  const [inputValue, setInputValue] = useState(value);
  const [isShiftPressed, setIsShiftPressed] = useState(false);

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

  // after setHeight called twice, the textarea goes to the initialized
  useEffect(() => {
    setHeight();
    return setHeight;
  }, [inputValue]);

  const sendMessage = () => {
    if (inputValue && inputValue.trim().length > 0) {
      const trimmedInputValue = inputValue.trim();
      if (isEdit) {
        onSendMessage(name, trimmedInputValue, () => {
          onCancelEdit();
        });
      } else {
        onSendMessage(trimmedInputValue);
        setInputValue('');
      }
    }
  };

  return (
    <form
      className={[
        isEdit ? 'sendbird-message-input__edit' : '',
        disabled ? 'sendbird-message-input-form__disabled ' : '',
      ].join(' sendbird-message-input__container ')}
    >
      <div
        className={[
          'sendbird-message-input',
          disabled ? 'sendbird-message-input__disabled' : '',
        ].join(' ')}
      >
        <textarea
          className="sendbird-message-input--textarea"
          disabled={disabled}
          ref={ref}
          name={name}
          value={inputValue}
          maxLength={maxLength}
          onChange={(e) => {
            setInputValue(e.target.value);
            onStartTyping();
          }}
          onKeyDown={(e) => {
            if (e.keyCode === KeyCode.SHIFT) {
              setIsShiftPressed(true);
            }
            if (!isShiftPressed && e.keyCode === KeyCode.ENTER) {
              e.preventDefault();
              sendMessage();
            }
          }}
          onKeyUp={(e) => {
            if (e.keyCode === KeyCode.SHIFT) {
              setIsShiftPressed(false);
            }
          }}
        />
        {/* placeholder */}
        {!inputValue && (
          <Label
            className="sendbird-message-input--placeholder"
            type={LabelTypography.BODY_1}
            color={LabelColors.ONBACKGROUND_3}
          >
            {placeholder || stringSet.CHANNEL__MESSAGE_INPUT__PLACE_HOLDER}
          </Label>
        )}
        {/* send icon */}
        {/* {
          (!isEdit && inputValue && inputValue.trim().length > 0) && (
            <IconButton
              className="sendbird-message-input--send"
              height="32px"
              width="32px"
              onClick={sendMessage}
            >
              <Icon type={IconTypes.SEND} fillColor={IconColors.PRIMARY} width="20px" height="20px" />
            </IconButton>
          )
        } */}
        {/* upload icon */}
        {
          !isEdit && (
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

{
        !isEdit && (
          <IconButton
          className="sendbird-message-input--send"
          height="36px"
          width="36px"
          onClick={sendMessage}
          >
            <Icon type={IconTypes.SEND} fillColor={IconColors.WHITE} width="20px" height="20px" />
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
              onClick={() => {
                if (inputValue) {
                  const trimmedInputValue = inputValue.trim();
                  onSendMessage(name, trimmedInputValue, () => {
                    onCancelEdit();
                  });
                }
              }}
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
  placeholder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  isEdit: PropTypes.bool,
  name: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  value: PropTypes.string,
  disabled: PropTypes.bool,
  maxLength: PropTypes.number,
  onFileUpload: PropTypes.func,
  onSendMessage: PropTypes.func,
  onStartTyping: PropTypes.func,
  onCancelEdit: PropTypes.func,
};

MessageInput.defaultProps = {
  value: '',
  onSendMessage: noop,
  name: 'sendbird-message-input',
  isEdit: false,
  disabled: false,
  placeholder: '',
  maxLength: 5000,
  onFileUpload: noop,
  onCancelEdit: noop,
  onStartTyping: noop,
};

export default MessageInput;
