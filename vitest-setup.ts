/// <reference types="vitest/globals" />
import { vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import './__mocks__/intersectionObserverMock';
import '@testing-library/jest-dom';
import 'jest-extended/all';

// React Testing Library auto-unmount between tests (parity with Jest's auto-cleanup).
afterEach(() => {
  cleanup();
});

// Vitest reports unhandled rejections by default; registering our own handler makes
// it defer to us. @sendbird/chat keeps a WebSocket connection attempt alive past a
// test's unmount, which rejects with a "... is not defined" ReferenceError once the
// jsdom environment is torn down — a benign post-teardown leak that Jest hid via
// --forceExit. Swallow exactly those; re-throw anything else so real bugs still surface.
process.on('unhandledRejection', (reason) => {
  if (reason instanceof ReferenceError && /is not defined/.test(reason.message)) {
    return;
  }
  throw reason;
});

// `environment: 'jsdom'` provides window/document/navigator, so the manual JSDOM
// instantiation from the old jest-setup.js is dropped. We only re-create the
// extra globals/mocks the old setup added, to stay behavior-identical with Jest.

// The previous jest-setup forced a non-browser UA; preserve it.
Object.defineProperty(window.navigator, 'userAgent', { value: 'node.js', configurable: true });

// Deterministic rAF (and parity with fake timers) — same as old jest-setup.
globalThis.requestAnimationFrame = ((callback: FrameRequestCallback) => setTimeout(callback, 0)) as typeof requestAnimationFrame;
globalThis.cancelAnimationFrame = ((id: number) => clearTimeout(id)) as typeof cancelAnimationFrame;

// MediaRecorder + isTypeSupported are used within SendbirdProvider's voice-message logic.
class MockMediaRecorder {
  state: string;
  ondataavailable: ((e: Event) => void) | null;
  onerror: ((e: Event) => void) | null;
  onpause: ((e: Event) => void) | null;
  onresume: ((e: Event) => void) | null;
  onstart: ((e: Event) => void) | null;
  onstop: ((e: Event) => void) | null;

  static isTypeSupported(type: string) {
    const supportedMimeTypes = ['audio/webm', 'audio/wav'];
    return supportedMimeTypes.includes(type);
  }

  constructor() {
    this.state = 'inactive';
    this.ondataavailable = null;
    this.onerror = null;
    this.onpause = null;
    this.onresume = null;
    this.onstart = null;
    this.onstop = null;
  }

  start() {
    this.state = 'recording';
    if (this.onstart) this.onstart(new Event('start'));
  }

  stop() {
    this.state = 'inactive';
    if (this.onstop) this.onstop(new Event('stop'));
  }

  pause() {
    this.state = 'paused';
    if (this.onpause) this.onpause(new Event('pause'));
  }

  resume() {
    this.state = 'recording';
    if (this.onresume) this.onresume(new Event('resume'));
  }
}
globalThis.MediaRecorder = MockMediaRecorder as unknown as typeof MediaRecorder;

// jsdom (and Node 20) has no WebSocket; @sendbird/chat opens one during connect().
// Without this `new WebSocket()` throws "WebSocket is not defined", surfacing as an
// unhandled rejection after teardown (Jest hid these via --forceExit). The stub never
// opens, so the connection just pends harmlessly — same as before, minus the throw.
class MockWebSocket {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;
  readyState = MockWebSocket.CONNECTING;
  onopen: ((e: Event) => void) | null = null;
  onclose: ((e: Event) => void) | null = null;
  onerror: ((e: Event) => void) | null = null;
  onmessage: ((e: Event) => void) | null = null;
  send() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
}
globalThis.WebSocket = MockWebSocket as unknown as typeof WebSocket;

// Mock global fetch to prevent real network requests (Node 24+ has native fetch).
globalThis.fetch = vi.fn(() => Promise.resolve({
  ok: true,
  status: 200,
  json: () => Promise.resolve({}),
  text: () => Promise.resolve(''),
})) as unknown as typeof fetch;
