import type { ReactElement } from 'react';
import GroupChannel, { type GroupChannelProps } from '@sendbird/uikit-react/GroupChannel';
import GroupChannelHeader, { type GroupChannelHeaderProps } from '@sendbird/uikit-react/GroupChannel/components/GroupChannelHeader';
import MessageInputWrapper from '@sendbird/uikit-react/GroupChannel/components/MessageInputWrapper';
import './layout.css';

type ReorderedChannelProps = Omit<GroupChannelProps, 'renderChannelHeader' | 'renderMessageInput'> & {
  renderChannelHeader?: (props: GroupChannelHeaderProps) => ReactElement | null;
  renderMessageInput?: () => ReactElement | null;
};

export function ReorderedChannel({ renderChannelHeader, renderMessageInput, ...props }: ReorderedChannelProps) {
  return (
    <div className="recipe-channel-layout">
      <GroupChannel {...props}
        renderChannelHeader={headerProps => <>
          {renderChannelHeader ? renderChannelHeader(headerProps) : <GroupChannelHeader {...headerProps} />}
          <div className="recipe-channel-composer">
            {renderMessageInput ? renderMessageInput() : <MessageInputWrapper {...props} />}
          </div>
        </>}
        renderMessageInput={() => <></>}
      />
    </div>
  );
}
