/**
 * This function helps consider the every condition
 * related to enabling emoji reaction feature.
 */

export interface IsReactionEnabledProps {
  isBroadcast?: boolean;
  isSuper?: boolean;
  globalLevel?: boolean;
  moduleLevel?: boolean;
}

export function getIsReactionEnabled({
  isBroadcast = false,
  isSuper = false,
  globalLevel = true,
  moduleLevel,
}: IsReactionEnabledProps): boolean {
  return (isBroadcast || isSuper) ? false : (moduleLevel ?? globalLevel);
}
