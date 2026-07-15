// `ws` ships no bundled types and @types/ws is not a dependency; it is only used as a Node
// WebSocket polyfill in global-setup.ts. Declaring it here keeps the editor/tsc quiet.
declare module 'ws';
