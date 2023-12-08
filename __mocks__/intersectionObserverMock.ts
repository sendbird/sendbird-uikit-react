const intersectionObserverMock = () => ({
  observe: () => null,
  disconnect: () => null,
  unobserve: () => null,
});
global.IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMock);
