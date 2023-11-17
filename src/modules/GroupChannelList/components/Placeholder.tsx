import React from 'react';

import Placeholder, { PlaceHolderTypes } from '../../../ui/PlaceHolder';

type ChannelsPlaceholderProps = {
  type: keyof typeof PlaceHolderTypes;
};

// MARK: Unused component
export default function ChannelsPlaceholder({ type }: ChannelsPlaceholderProps) {
  return (
    <div className="sendbird-channel-list">
      <Placeholder type={type} />
    </div>
  );
}
