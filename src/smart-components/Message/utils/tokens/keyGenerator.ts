export function keyGenerator(
  createdAt: number,
  messageUpdatedAt: number,
  index: number,
) {
  return `sb-msg_${createdAt}_${messageUpdatedAt}_${index}`;
}
