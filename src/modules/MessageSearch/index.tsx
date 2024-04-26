import React, { useState, useContext, useEffect } from 'react';
import './index.scss';

import MessageSearch, { MessageSearchUIProps } from './components/MessageSearchUI';
import { LocalizationContext } from '../../lib/LocalizationContext';
import Icon, { IconTypes, IconColors } from '../../ui/Icon';
import IconButton from '../../ui/IconButton';
import Loader from '../../ui/Loader';
import { MessageSearchProvider, MessageSearchProviderProps } from './context/MessageSearchProvider';
import Header from '../../ui/Header';

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

  let timeout: any = null;
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
      <Header
        className={`${COMPONENT_CLASS_NAME}__header`}
        renderMiddle={() => (
          <Header.Title title={stringSet.SEARCH_IN_CHANNEL} />
        )}
        renderRight={() => (
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
        )}
      />
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
