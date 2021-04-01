import { pubSubHandler, pubSubHandleRemover } from '../utils';
import * as topics from '../../../lib/pubSub/topics';
import pubsubFactory from '../../../lib/pubSub';

describe('PubSub', () => {
  it('should have all the required subscribers', () => {
    const pubsub = pubsubFactory();
    const mockChannelListDispatcher = () => {};
    const handler = pubSubHandler(pubsub, mockChannelListDispatcher);
    const createChannelHandler = handler.get(topics.CREATE_CHANNEL);
    const leaveChannelHandler = handler.get(topics.LEAVE_CHANNEL);
    expect(typeof createChannelHandler.remove).toEqual('function');
    expect(typeof leaveChannelHandler.remove).toEqual('function');
  });

  it('should have remove all subscribers', () => {
    const pubsub = pubsubFactory();
    const mockChannelListDispatcher = () => {};
    const handler = pubSubHandler(pubsub, mockChannelListDispatcher);
    pubSubHandleRemover(handler);
    expect(pubsub.__getTopics().CREATE_CHANNEL).toEqual([undefined]);
    expect(pubsub.__getTopics().LEAVE_CHANNEL).toEqual([undefined]);
  });
});
