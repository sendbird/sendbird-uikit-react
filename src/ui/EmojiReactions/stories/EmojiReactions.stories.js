import React, { useState } from "react";

import Sendbird from "../../../lib/Sendbird.tsx";
import EmojiReactions from "../index.tsx";

const mockEmojiContainer = {
  emojiHash: "",
  emojiCategories: [
    {
      id: 1,
      name: "sendbird",
      url: "https://static.sendbird.com/icons/emoji_category_default.png",
      emojis: [
        {
          key: "sendbird_emoji_heart_eyes",
          url: "https://static.sendbird.com/icons/emoji_heart_eyes.png"
        },
        {
          key: "sendbird_emoji_laughing",
          url: "https://static.sendbird.com/icons/emoji_laughing.png"
        },
        {
          key: "sendbird_emoji_rage",
          url: "https://static.sendbird.com/icons/emoji_rage.png"
        },
        {
          key: "sendbird_emoji_sob",
          url: "https://static.sendbird.com/icons/emoji_sob.png"
        },
        {
          key: "sendbird_emoji_sweat_smile",
          url: "https://static.sendbird.com/icons/emoji_sweat_smile.png"
        },
        {
          key: "sendbird_emoji_thumbsup",
          url: "https://static.sendbird.com/icons/emoji_thumbsup.png"
        },
        {
          key: "sendbird_emoji_thumbsdown",
          url: "https://static.sendbird.com/icons/emoji_thumbsdown.png"
        },
      ],
    },
  ],
};
const mockMemberNicknamesMap = new Map([
  ['hoon001', 'hoon001'],
  ['hoon002', 'hoon002'],
  ['hoon003', 'hoon003'],
  ['hoon004', 'hoon004'],
  ['hoon005', 'hoon005'],
])

const description = `
  \`import EmojiReactions from "@sendbird/uikit-react/ui/EmojiReactions";\`
`;

export default {
  title: "@sendbird/uikit-react/ui/EmojiReactions",
  description,
};

export const SampleEmojiReactions = () => {
  const [reactions, setReactions] = useState([
    {
      key: "sendbird_emoji_heart_eyes",
      userIds: ['hoon001'],
    },
    {
      key: "sendbird_emoji_laughing",
      userIds: ['hoon001', 'hoon002'],
    },
    {
      key: "sendbird_emoji_rage",
      userIds: ['hoon001', 'hoon002', 'hoon003'],
    },
    {
      key: "sendbird_emoji_sob",
      userIds: ['hoon001', 'hoon002', 'hoon003', 'hoon004'],
    },
    {
      key: "sendbird_emoji_sweat_smile",
      userIds: ['hoon001', 'hoon002', 'hoon003', 'hoon004', 'hoon005'],
    },
  ]);

  const currentUserId = 'hoon001';
  const currentMessageId = 'message-id'

  return (
    <Sendbird
      appId={process.env.STORYBOOK_APP_ID}
      userId={currentUserId}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '95vh',
          width: '100%',
        }}
      >
        <EmojiReactions
          userId="hoon001"
          channel={{
            isGroupChannel: () => true,
            isSuper: false,
            members: [
              { userId: currentUserId },
              { userId: "hoon002" },
              { userId: "hoon003" },
              { userId: "hoon004" },
              { userId: "hoon005" },
            ],
          }}
          message={{ messageId: currentMessageId, reactions }}
          emojiContainer={mockEmojiContainer}
          memberNicknamesMap={mockMemberNicknamesMap}
          toggleReaction={(message, emojiKey, wasReacted) => {
            if (message.messageId !== currentMessageId) return null;
            if (wasReacted) {
              setReactions((reactions) => {
                const reaction = reactions.find(({ key }) => key === emojiKey);
                reaction.userIds = reaction.userIds.filter((userId) => userId !== currentUserId);
                return reactions.filter((r) => r.key !== emojiKey)
                  .concat(reaction.userIds.length > 0 ? reaction : []);
              });
            } else {
              setReactions((reactions) => {
                const reaction = reactions.find(({ key }) => key === emojiKey) ?? {
                  key: emojiKey,
                  userIds: [],
                };
                reaction.userIds.push(currentUserId);
                return reactions.filter((r) => r.key !== emojiKey).concat(reaction);
              });
            }
          }}
        />
      </div>
    </Sendbird>
  )
};
