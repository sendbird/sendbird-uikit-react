import { GroupChannel } from '@sendbird/chat/groupChannel';

import { schedulerFactory } from '../schedulerFactory';
import { LoggerFactory } from '../../Logger';
import { Logger } from '../../SendbirdState';

jest.useFakeTimers();
jest.spyOn(global, 'setInterval');

const logger = LoggerFactory('info') as Logger;

describe('schedulerFactory', () => {
  it('should return a scheduler with push and clear methods', () => {
    const scheduler = schedulerFactory({
      logger,
      timeout: 200,
      cb: () => { /* noop */ },
    });
    expect(scheduler.push).toBeDefined();
    expect(scheduler.clear).toBeDefined();
  });

  it('should simulate a prefix-scheduler', () => {
    const scheduler = schedulerFactory({
      logger,
      timeout: 200,
      cb: (channel: GroupChannel) => { channel.markAsRead(); },
    });
    // if queue is empty, push should call cb immediately
    const channel = { markAsRead: jest.fn() } as unknown as GroupChannel;
    scheduler.push(channel);
    expect(channel.markAsRead).toHaveBeenCalledTimes(1);

    // becuase there is a timeout, markAsRead should not be called immediately
    const channel2 = { markAsRead: jest.fn() } as unknown as GroupChannel;
    scheduler.push(channel2);
    expect(channel2.markAsRead).toHaveBeenCalledTimes(0);
    jest.advanceTimersByTime(1000);
    expect(channel2.markAsRead).toHaveBeenCalledTimes(1);

    // if queue is empty(& timeout is cleared), push should call cb immediately
    jest.advanceTimersByTime(1000);
    const channel3 = { markAsRead: jest.fn() } as unknown as GroupChannel;
    scheduler.push(channel3);
    expect(channel3.markAsRead).toHaveBeenCalledTimes(1);
  });

  it('should clear timeout when cleared', () => {
    const scheduler = schedulerFactory({
      logger,
      timeout: 200,
      cb: () => { /* noop */ },
    });
    const channel = { markAsRead: jest.fn() } as unknown as GroupChannel;
    scheduler.push(channel);
    scheduler.push(channel);
    scheduler.clear();
    expect(scheduler.getQueue().length).toBe(0);
  });

  it('should call markAsRead on intervals', () => {
    const scheduler = schedulerFactory<GroupChannel>({
      logger,
      timeout: 200,
      cb: (c) => { c.markAsRead(); },
    });
    const channel1 = { markAsRead: jest.fn(), url: '123' } as unknown as GroupChannel;
    const channel2 = { markAsRead: jest.fn(), url: '124' } as unknown as GroupChannel;
    scheduler.push(channel1);
    scheduler.push(channel2);
    jest.advanceTimersByTime(1000);
    expect(channel1.markAsRead).toHaveBeenCalledTimes(1);
    expect(channel2.markAsRead).toHaveBeenCalledTimes(1);
    expect(scheduler.getQueue().length).toBe(0);
  });

  it('should not push duplicate channel to queue', () => {
    const scheduler = schedulerFactory<GroupChannel>({
      logger,
      timeout: 200,
      cb: (c) => { c.markAsRead(); },
    });
    const channel1 = { markAsRead: jest.fn(), url: '123' } as unknown as GroupChannel;
    const channel2 = { markAsRead: jest.fn(), url: '123' } as unknown as GroupChannel;
    scheduler.push(channel1);
    scheduler.push(channel2);
    expect(scheduler.getQueue().length).toBe(1);
    expect(channel1.markAsRead).toHaveBeenCalledTimes(1);
    expect(channel2.markAsRead).toHaveBeenCalledTimes(0);
    jest.advanceTimersByTime(1000);
    expect(scheduler.getQueue().length).toBe(0);
  });
});
