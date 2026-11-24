import GroupChannel from '@sendbird/uikit-react/GroupChannel';
// Load after @sendbird/uikit-react/dist/index.css, which your app imports once at its CSS entry.
import './theme.css';

// Render this under your existing light-theme SendbirdProvider.
// "target" applies both the color variables and the scoped geometry rules from theme.css.
export function BrandedConversation({ channelUrl }: { channelUrl: string }) {
  return (
    <section className="branded-chat target">
      <GroupChannel channelUrl={channelUrl} />
    </section>
  );
}
