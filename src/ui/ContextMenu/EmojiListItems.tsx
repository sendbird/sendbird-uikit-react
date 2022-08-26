import React, { ReactElement, RefObject, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import SortByRow from '../SortByRow';

type SpaceFromTrigger = { x: number, y: number };
type ReactionStyle = { left: number, top: number };
export interface EmojiListItemsProps {
  closeDropdown: () => void;
  children: ReactElement;
  parentRef: RefObject<HTMLDivElement>;
  parentContainRef: RefObject<HTMLDivElement>;
  spaceFromTrigger?: SpaceFromTrigger;
}

const EmojiListItems = ({
  children,
  parentRef,
  parentContainRef,
  spaceFromTrigger = { x: 0, y: 0 },
  closeDropdown,
}: EmojiListItemsProps): ReactElement => {
  const [reactionStyle, setReactionStyle] = useState<ReactionStyle>({ left: 0, top: 0 });
  const reactionRef = useRef(null);

  /* showParent & hideParent */
  useEffect(() => {
    if (parentContainRef && parentContainRef?.current) {
      parentContainRef.current.classList.add('sendbird-reactions--pressed');
    }
    return () => {
      if (parentContainRef && parentContainRef?.current) {
        parentContainRef.current.classList.remove('sendbird-reactions--pressed');
      }
    };
  }, []);

  /* setupEvents & cleanupEvents */
  useEffect(() => {
    const handleClickOutSide = (event) => {
      if (reactionRef?.current && !reactionRef?.current?.contains?.(event.target)) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutSide);
    return () => {
      document.removeEventListener('mousedown', handleClickOutSide);
    };
  }, []);

  /* getBarPosition */
  useEffect(() => {
    const spaceFromTriggerX = spaceFromTrigger?.x || 0;
    const spaceFromTriggerY = spaceFromTrigger?.y || 0;
    const parentRect = parentRef?.current?.getBoundingClientRect();
    const x = parentRect.x || parentRect.left;
    const y = parentRect.y || parentRect.top;
    const reactionStyle = {
      top: y,
      left: x,
    };
    if (!reactionRef?.current) {
      setReactionStyle(reactionStyle);
    } else {
      const rect = reactionRef?.current?.getBoundingClientRect();
      if (reactionStyle.top < rect.height) {
        reactionStyle.top += parentRect.height;
        reactionStyle.top += spaceFromTriggerY;
      } else {
        reactionStyle.top -= rect.height;
        reactionStyle.top -= spaceFromTriggerY;
      }
      reactionStyle.left -= rect.width / 2;
      reactionStyle.left += (parentRect.height / 2) - 2;
      reactionStyle.left += spaceFromTriggerX;
      const maximumLeft = window.innerWidth - rect.width;
      if (maximumLeft < reactionStyle.left) {
        reactionStyle.left = maximumLeft;
      }
      if (reactionStyle.left < 0) {
        reactionStyle.left = 0;
      }
      setReactionStyle(reactionStyle);
    }
  }, []);

  return (
    createPortal(
      <>
        <div className="sendbird-dropdown__menu-backdrop" />
        <ul
          className="sendbird-dropdown__reaction-bar"
          ref={reactionRef}
          style={{
            display: 'inline-block',
            position: 'fixed',
            left: `${Math.round(reactionStyle.left)}px`,
            top: `${Math.round(reactionStyle.top)}px`,
          }}
        >
          <SortByRow
            className="sendbird-dropdown__reaction-bar__row"
            maxItemCount={8}
            itemWidth={44}
            itemHeight={40}
          >
            {children}
          </SortByRow>
        </ul>
      </>,
      document.getElementById('sendbird-emoji-list-portal'),
    )
  );
};

export default EmojiListItems;
