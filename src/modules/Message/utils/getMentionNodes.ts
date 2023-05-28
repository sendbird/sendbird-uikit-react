export function getMentionNodes(root: HTMLElement): Element[] {
  if (root) {
    const mentions = root.querySelectorAll("[data-sb-mention='true']");
    const mentionsArray = Array.from(mentions);
    return mentionsArray;
  }
  return [];
}
