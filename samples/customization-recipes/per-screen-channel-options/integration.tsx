import { useMemo, type PropsWithChildren } from 'react';
import { GroupChannelProvider, type GroupChannelProviderProps } from '@sendbird/uikit-react/GroupChannel/context';
import GroupChannelUI from '@sendbird/uikit-react/GroupChannel/components/GroupChannelUI';

type ScreenProps = Pick<GroupChannelProviderProps, 'channelUrl' | 'isReactionEnabled' | 'replyType'> & {
  /** Emoji category offered in this screen's reaction picker; omit to offer every category. */
  categoryId?: number;
};

function MountedScreen({ channelUrl, isReactionEnabled, replyType, categoryId, children }: PropsWithChildren<ScreenProps>) {
  const filter = useMemo(() => (categoryId === undefined ? undefined : () => [categoryId]), [categoryId]);
  return <GroupChannelProvider channelUrl={channelUrl}
    isReactionEnabled={isReactionEnabled} replyType={replyType}
    filterEmojiCategoryIds={filter}>
    {children}
    <GroupChannelUI />
  </GroupChannelProvider>;
}

// Render each screen under the app's single SendbirdProvider.
// A mounted screen's reaction picker keeps its first emoji category in UIKit 3.20.1, so a new
// category preset gets a new key. Only that screen's GroupChannelProvider remounts.
export function ChannelScreen(props: PropsWithChildren<ScreenProps>) {
  return <MountedScreen key={`${props.channelUrl}:${props.categoryId}`} {...props} />;
}
