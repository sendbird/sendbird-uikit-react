import React, { useState, useContext, useEffect } from 'react';
import './index.scss';

import MessageSearch, { MessageSearchUIProps } from './components/MessageSearchUI';
import { LocalizationContext } from '../../lib/LocalizationContext';
import Icon, { IconTypes, IconColors } from '../../ui/Icon';
import IconButton from '../../ui/IconButton';
import Label, { LabelTypography, LabelColors } from '../../ui/Label';
import Loader from '../../ui/Loader';
import { MessageSearchProvider, MessageSearchProviderProps } from './context/MessageSearchProvider';

export interface MessageSearchPannelProps extends
  MessageSearchUIProps, MessageSearchProviderProps {
  onResultClick?: (message) => void;
  onCloseClick?: () => void;
}

const COMPONENT_CLASS_NAME = 'sendbird-message-search-pannel';

function MessageSearchPannel(props: MessageSearchPannelProps): JSX.Element {
  const {
    channelUrl,
    onResultClick,
    onCloseClick,
    messageSearchQuery,
    renderPlaceHolderError,
    renderPlaceHolderLoading,
    renderPlaceHolderNoString,
    renderPlaceHolderEmptyList,
    renderSearchItem,
  } = props;

  const [searchString, setSearchString] = useState('');
  const [inputString, setInputString] = useState('');
  const [loading, setLoading] = useState(false);
  const { stringSet } = useContext(LocalizationContext);

  let timeout = null;
  useEffect(() => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      setSearchString(inputString);
      setLoading(true);
      timeout = null;
    }, 500);
  }, [inputString]);

  const handleOnChangeInputString = (e) => {
    setInputString(e.target.value);
  };

  const handleOnResultLoaded = () => {
    setLoading(false);
  };

  const handleOnClickResetStringButton = (e) => {
    e.stopPropagation();
    setInputString('');
    setSearchString('');
  };

  return (
    <div className={COMPONENT_CLASS_NAME}>
      <div className={`${COMPONENT_CLASS_NAME}__header`}>
        <Label
          className={`${COMPONENT_CLASS_NAME}__header__title`}
          type={LabelTypography.H_2}
          color={LabelColors.ONBACKGROUND_1}
        >
          {stringSet.SEARCH_IN_CHANNEL}
        </Label>
        <IconButton
          className={`${COMPONENT_CLASS_NAME}__header__close-button`}
          width="32px"
          height="32px"
          onClick={onCloseClick}
        >
          <Icon
            type={IconTypes.CLOSE}
            fillColor={IconColors.ON_BACKGROUND_1}
            width="22px"
            height="22px"
          />
        </IconButton>
      </div>
      <div className={`${COMPONENT_CLASS_NAME}__input`}>
        <div className={`${COMPONENT_CLASS_NAME}__input__container`}>
            <Icon
              className={`${COMPONENT_CLASS_NAME}__input__container__search-icon`}
              type={IconTypes.SEARCH}
              fillColor={IconColors.ON_BACKGROUND_3}
              width="24px"
              height="24px"
            />
            <input
              className={`${COMPONENT_CLASS_NAME}__input__container__input-area`}
              placeholder={stringSet.SEARCH}
              value={inputString}
              onChange={handleOnChangeInputString}
            />
            {
              inputString && loading && (
                <Loader
                  className={`${COMPONENT_CLASS_NAME}__input__container__spinner`}
                  width="20px"
                  height="20px"
                >
                  <Icon
                    type={IconTypes.SPINNER}
                    fillColor={IconColors.PRIMARY}
                    width="20px"
                    height="20px"
                  />
                </Loader>
              )
            }
            {
              !loading && inputString && (
                <Icon
                  className={`${COMPONENT_CLASS_NAME}__input__container__reset-input-button`}
                  type={IconTypes.REMOVE}
                  fillColor={IconColors.ON_BACKGROUND_3}
                  width="20px"
                  height="20px"
                  onClick={handleOnClickResetStringButton}
                />
              )
            }
        </div>
      </div>
      <div className={`${COMPONENT_CLASS_NAME}__message-search`}>
        <MessageSearchProvider
          channelUrl={channelUrl}
          searchString={searchString}
          onResultClick={onResultClick}
          onResultLoaded={handleOnResultLoaded}
          messageSearchQuery={messageSearchQuery}
        >
          <MessageSearch
            renderPlaceHolderError={renderPlaceHolderError}
            renderPlaceHolderLoading={renderPlaceHolderLoading}
            renderPlaceHolderNoString={renderPlaceHolderNoString}
            renderPlaceHolderEmptyList={renderPlaceHolderEmptyList}
            renderSearchItem={renderSearchItem}
          />
        </MessageSearchProvider>
      </div>
    </div>
  );
}

export default MessageSearchPannel;
