import {
  fetchWithListQuery,
  isDisabledBecauseFrozen,
  isDisabledBecauseMuted,
  isOperator,
  kFormatter,
  scrollIntoLast,
  shouldFetchMore,
} from '../utils';

const createLogger = () => ({
  info: jest.fn(),
  warning: jest.fn(),
});

describe('OpenChannel context utils', () => {
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('decides whether more messages should be fetched', () => {
    expect(shouldFetchMore(10)).toBe(true);
    expect(shouldFetchMore(10, 11)).toBe(true);
    expect(shouldFetchMore(10, 10)).toBe(false);
  });

  it('scrolls a provided container to the bottom asynchronously', () => {
    jest.useFakeTimers();
    const scrollDOM = document.createElement('div');
    Object.defineProperty(scrollDOM, 'scrollHeight', { value: 240 });
    const ref = { current: scrollDOM };

    scrollIntoLast(0, ref);
    expect(scrollDOM.scrollTop).toBe(0);

    jest.runOnlyPendingTimers();

    expect(scrollDOM.style.overflow).toBe('auto');
    expect(scrollDOM.scrollTop).toBe(240);
  });

  it('falls back to querying the document and retries when no container exists', () => {
    jest.useFakeTimers();
    const scrollDOM = document.createElement('div');
    scrollDOM.className = 'sendbird-openchannel-conversation-scroll__container__item-container';
    Object.defineProperty(scrollDOM, 'scrollHeight', { value: 320 });
    document.body.appendChild(scrollDOM);

    scrollIntoLast(0, { current: null });
    jest.runOnlyPendingTimers();
    expect(scrollDOM.scrollTop).toBe(320);

    document.body.innerHTML = '';
    scrollIntoLast(11, { current: null });
    expect(jest.getTimerCount()).toBe(0);
  });

  it('formats large participant counts', () => {
    expect(kFormatter(999)).toBe('999');
    expect(kFormatter(1200)).toBe('1.2K');
    expect(kFormatter(-2500000)).toBe('2.5M');
  });

  it('evaluates operator, frozen, and muted states', () => {
    const channel = {
      operators: [{ userId: 'operator' }],
      isFrozen: true,
    } as any;

    expect(isOperator(channel, 'operator')).toBe(true);
    expect(isOperator(channel, 'member')).toBe(false);
    expect(isDisabledBecauseFrozen(channel, 'member')).toBe(true);
    expect(isDisabledBecauseFrozen(channel, 'operator')).toBe(false);
    expect(isDisabledBecauseFrozen(null, 'member')).toBe(false);
    expect(isDisabledBecauseMuted(['member'], 'member')).toBe(true);
    expect(isDisabledBecauseMuted(['member'], 'operator')).toBe(false);
  });

  it('fetches every page from a participant list query', async () => {
    const logger = createLogger();
    const callback = jest.fn();
    const pages = [[{ userId: 'one' }], [{ userId: 'two' }]];
    const query = {
      hasNext: true,
      next: jest.fn().mockImplementation(() => {
        const nextPage = pages.shift();
        query.hasNext = pages.length > 0;
        return Promise.resolve(nextPage);
      }),
    };

    fetchWithListQuery(query as any, logger as any, callback);
    await Promise.resolve();
    await Promise.resolve();

    expect(logger.info).toHaveBeenCalledWith('OpenChannel | FetchUserList start', query);
    expect(callback).toHaveBeenNthCalledWith(1, [{ userId: 'one' }]);
    expect(callback).toHaveBeenNthCalledWith(2, [{ userId: 'two' }]);
    expect(logger.info).toHaveBeenCalledWith('OpenChannel | FetchUserList finished');
  });

  it('logs participant list query failures', async () => {
    const logger = createLogger();
    const error = new Error('failed');
    const query = {
      hasNext: true,
      next: jest.fn().mockRejectedValue(error),
    };

    fetchWithListQuery(query as any, logger as any, jest.fn());
    await Promise.resolve();
    await Promise.resolve();

    expect(logger.warning).toHaveBeenCalledWith('OpenChannel | FetchUserList failed', error);
  });
});
