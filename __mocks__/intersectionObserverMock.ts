class MockIntersectionObserver {
  callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe() {
    // @ts-ignore
    this.callback([{ isIntersecting: true }], this);
  }

  disconnect() {
    // noop
  }

  unobserve() {
    // noop
  }
}

global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
