import './__mocks__/intersectionObserverMock';
import '@testing-library/jest-dom';

const { JSDOM } = require('jsdom');

// for mount
const jsdom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost' });
const { window } = jsdom;

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  });
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
global.requestAnimationFrame = function (callback) {
  return setTimeout(callback, 0);
};
global.cancelAnimationFrame = function (id) {
  clearTimeout(id);
};
class MockMediaRecorder {
  static isTypeSupported(type) {
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

global.MediaRecorder = MockMediaRecorder;

copyProps(window, global);
