export const scenarios = ['ready', 'loading', 'empty', 'error', 'offline', 'typing'] as const;
export type Scenario = typeof scenarios[number];
export type Operation = { boundary: string; text: string };
export type RecordOperation = (event: Operation) => void;
export const channelName = 'Workshop';
export const startTime = Date.parse('2026-11-18T12:00:00Z');
export const history = Array.from({ length: 36 }, (_, index) =>
  `History ${String(index + 1).padStart(2, '0')} · Message loaded from the local fixture.`);
