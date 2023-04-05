// this function is used to generate a unique key for token in message
// it changes with updated time and index
// messageUpdatedAt is the key part of this key generator
export function keyGenerator(
  createdAt: number,
  messageUpdatedAt: number,
  index: number,
): string {
  return `sb-msg_${createdAt}_${messageUpdatedAt}_${index}`;
}
