import type { ComponentProps } from 'react';
import GroupChannel from '@sendbird/uikit-react/GroupChannel';
// Load after @sendbird/uikit-react/dist/index.css, which your app imports once at its CSS entry.
import './theme.css';

export type ThemeMode = 'default' | 'tokens' | 'target';

// Render this under your existing light-theme SendbirdProvider. Children let the local fixture
// exercise the same wrapper and CSS without replacing its synthetic messages and composer.
export function BrandedConversation({ channelUrl, children, mode = 'target', className, ...sectionProps }:
  ComponentProps<'section'> & { channelUrl: string; mode?: ThemeMode }) {
  return (
    <section {...sectionProps} className={`branded-chat ${mode}${className ? ` ${className}` : ''}`}>
      {children === undefined ? <GroupChannel channelUrl={channelUrl} /> : children}
    </section>
  );
}
