import { DeepPartial, isSameType } from './types';
import { UIKitConfigInfo } from '../types';

/**
 * @param localConfigs Set directly in code level. It has higher priority than remote ones
 * @param remoteConfigs Set by Feature Config setting in Dashboard
 * @returns
 */
export default function getConfigsByPriority(localConfigs: DeepPartial<UIKitConfigInfo>, remoteConfigs: UIKitConfigInfo): UIKitConfigInfo {
  const prioritizedConfigs = { ...remoteConfigs }; // copy remoteConfigs to prevent mutation

  Object.keys(localConfigs).forEach(key => {
    if (prioritizedConfigs.hasOwnProperty(key) && isSameType(localConfigs[key], prioritizedConfigs[key])) {
      prioritizedConfigs[key] = typeof localConfigs[key] === 'object'
        // Recursively call getConfigsByPriority only when the value of the key is Object
        ? getConfigsByPriority(localConfigs[key], prioritizedConfigs[key])
        : localConfigs[key];
    } else {
      prioritizedConfigs[key] = localConfigs[key];
    }
  });

  return prioritizedConfigs;
}
