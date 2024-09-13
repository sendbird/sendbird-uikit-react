import React, { useState, useContext, useEffect, ChangeEventHandler } from 'react';
import './index.scss';

import MessageSearch, { MessageSearchUIProps } from './components/MessageSearchUI';
import { LocalizationContext } from '../../lib/LocalizationContext';
import Icon, { IconTypes, IconColors, IconProps } from '../../ui/Icon';
import Loader from '../../ui/Loader';
import { MessageSearchProvider, MessageSearchProviderProps } from './context/MessageSearchProvider';
import Header from '../../ui/Header';

export interface MessageSearchPannelProps extends MessageSearchUIProps, MessageSearchProviderProps {
  onCloseClick?: () => void;
}

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

  const handleOnChangeInputString: ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputString(e.target.value);
  };

  const handleOnResultLoaded = () => {
    setLoading(false);
  };

  const handleOnClickResetStringButton: IconProps['onClick'] = (e) => {
    e.stopPropagation();
    setInputString('');
    setSearchString('');
  };

  return (
    <div className="sendbird-message-search-pannel">
      <Header
        className="sendbird-message-search-pannel__header"
        renderMiddle={() => (
          <Header.Title title={stringSet.SEARCH_IN_CHANNEL} />
        )}
        renderRight={() => (
          <Header.IconButton
            className="sendbird-message-search-pannel__header__close-button"
            onClick={onCloseClick}
            type={IconTypes.CLOSE}
            color={IconColors.ON_BACKGROUND_1}
          />
        )}
      />
      <div className="sendbird-message-search-pannel__input">
        <div className="sendbird-message-search-pannel__input__container">
          <Icon
            className="sendbird-message-search-pannel__input__container__search-icon"
            type={IconTypes.SEARCH}
            fillColor={IconColors.ON_BACKGROUND_3}
            width="24px"
            height="24px"
          />
          <input
            className="sendbird-message-search-pannel__input__container__input-area"
            placeholder={stringSet.SEARCH}
            value={inputString}
            onChange={handleOnChangeInputString}
          />
          {
            inputString && loading && (
              <Loader
                className="sendbird-message-search-pannel__input__container__spinner"
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
                className="sendbird-message-search-pannel__input__container__reset-input-button"
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
      <div className="sendbird-message-search-pannel__message-search">
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
