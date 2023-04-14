import type { User } from '@sendbird/chat';
import type { GroupChannel } from '@sendbird/chat/groupChannel';

export type Word = {
  text: string;
  userId?: string;
};

export type DynamicProps = {
  ref: React.RefObject<HTMLDivElement>;
  channel: GroupChannel;
  setUniqueUserIds: React.Dispatch<React.SetStateAction<string[]>>;
  setMentionedUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setIsInput: React.Dispatch<React.SetStateAction<boolean>>;
  setHeight: () => void;
};
