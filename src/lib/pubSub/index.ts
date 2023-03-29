// https://davidwalsh.name/pubsub-javascript
// we use pubsub to sync events between multiple components(example - ChannelList, Channel)
// for example, if customer sends a message from their custom component
// without pubsub,we would not be able to listen to it
// in our ChannelList or Conversation

interface PubSubTypes {
  __getTopics: () => Record<string, string>;
  subscribe: (topic: string, listener: unknown) => { remove: () => void };
  publish: (topic: string, info: unknown) => void;
}

const pubSubFactory = (): PubSubTypes => {
  const topics = {};
  const hOP = topics.hasOwnProperty;

  return {
    __getTopics: () => topics,
    subscribe: (topic, listener) => {
      // Create the topic's object if not yet created
      if (!hOP.call(topics, topic)) { topics[topic] = []; }

      // Add the listener to queue
      const index = topics[topic].push(listener) - 1;

      // Provide handle back for removal of topic
      return {
        remove: () => {
          delete topics[topic][index];
        },
      };
    },
    publish: (topic, info) => {
      // If the topic doesn't exist, or there's no listeners in queue, just leave
      if (!hOP.call(topics, topic)) { return; }

      // Cycle through topics queue, fire!
      topics[topic].forEach((item) => {
        item(info !== undefined ? info : {});
      });
    },
  };
};

export default pubSubFactory;
