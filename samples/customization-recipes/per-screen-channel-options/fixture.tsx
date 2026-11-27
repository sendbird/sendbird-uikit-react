import { useSendbird } from '@sendbird/uikit-react';
import { useGroupChannel } from '@sendbird/uikit-react/GroupChannel/context';

export function ResolvedOptions() {
  const { state } = useGroupChannel();
  const { state: { config } } = useSendbird();
  return <output hidden data-testid="resolved-options"
    data-reactions={String(state.isReactionEnabled)} data-reply={state.replyType}
    data-mention={String(config.groupChannel.enableMention)} data-user={config.userId} />;
}
