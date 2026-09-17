import { createContext, useContext } from 'react';

export type GroupKeyHolder = object;

export interface MountRegistry {
  retain: (groupKey: string, holder: GroupKeyHolder) => void;
  release: (groupKey: string, holder: GroupKeyHolder) => void;
  isRetainedByOthers: (groupKey: string, holder: GroupKeyHolder) => boolean;
}

export const createMountRegistry = (): MountRegistry => {
  const holdersByGroupKey = new Map<string, Set<GroupKeyHolder>>();

  return {
    retain: (groupKey, holder) => {
      const holders = holdersByGroupKey.get(groupKey) ?? new Set<GroupKeyHolder>();
      holders.add(holder);
      holdersByGroupKey.set(groupKey, holders);
    },
    release: (groupKey, holder) => {
      const holders = holdersByGroupKey.get(groupKey);
      if (!holders) return;
      holders.delete(holder);
      if (holders.size === 0) holdersByGroupKey.delete(groupKey);
    },
    isRetainedByOthers: (groupKey, holder) => {
      const holders = holdersByGroupKey.get(groupKey);
      if (!holders) return false;
      return holders.size > (holders.has(holder) ? 1 : 0);
    },
  };
};

const MountRegistryContext = createContext<MountRegistry>(createMountRegistry());

export const MountRegistryProvider = MountRegistryContext.Provider;
export const useMountRegistry = (): MountRegistry => useContext(MountRegistryContext);
