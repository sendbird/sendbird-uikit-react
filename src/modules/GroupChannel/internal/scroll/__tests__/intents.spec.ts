/**
 * Phase 3 — intent type exhaustiveness sanity check.
 */
import { ALL_SCROLL_INTENT_TYPES } from '../intents';

describe('Phase 3 — scroll intent types', () => {
  it('ALL_SCROLL_INTENT_TYPES enumerates the 5 documented variants', () => {
    expect(ALL_SCROLL_INTENT_TYPES.length).toBe(5);
    for (const t of ALL_SCROLL_INTENT_TYPES) {
      expect(t).toMatch(/^[A-Z_]+$/);
    }
    expect([...ALL_SCROLL_INTENT_TYPES].sort()).toEqual([
      'NONE',
      'PRESERVE_ANCHOR',
      'RESTORE_AFTER_RESIZE',
      'TO_BOTTOM',
      'TO_MESSAGE',
    ]);
  });
});
