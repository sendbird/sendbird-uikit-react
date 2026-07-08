// Ambient declarations for non-code imports so `tsc --noEmit` can resolve them
// (at runtime these are stubbed by __mocks__/styleMock.js and __mocks__/fileMock.js,
// and by the Rollup asset plugins in the build). `*.svg` is declared in types/svg.
declare module '*.scss';
declare module '*.css';
declare module '*.less';
declare module '*.sass';
declare module '*.gif';
declare module '*.ttf';
declare module '*.eot';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
