import './index.scss';
import React, { useState } from 'react';

interface Props {
  replyOptions: string[];
  onSendMessage: ({ message }: { message: string }) => void;
}

const SuggestedReplies = ({ replyOptions, onSendMessage }: Props) => {
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

  return (
    <div className="sendbird-suggested-replies">
      {replyOptions.map((option: string, index: number) => {
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
      })}
    </div>
  );
};

export default SuggestedReplies;
