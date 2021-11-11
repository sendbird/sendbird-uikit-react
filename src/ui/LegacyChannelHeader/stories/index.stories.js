import React from 'react';
import ChannelHeader from '../index.jsx';

import IconButton from '../../IconButton';
import CreateGroupChannelIcon from '../../../svgs/icon-create.svg';

export default { title: 'UI Components/ChannelHeader' };

export const withText = () => {
  return (
    <ChannelHeader
      iconButton={
        <IconButton
          height={'34px'} width={'34px'}>
          <CreateGroupChannelIcon />
        </IconButton>
      } />
  );
};
