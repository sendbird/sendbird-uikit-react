import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';

import { LocalizationContext } from '../../../lib/LocalizationContext';
import Icon, { IconTypes, IconColors } from '../../../ui/Icon';

import './search-box.scss';

const EMPTY_STRING = '';
const COMPONENT_CLASS_NAME = 'sendbird-channel-search-box';

const SearchBox = ({ onChannelSearch, ...domAttributes }) => {
  const [channelSearchString, setChannelSearchString] = useState(EMPTY_STRING);
  const { stringSet } = useContext(LocalizationContext);

  const changeInputValue = value => {
    setChannelSearchString(value);
    onChannelSearch(value);
  };

  const handleOnChange = e => changeInputValue(e.target.value);
  const resetSearchString = () => changeInputValue(EMPTY_STRING);;

  return (
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
          type="text"
          className={`${COMPONENT_CLASS_NAME}__input__container__input-area`}
          placeholder={stringSet.SEARCH}
          value={channelSearchString}
          onChange={handleOnChange}
          {...domAttributes}
        />
        {channelSearchString && (
          <Icon
            className={`${COMPONENT_CLASS_NAME}__input__container__reset-input-button`}
            type={IconTypes.REMOVE}
            fillColor={IconColors.ON_BACKGROUND_3}
            width="20px"
            height="20px"
            onClick={resetSearchString}
          />
        )}
      </div>
    </div>
  );
};

SearchBox.propTypes = {
  channelSearchString: PropTypes.string,
  onChannelSearch: PropTypes.func,
};

SearchBox.defaultProps = {
  channelSearchString: '',
  onChannelSearch: () => {},
};

export default SearchBox;
