global.IntersectionObserver = class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
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
