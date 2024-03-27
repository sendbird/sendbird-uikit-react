/**
 * This function helps consider the every condition
 * related to enabling emoji reaction feature.
 */

import type { GroupChannel } from "@sendbird/chat/groupChannel";
import type { SendBirdStateConfig } from "../lib/types";

export interface IsReactionEnabledProps {
  channel: GroupChannel;
  config: SendBirdStateConfig;
  moduleLevel?: boolean;
}

export function getIsReactionEnabled({
  channel,
  config,
  moduleLevel,
}: IsReactionEnabledProps): boolean {
  if (!channel || channel.isBroadcast || channel.isEphemeral) {
    return false;
  }
  if (channel.isSuper) return moduleLevel && config.groupChannel.enableReactionsSupergroup;
  return moduleLevel ?? config.groupChannel.enableReactions;
}
