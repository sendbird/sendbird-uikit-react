export * from '../../../Channel/context/hooks/useSendMultipleFilesMessage';
export { PublishingModuleType } from '../../../internalInterfaces';
/**
 * We have to reduce the duplicated logics between the modules Channel and Thread.
 * We need to make a new directory place for both and bring the duplicated logics
 * to there.
 * The most of the custom hooks should be there.
 */
