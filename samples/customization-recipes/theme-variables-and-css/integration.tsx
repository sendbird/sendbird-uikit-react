import type { ComponentProps } from 'react';
import GroupChannel from '@sendbird/uikit-react/GroupChannel';
// Load after @sendbird/uikit-react/dist/index.css, which your app imports once at its CSS entry.
import './theme.css';

// Render this under your existing light-theme SendbirdProvider.
export function BrandedConversation({ channelUrl, className, ...sectionProps }:
  Omit<ComponentProps<'section'>, 'children'> & { channelUrl: string }) {
  return (
    <section {...sectionProps} className={`branded-chat target${className ? ` ${className}` : ''}`}>
      <GroupChannel channelUrl={channelUrl} />
    </section>
  );
}
