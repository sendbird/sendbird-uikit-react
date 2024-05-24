import type { User } from '@sendbird/chat';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { OpenChannel } from '@sendbird/chat/openChannel';

export type Word = {
  text: string;
  userId?: string;
};

export type DynamicProps = {
  ref: React.RefObject<HTMLInputElement> | null;
  channel: OpenChannel | GroupChannel;
  setMentionedUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setIsInput: React.Dispatch<React.SetStateAction<boolean>>;
  setHeight: () => void;
};
