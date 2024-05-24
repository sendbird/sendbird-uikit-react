import './index.scss';
import React, { useState } from 'react';

export interface SuggestedRepliesProps {
  replyOptions: string[];
  onSendMessage: ({ message }: { message: string }) => void;
  type?: 'vertical' | 'horizontal';
  gap?: number;
}

export interface ReplyItemProps {
  value: string;
  index: number;
  onClickReply: (event: React.MouseEvent<HTMLDivElement>, option: string) => void;
}

export const ReplyItem = ({
  value,
  index,
  onClickReply,
}: ReplyItemProps) => {
  return (
    <div
      className="sendbird-suggested-replies__option"
      id={value}
      key={index + value}
      onClick={(e) => onClickReply(e, value)}
    >
      {value}
    </div>
  );
};

const SuggestedReplies = ({ replyOptions, onSendMessage, type = 'vertical' }: SuggestedRepliesProps) => {
  const [replied, setReplied] = useState<boolean>(false);

  const onClickReply = (
    event: React.MouseEvent<HTMLDivElement>,
    option: string,
  ) => {
    event.preventDefault();
    onSendMessage({ message: option });
    setReplied(true);
  };

  if (replied) {
    return null;
  }

  const children = replyOptions.map((option: string, index: number) => {
    return (
      <ReplyItem key={index} index={index} value={option} onClickReply={onClickReply}/>
    );
  });

  return <div className={`sendbird-suggested-replies ${type}`}>{children}</div>;
};

export default SuggestedReplies;
