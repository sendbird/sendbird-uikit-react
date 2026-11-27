import { PRODUCT_TYPE } from './product';

export type MessageKind = 'text' | 'file' | 'unknown' | 'malformed' | 'new' | 'edited';
export type SelectedChannel = 'workshop' | 'general';

export const channelNames = { workshop: 'Workshop', general: 'General' };
export const sentAt = Date.parse('2026-11-23T08:14:00Z');
export const author = { id: 'other', name: 'Alex' };
const plainText = 'Meeting at nine';
export const fileName = 'details.txt';
export { default as fileUrl } from './assets/details.txt?no-inline';
const unknownText = 'Unknown category fallback';
export const generalText = 'General notices';

export function messageData(kind: MessageKind) {
  if (kind === 'new' || kind === 'edited') {
    return {
      text: 'Product information',
      category: PRODUCT_TYPE,
      payload: { sku: 'DEMO-1', title: kind === 'new' ? 'Desk lamp' : 'Reading lamp' },
    };
  }
  if (kind === 'unknown') {
    return { text: unknownText, category: 'other-card', payload: { sku: 'IGNORE', title: 'Ignored card' } };
  }
  if (kind === 'malformed') {
    return { text: 'Malformed product fallback', category: PRODUCT_TYPE, invalidData: '{"sku":', payload: undefined };
  }
  if (kind === 'file') return { file: true, text: '' };
  return { text: plainText };
}
