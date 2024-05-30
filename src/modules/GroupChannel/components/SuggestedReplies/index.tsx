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
  onClickReply: (event: React.MouseEvent<HTMLDivElement>, option: string) => void;
  type?: 'vertical' | 'horizontal';
}

export const ReplyItem = ({
  value,
  onClickReply,
  type = 'vertical',
}: ReplyItemProps) => {
  return (
    <div
      className={`sendbird-suggested-replies__option ${type}`}
      id={value}
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
      <ReplyItem key={index} value={option} onClickReply={onClickReply} type={type} />
    );
  });

  return <div className={`sendbird-suggested-replies ${type}`}>{children}</div>;
};

export default SuggestedReplies;
