import { useState } from "react";
import SendbirdChat from "@sendbird/chat";
import { GroupChannel, GroupChannelListOrder, GroupChannelModule } from "@sendbird/chat/groupChannel";
import { OpenChannelModule } from "@sendbird/chat/openChannel";
import { useAsyncEffect } from "@sendbird/uikit-tools";

interface GetSampleChannelParams {
  appId: string;
  userId: string;
}
export const getSampleChannel = ({
  appId,
  userId,
}: GetSampleChannelParams): GroupChannel | null => {
  const [channel, setChannel] = useState<GroupChannel | null>(null);
  useAsyncEffect(async () => {
    try {
      const chat = SendbirdChat.init({
        appId,
        modules: [new GroupChannelModule, new OpenChannelModule],
      });

      await chat.connect(userId);
      const query = chat.groupChannel.createMyGroupChannelListQuery({ limit: 1, order: GroupChannelListOrder.LATEST_LAST_MESSAGE });
      const channelList = await query.next();

      if (channelList.length > 0) {
        setChannel(channelList[0]);
      } {
        const query = chat.createApplicationUserListQuery({ limit: 10 });
        const userList = await query.next();
        const newChannel = await chat.groupChannel.createChannel({ invitedUserIds: userList.map(user => user.userId) });
        setChannel(newChannel);
      }
    } catch (err) {
      console.warn('Sendbird storybook - getSampleChannel: ', err);
    }
  }, []);
  return channel;
};
