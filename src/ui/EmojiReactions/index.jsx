import React, { useRef, useContext } from 'react';
import PropTypes from 'prop-types';

import './index.scss';

import ReactionBadge from '../ReactionBadge';
import ImageRenderer from '../ImageRenderer';
import Icon, { IconTypes, IconColors } from '../Icon';
import ContextMenu from '../ContextMenu';
import Tooltip from '../Tooltip';
import TooltipWrapper from '../TooltipWrapper';
import { LocalizationContext } from '../../lib/LocalizationContext';

export default function EmojiReactions({
  className,
  userId,
  message,
  emojiAllMap,
  membersMap,
  toggleReaction,
  memoizedEmojiListItems,
}) {
  const MemoizedEmojiListItems = memoizedEmojiListItems;
  const imageWidth = '20px';
  const imageHeight = '20px';
  const emojiReactionAddRef = useRef(null);
  const { reactions = [] } = message;
  const messageReactions = reactions;
  const { stringSet } = useContext(LocalizationContext);

  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-emoji-reactions',
      ].join(' ')}
    >
      <div className="sendbird-emoji-reactions--inner">
        {
          messageReactions && (
            messageReactions.map((reaction) => { // function component
              const { userIds = [] } = reaction;
              const emojiUrl = emojiAllMap.get(reaction.key) || '';
              const reactedUserCount = userIds.length;
              const reactedByMe = !(userIds.indexOf(userId) < 0);
              const nicknames = userIds
                .filter((currentUserId) => currentUserId !== userId)
                .map((currentUserId) => (
                  membersMap.get(currentUserId) || stringSet.TOOLTIP__UNKNOWN_USER
                ));
              const stringSetForMe = (nicknames.length > 0)
                ? stringSet.TOOLTIP__AND_YOU : stringSet.TOOLTIP__YOU;
              return (
                <TooltipWrapper
                  className="sendbird-emoji-reactions__emoji-reaction"
                  key={reaction.key}
                  hoverTooltip={
                    userIds.length > 0 && (
                      <Tooltip>
                        <>
                          {
                            `${(
                              nicknames.join(', ')
                            )}${(
                              reactedByMe
                                ? stringSetForMe
                                : ''
                            )}`
                          }
                        </>
                      </Tooltip>
                    )
                  }
                >
                  <ReactionBadge
                    count={reactedUserCount}
                    selected={reactedByMe}
                    onClick={() => toggleReaction(message, reaction.key, reactedByMe)}
                  >
                    <ImageRenderer
                      circle
                      url={emojiUrl}
                      width={imageWidth}
                      height={imageHeight}
                      defaultComponent={(
                        <Icon
                          width={imageWidth}
                          height={imageHeight}
                          type={IconTypes.QUESTION}
                        />
                      )}
                    />
                  </ReactionBadge>
                </TooltipWrapper>
              );
            })
          )
        }
        {
          (messageReactions.length < emojiAllMap.size)
          && (
            <ContextMenu
              menuTrigger={(toggleDropdown) => (
                <ReactionBadge
                  className="sendbird-emoji-reactions__emoji-reaction-add"
                  isAdd
                  onClick={toggleDropdown}
                  ref={emojiReactionAddRef}
                >
                  <Icon
                    width={imageWidth}
                    height={imageHeight}
                    fillColor={IconColors.ON_BACKGROUND_3}
                    type={IconTypes.EMOJI_MORE}
                  />
                </ReactionBadge>
              )}
              menuItems={(closeDropdown) => (
                <MemoizedEmojiListItems
                  message={message}
                  parentRef={emojiReactionAddRef}
                  parentContainRef={emojiReactionAddRef}
                  closeDropdown={closeDropdown}
                  spaceFromTrigger={{ y: 4 }}
                />
              )}
            />
          )
        }
      </div>
    </div>
  );
}

EmojiReactions.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  userId: PropTypes.string,
  message: PropTypes.shape({
    reactions: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  emojiAllMap: PropTypes.instanceOf(Map).isRequired,
  membersMap: PropTypes.instanceOf(Map),
  toggleReaction: PropTypes.func,
  memoizedEmojiListItems: PropTypes.func,
};
EmojiReactions.defaultProps = {
  className: '',
  userId: '',
  membersMap: new Map(),
  toggleReaction: () => { },
  memoizedEmojiListItems: () => '',
};
