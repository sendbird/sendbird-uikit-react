import './index.scss';
import React, { useState } from 'react';
import { BaseMessage } from '@sendbird/chat/message';

export interface SuggestedRepliesProps {
  replyOptions: string[];
  onSendMessage: ({ message }: { message: string }) => void;
  message: BaseMessage;
  type?: 'vertical' | 'horizontal';
  gap?: number;
}

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
      <div
        className="sendbird-suggested-replies__option"
        id={option}
        key={index + option}
        onClick={(e) => onClickReply(e, option)}
      >
        {option}
      </div>
    );
  });

  return <div className={`sendbird-suggested-replies ${type}`}>{children}</div>;
};

export default SuggestedReplies;
