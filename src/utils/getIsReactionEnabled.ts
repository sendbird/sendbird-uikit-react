/**
 * This function helps consider the every condition
 * related to enabling emoji reaction feature.
 */

export interface IsReactionEnabledProps {
  appLevel?: boolean;
  isBroadcast?: boolean;
  isSuper?: boolean;
  globalLevel?: boolean;
  moduleLevel?: boolean;
}

export function getIsReactionEnabled({
  appLevel = true,
  isBroadcast = false,
  isSuper = false,
  globalLevel = true,
  moduleLevel = true,
}: IsReactionEnabledProps): boolean {
  return appLevel && !isBroadcast && !isSuper && globalLevel && moduleLevel;
}
