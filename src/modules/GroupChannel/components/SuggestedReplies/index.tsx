import './index.scss';
import React, { useRef, useState } from 'react';
import { BaseMessage } from '@sendbird/chat/message';

export interface SuggestedRepliesProps {
  replyOptions: string[];
  onSendMessage: ({ message }: { message: string }) => void;
  message: BaseMessage;
  type?: 'vertical' | 'horizontal';
  gap?: number;
}

interface Position {
  x: number;
  y: number;
}

interface DraggingInfo {
  scrolling: boolean;
  dragging: boolean;
  startPos: Position | null;
  offset: number;
  translateX: number;
}

const SIDE_PADDING_WIDTH = 24;
const PROFILE_WIDTH = 40;

const DraggableSuggestedReplies = ({ children }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const SCREEN_WIDTH = window.innerWidth;
  const DEFAULT_SIZE = SCREEN_WIDTH - (SIDE_PADDING_WIDTH + PROFILE_WIDTH + SIDE_PADDING_WIDTH);
  const carouselWidth = carouselRef.current?.clientWidth ?? 0;

  const [draggingInfo, setDraggingInfo] = useState<DraggingInfo>({
    scrolling: false,
    dragging: false,
    startPos: null,
    offset: 0,
    translateX: 0,
  });

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setDraggingInfo((props) => ({
      ...props,
      scrolling: false,
      dragging: true,
      startPos: {
        x: event.clientX,
        y: event.clientY,
      },
    }));
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingInfo.dragging || !draggingInfo.startPos) return;
    const currentX = event.clientX;
    const newOffset = currentX - draggingInfo.startPos.x;
    setDraggingInfo({
      ...draggingInfo,
      offset: newOffset,
    });
  };

  const handleMouseUp = () => {
    if (!draggingInfo.dragging) return;
    handleDragEnd();
    unblockScroll();
  };

  const blockScroll = () => {
    if (carouselRef.current) {
      carouselRef.current.style.touchAction = 'pan-x';
    }
  };

  const unblockScroll = () => {
    if (carouselRef.current) {
      carouselRef.current.style.touchAction = 'pan-y';
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setDraggingInfo((props) => ({
      ...props,
      scrolling: false,
      dragging: false,
      startPos: {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      },
    }));
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!draggingInfo.startPos || draggingInfo.scrolling) return;

    const startPos = draggingInfo.startPos;
    const [touchMoveX, touchMoveY] = [event.touches[0].clientX, event.touches[0].clientY];
    const [deltaX, deltaY] = [Math.abs(touchMoveX - startPos.x), Math.abs(touchMoveY - startPos.y)];
    const newOffset = touchMoveX - startPos.x;

    if (draggingInfo.dragging) {
      setDraggingInfo((props) => ({
        ...props,
        offset: newOffset,
      }));
      return;
    }
    if (deltaY > deltaX) {
      setDraggingInfo((props) => ({
        ...props,
        scrolling: true,
      }));
    } else {
      blockScroll();
      setDraggingInfo((props) => ({
        ...props,
        dragging: true,
        offset: newOffset,
      }));
    }
  };
  const handleTouchEnd = () => {
    if (!draggingInfo.dragging) return;
    handleDragEnd();
    unblockScroll();
  };

  const getNewDraggingInfo = (): DraggingInfo => {
    return {
      scrolling: false,
      dragging: false,
      startPos: null,
      offset: 0,
      translateX: getNewTranslateX(),
    };
  };
  const handleDragEnd = () => {
    setDraggingInfo(getNewDraggingInfo());
  };

  const getNewTranslateX = () => {
    let newTranslateX = draggingInfo.translateX + draggingInfo.offset;
    if (newTranslateX > 0) {
      newTranslateX = 0;
    } else if (newTranslateX < 0) {
      if (carouselWidth <= DEFAULT_SIZE) {
        newTranslateX = 0;
      } else {
        const overflowSize = carouselWidth - DEFAULT_SIZE;
        const MIN_TRANSLATE_X = overflowSize * -1;
        newTranslateX = Math.max(newTranslateX, MIN_TRANSLATE_X);
      }
    }
    return newTranslateX;
  };

  return (
    <div
      ref={carouselRef}
      className={'sendbird-suggested-replies horizontal'}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        cursor: draggingInfo.dragging ? 'grabbing' : 'grab',
        transition: draggingInfo.dragging ? 'none' : 'transform 0.5s ease',
        transform: `translateX(${draggingInfo.translateX + draggingInfo.offset}px)`,
      }}
    >
      {children}
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
