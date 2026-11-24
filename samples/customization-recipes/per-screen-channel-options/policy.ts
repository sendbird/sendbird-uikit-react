export type ScreenId = 'A' | 'B';
export type Operation = {
  screen: ScreenId;
  operation: 'addReaction' | 'deleteReaction' | 'sendUserMessage';
  messageId?: number;
  emoji?: string;
  text?: string;
  replyTo?: number;
};
export type RecordOperation = (event: Operation) => void;

export const categories = [
  { id: 1, name: 'Gesture', key: 'like', emoji: '👍' },
  { id: 2, name: 'Heart', key: 'love', emoji: '❤️' },
  { id: 3, name: 'Celebrate', key: 'celebrate', emoji: '🎉' },
] as const;

export const [gesture, , celebrate] = categories;

export const screenPolicy = {
  A: { isReactionEnabled: true, replyType: 'QUOTE_REPLY', categoryId: gesture.id },
  B: { isReactionEnabled: false, replyType: 'NONE' },
} as const;
