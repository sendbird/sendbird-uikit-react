/**
 * This function helps consider the every condition
 * related to enabling emoji reaction feature.
 */

export interface IsReactionEnabledProps {
  isBroadcast?: boolean;
  isSuper?: boolean;
  globalLevel?: boolean;
  moduleLevel?: boolean | null;
}

export function getIsReactionEnabled({
  isBroadcast = false,
  isSuper = false,
  globalLevel = true,
  moduleLevel = null,
}: IsReactionEnabledProps): boolean {
  if (moduleLevel) {
    return !isBroadcast && !isSuper;
  }
  return (
    globalLevel
    && (moduleLevel ?? true)
    && !isBroadcast
    && !isSuper
  );
}
