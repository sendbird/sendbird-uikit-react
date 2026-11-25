import GroupChannel, { type GroupChannelProps } from '@sendbird/uikit-react/GroupChannel';
import GroupChannelHeader from '@sendbird/uikit-react/GroupChannel/components/GroupChannelHeader';
import MessageInputWrapper from '@sendbird/uikit-react/GroupChannel/components/MessageInputWrapper';
import './layout.css';

export function ReorderedChannel({ renderChannelHeader, renderMessageInput, ...props }: GroupChannelProps) {
  return (
    <div className="recipe-channel-layout">
      <GroupChannel {...props}
        renderChannelHeader={headerProps => <>
          {renderChannelHeader?.(headerProps) ?? <GroupChannelHeader {...headerProps} />}
          <div className="recipe-channel-composer">
            {renderMessageInput?.() ?? <MessageInputWrapper {...props} />}
          </div>
        </>}
        renderMessageInput={() => <></>}
      />
    </div>
  );
}
