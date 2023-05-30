import { DeepPartial } from './types';
import { UIKitConfigInfo } from '../types';

/**
 * @param localConfigs Set directly in code level. It has higher priority than remote ones
 * @param remoteConfigs Set by Feature Config setting in Dashboard
 * @returns
 */
export default function getConfigsByPriority(localConfigs: DeepPartial<UIKitConfigInfo>, remoteConfigs: UIKitConfigInfo): UIKitConfigInfo {
  const prioritizedConfigs = { ...remoteConfigs }; // copy remoteConfigs to prevent mutation

  Object.keys(localConfigs).forEach(key => {
    if (
      prioritizedConfigs.hasOwnProperty(key)
      && localConfigs[key] !== null
      // Recursively call getConfigsByPriority only when the value of the key is Object
      && typeof localConfigs[key] === 'object'
    ) {
      prioritizedConfigs[key] = getConfigsByPriority(localConfigs[key], prioritizedConfigs[key]);
    } else {
      prioritizedConfigs[key] = localConfigs[key];
    }
  });

  return prioritizedConfigs;
}
