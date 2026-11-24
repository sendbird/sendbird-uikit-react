import { useState } from 'react';
import GroupChannel from '@sendbird/uikit-react/GroupChannel';
import { MessageInputWrapper } from '@sendbird/uikit-react/GroupChannel/components/MessageInputWrapper';

export function ComposerWithWritingTip() {
  const [showTip, setShowTip] = useState(false);
  return (
    <div className="composer-recipe">
      <MessageInputWrapper />
      <button className="recipe-action" type="button" aria-expanded={showTip}
        onClick={() => setShowTip((visible) => !visible)}>
        {showTip ? 'Hide writing tip' : 'Show writing tip'}
      </button>
      <p role="status">{showTip ? 'Start with the action you want the recipient to take.' : ''}</p>
    </div>
  );
}

// Mount inside the SendbirdProvider for your signed-in test app.
export function ComposerRecipeChannel({ channelUrl }: { channelUrl: string }) {
  return <GroupChannel channelUrl={channelUrl} renderMessageInput={() => <ComposerWithWritingTip />} />;
}
