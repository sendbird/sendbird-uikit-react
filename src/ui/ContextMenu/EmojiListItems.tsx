import React, { Children, ReactElement, ReactNode, RefObject, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import SortByRow from '../SortByRow';
import { Nullable } from '../../types';
import { EMOJI_MENU_ROOT_ID, MENU_OBSERVING_CLASS_NAME } from '.';
import { APP_LAYOUT_ROOT } from '../../modules/App/const';
import { Label, LabelColors, LabelTypography } from '../Label';

const defaultParentRect = { x: 0, y: 0, left: 0, top: 0, height: 0 };
type SpaceFromTrigger = { x: number, y: number };
type ReactionStyle = { left: number, top: number };
export interface EmojiListItemsProps {
  id?: string;
  closeDropdown: () => void;
  children: ReactNode;
  parentRef: RefObject<HTMLDivElement>;
  parentContainRef: RefObject<HTMLDivElement>;
  spaceFromTrigger?: SpaceFromTrigger;
}

export const EmojiListItems = ({
  id,
  children,
  parentRef,
  parentContainRef,
  spaceFromTrigger = { x: 0, y: 0 },
  closeDropdown,
}: EmojiListItemsProps): Nullable<ReactElement> => {
  const [reactionStyle, setReactionStyle] = useState<ReactionStyle>({ left: 0, top: 0 });
  const reactionRef: RefObject<HTMLUListElement> = useRef(null);

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
    const portalElement = document.getElementById(APP_LAYOUT_ROOT);
    const portalRect = portalElement?.getBoundingClientRect?.() || {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    } as DOMRect;
    const parentRect = parentRef?.current?.getBoundingClientRect() ?? defaultParentRect;

    const x = (parentRect?.x || parentRect?.left || 0) - portalRect.left;
    const y = (parentRect?.y || parentRect?.top || 0) - portalRect.top;
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
      const maximumLeft = portalRect.width - rect.width;
      if (maximumLeft < reactionStyle.left) {
        reactionStyle.left = maximumLeft;
      }
      if (reactionStyle.left < 0) {
        reactionStyle.left = 0;
      }
      setReactionStyle(reactionStyle);
    }
  }, [children]);

  const rootElement = document.getElementById(EMOJI_MENU_ROOT_ID);
  if (rootElement) {
    return (
      createPortal(
        <div className={MENU_OBSERVING_CLASS_NAME} id={id}>
          <div className="sendbird-dropdown__menu-backdrop" />
          <ul
            className="sendbird-dropdown__reaction-bar"
            data-testid="sendbird-dropdown__reaction-bar"
            ref={reactionRef}
            style={{
              display: 'inline-block',
              position: 'fixed',
              left: `${Math.round(reactionStyle.left)}px`,
              top: `${Math.round(reactionStyle.top)}px`,
            }}
          >
            {Children.count(children) <= 0
              ? (
                <Label
                  className="sendbird-dropdown__reaction-bar__emptyLabel"
                  type={LabelTypography.BODY_1}
                  color={LabelColors.ONBACKGROUND_1}
                >
                  Emojis is not loaded yet.
                </Label>
              ) : (
                <SortByRow
                  className="sendbird-dropdown__reaction-bar__row"
                  maxItemCount={8}
                  itemWidth={44}
                  itemHeight={40}
                >
                  {children}
                </SortByRow>
              )
            }
          </ul>
        </div>,
        rootElement,
      )
    );
  }
  return null;
};

export default EmojiListItems;
