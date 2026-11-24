import { categories } from '../shared/group-channel-fixture';

export const [gesture, , celebrate] = categories;

export const screenPolicy = {
  A: { isReactionEnabled: true, replyType: 'QUOTE_REPLY', categoryId: gesture.id },
  B: { isReactionEnabled: false, replyType: 'NONE' },
} as const;
