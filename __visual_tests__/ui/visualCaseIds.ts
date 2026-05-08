export const UI_VISUAL_CASE_IDS = [
  'message-text-states',
  'message-text-overflow',
  'message-admin-separators',
  'message-status-states',
  'message-placeholder-connection',
  'thread-reply-summary',
  'thread-reply-overflow',
  'reaction-button-states',
  'reaction-badge-strip',
  'quote-message-states',
  'message-input-compose',
  'message-input-edit',
  'message-input-disabled',
  'context-menu-actions',
  'bottom-sheet-actions',
  'channel-list-shell',
  'group-channel-shell',
  'open-channel-shell',
  'channel-settings-shell',
  'toolbar-controls',
  'theme-dark-message-cases',
] as const;

export const UI_VISUAL_MOBILE_SMOKE_CASE_IDS = [
  'message-text-overflow',
  'reaction-badge-strip',
  'message-input-compose',
  'bottom-sheet-actions',
  'channel-list-shell',
  'group-channel-shell',
] as const;

export type UiVisualCaseId = typeof UI_VISUAL_CASE_IDS[number];
