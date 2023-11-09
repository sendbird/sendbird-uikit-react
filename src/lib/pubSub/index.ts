// we use pubsub to sync events between multiple components(example - ChannelList, Channel)
// for example, if customer sends a message from their custom component
// without pubsub,we would not be able to listen to it
// in our ChannelList or Conversation

export type PubSubTypes<T, U extends { topic: T; payload: any }> = {
  __getTopics: () => Record<string, Set<(data: PayloadByTopic<T, U>) => void>>;
  subscribe: <V extends T>(
    topic: V,
    subscriber: (data: PayloadByTopic<V, U>) => void
  ) => { remove: () => void };
  publish: <V extends T>(topic: V, data: PayloadByTopic<V, U>) => void;
};

type PayloadByTopic<T, U> = U extends {
  topic: T;
  payload: infer P;
}
  ? P
  : never;

const pubSubFactory = <
  T = any,
  U extends { topic: T; payload: any } = any
>(): PubSubTypes<T, U> => {
  const topics: Record<string, Set<(data: any) => void>> = {};

  return {
    __getTopics: () => topics,
    subscribe: (topic, listener) => {
      topics[topic as unknown as string] ??= new Set();
      topics[topic as unknown as string].add(listener);
      return {
        remove: () => {
          topics[topic as unknown as string].delete(listener);
        },
      };
    },
    publish: (topic, info) => {
      if (topics[topic as unknown as string]) {
        topics[topic as unknown as string].forEach((fn) => {
          setTimeout(() => fn(info !== undefined ? info : {}), 0);
        });
      }
    },
  };
};

export default pubSubFactory;
