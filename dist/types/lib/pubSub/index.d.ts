export type PubSubTypes<T extends keyof any, U extends {
    topic: T;
    payload: any;
}> = {
    __getTopics: () => Record<T, Set<(data: PayloadByTopic<T, U>) => void>>;
    subscribe: <K extends T>(topic: K, subscriber: (data: PayloadByTopic<K, U>) => void) => {
        remove: () => void;
    };
    publish: <K extends T>(topic: K, data: PayloadByTopic<K, U>) => void;
};
type PayloadByTopic<T extends keyof any, U> = U extends {
    topic: T;
    payload: infer P;
} ? P : never;
declare const pubSubFactory: <T extends string | number | symbol = string | number | symbol, U extends {
    topic: T;
    payload: any;
} = any>() => PubSubTypes<T, U>;
export default pubSubFactory;
