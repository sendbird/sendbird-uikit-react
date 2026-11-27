import { useState, type ComponentProps } from 'react';
import GroupChannel, { type GroupChannelProps } from '@sendbird/uikit-react/GroupChannel';
import { useGroupChannel } from '@sendbird/uikit-react/GroupChannel/context';
import { MessageInputWrapper } from '@sendbird/uikit-react/GroupChannel/components/MessageInputWrapper';
import './composer-tip.css';

export function ComposerWithWritingTip(props: ComponentProps<typeof MessageInputWrapper>) {
  const [showTip, setShowTip] = useState(false);
  const { state: { currentChannel } } = useGroupChannel();
  if (currentChannel?.isBroadcast && currentChannel.myRole !== 'operator') return null;
  return (
    <div className="composer-recipe">
      <MessageInputWrapper {...props} />
      <button className="recipe-action" type="button" aria-expanded={showTip}
        onClick={() => setShowTip((visible) => !visible)}>
        {showTip ? 'Hide writing tip' : 'Show writing tip'}
      </button>
      <p role="status">{showTip ? 'Start with the action you want the recipient to take.' : ''}</p>
    </div>
  );
}

// Mount inside the SendbirdProvider for your signed-in test app.
export function ComposerRecipeChannel(props: Omit<GroupChannelProps, 'renderMessageInput'>) {
  return <GroupChannel {...props} renderMessageInput={() => <ComposerWithWritingTip key={props.channelUrl} {...props} />} />;
}
