import React from 'react';
import PropTypes from 'prop-types';

import DefaultChannelPreview from '../ChannelPreview';
import ChannelPreviewAction from '../../smart-components/ChannelList/components/ChannelPreviewAction';

// Legacy
export default function ChannelList({ channels, ChannelPreview }) {
  return (
    <div
      className="sendbird-channel-list-dummy"
      style={{ maxWidth: '320px' }}
    >
      {
        channels.map((channel, idx) => (
          <div key={channel.url}>
            <ChannelPreview
              channel={channel}
              isActive={idx === 0}
              ChannelAction={
                () => (
                  <ChannelPreviewAction
                    channel={channel}
                    channelsDispatcher={() => { }}
                  />
                )
              }
            />
          </div>
        ))
      }
    </div>
  );
}

ChannelList.propTypes = {
  channels: PropTypes.arrayOf(PropTypes.shape({})),
  ChannelPreview: PropTypes.element,
};

ChannelList.defaultProps = {
  channels: [],
  ChannelPreview: DefaultChannelPreview,
};
