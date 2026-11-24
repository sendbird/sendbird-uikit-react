export const channelTitle = 'Upgrade Lab';
export const messageText = 'Meet at the upgrade lab at noon.';
export const timestamp = Date.parse('2026-11-18T12:34:56Z');
export const userId = 'self';
export const senderId = 'other';
export type Observation =
  | { action: 'reaction-added' | 'reaction-removed'; messageId: number | string; key: string }
  | { action: 'send'; text: string }
  | { action: 'preview-selected' };
