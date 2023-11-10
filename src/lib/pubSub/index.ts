// we use pubsub to sync events between multiple components(example - ChannelList, Channel)
// for example, if customer sends a message from their custom component
// without pubsub,we would not be able to listen to it
// in our ChannelList or Conversation

export type PubSubTypes<
  T extends keyof any,
  U extends { topic: T; payload: any }
> = {
  __getTopics: () => Record<T, Set<(data: PayloadByTopic<T, U>) => void>>;
  subscribe: <K extends T>(
    topic: K,
    subscriber: (data: PayloadByTopic<K, U>) => void
  ) => { remove: () => void };
  publish: <K extends T>(topic: K, data: PayloadByTopic<K, U>) => void;
};

type PayloadByTopic<T extends keyof any, U> = U extends {
  topic: T;
  payload: infer P;
}
  ? P
  : never;

const pubSubFactory = <
  T extends keyof any = keyof any,
  U extends { topic: T; payload: any } = any
>(): PubSubTypes<T, U> => {
  const topics = {} as Record<T, Set<(data: any) => void>>;

  return {
    __getTopics: () => topics,
    subscribe: (topic, listener) => {
      topics[topic] ??= new Set();
      topics[topic].add(listener);
      return {
        remove: () => {
          topics[topic].delete(listener);
        },
      };
    },
    publish: (topic, info) => {
      if (topics[topic]) {
        topics[topic].forEach((fn) => {
          setTimeout(() => fn(info !== undefined ? info : {}), 0);
        });
      }
    },
  };
};

export default pubSubFactory;
