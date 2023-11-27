import React from 'react';

import { ChannelListHeaderView } from './ChannelListHeaderView';
import './index.scss';

interface ChannelListHeaderProps {
  renderTitle?: () => React.ReactElement;
  renderIconButton?: (props: void) => React.ReactElement;
  onEdit?: (props: void) => void;
  allowProfileEdit?: boolean;
}

const ChannelListHeader = (props: ChannelListHeaderProps) => {
  return <ChannelListHeaderView {...props} />;
};

export default ChannelListHeader;
