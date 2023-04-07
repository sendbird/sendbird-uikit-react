import { GroupChannel } from '@sendbird/chat/groupChannel';

import { schedulerFactory } from '../useMarkAsReadScheduler';
import { LoggerFactory } from '../../Logger';

jest.useFakeTimers();
jest.spyOn(global, 'setInterval');

const logger = LoggerFactory('info');

describe('schedulerFactory', () => {
  it('should return a scheduler with push and clear methods', () => {
    const scheduler = schedulerFactory(logger, 200);
    expect(scheduler.push).toBeDefined();
    expect(scheduler.clear).toBeDefined();
  });

  it('should clear timeout when cleared', () => {
    const scheduler = schedulerFactory(logger, 200);
    const channel = { markAsRead: jest.fn() } as unknown as GroupChannel;
    scheduler.push(channel);
    scheduler.push(channel);
    scheduler.clear();
    expect(scheduler.getQueue().length).toBe(0);
  });

  it('should call markAsRead on intervals', () => {
    const scheduler = schedulerFactory(logger, 200);
    const channel1 = { markAsRead: jest.fn(), url:'123' } as unknown as GroupChannel;
    const channel2 = { markAsRead: jest.fn(), url:'124' } as unknown as GroupChannel;
    scheduler.push(channel1);
    scheduler.push(channel2);
    jest.advanceTimersByTime(1000);
    expect(channel1.markAsRead).toHaveBeenCalledTimes(1);
    expect(channel2.markAsRead).toHaveBeenCalledTimes(1);
    expect(scheduler.getQueue().length).toBe(0);
  });

  it('should not push duplicate channel to queue', () => {
    const scheduler = schedulerFactory(logger, 200);
    const channel1 = { markAsRead: jest.fn(), url:'123' } as unknown as GroupChannel;
    const channel2 = { markAsRead: jest.fn(), url:'123' } as unknown as GroupChannel;
    scheduler.push(channel1);
    scheduler.push(channel2);
    expect(scheduler.getQueue().length).toBe(1);
    jest.advanceTimersByTime(1000);
    expect(channel1.markAsRead).toHaveBeenCalledTimes(1);
    expect(channel2.markAsRead).toHaveBeenCalledTimes(0);
    expect(scheduler.getQueue().length).toBe(0);
  });
});
