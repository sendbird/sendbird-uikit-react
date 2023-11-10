export enum PublishingModuleType {
  CHANNEL = 'CHANNEL',
  THREAD = 'THREAD',
}

// NOTE: To maintain compatibility with the sendbirdSelector provided to customers
//  this utility function ensures that if publishingModules is not provided or its length is zero
//  it will maintain the same behavior as before.
const publishTo = (target: PublishingModuleType, modules?: PublishingModuleType[]) => {
  if (!modules || modules.length === 0) return true;
  else return modules.includes(target);
};
export function shouldPubSubPublishToChannel(modules?: PublishingModuleType[]) {
  return publishTo(PublishingModuleType.CHANNEL, modules);
}
export function shouldPubSubPublishToThread(modules?: PublishingModuleType[]) {
  return publishTo(PublishingModuleType.THREAD, modules);
}
