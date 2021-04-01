import pubsubFactory from '../index';

describe('PubSub', () => {
  it('should create a pubsub object with subscribe and publish', () => {
    const pubsub = pubsubFactory();
    expect(typeof pubsub.subscribe).toEqual('function');
    expect(typeof pubsub.publish).toEqual('function');
  });

  it('should be able to subscribe to a topic', (done) => {
    const pubsub = pubsubFactory();
    const topic = "TOPIC";
    const event = { event: "event" };
    pubsub.subscribe(topic, (event) => {
      expect(event).toBe(event);
      done();
    });
    pubsub.publish(topic, event);
  });

  it('should be able to unsubscribe from a topic', () => {
    const pubsub = pubsubFactory();
    const topic = "TOPIC";
    const sub = pubsub.subscribe(topic);
    sub.remove();
    // list of topics -> empty
    expect(pubsub.__getTopics()).toEqual({[topic]: [undefined]});
  });
});
