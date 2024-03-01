export declare enum PublishingModuleType {
    CHANNEL = "CHANNEL",
    THREAD = "THREAD"
}
export declare function shouldPubSubPublishToChannel(modules?: PublishingModuleType[]): boolean;
export declare function shouldPubSubPublishToThread(modules?: PublishingModuleType[]): boolean;
