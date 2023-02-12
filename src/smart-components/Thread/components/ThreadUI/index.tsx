import React, { useEffect, useRef, useState } from 'react';
import { FileMessage, UserMessage } from '@sendbird/chat/message';

import './index.scss';

import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useLocalization } from '../../../../lib/LocalizationContext';
import { getChannelTitle } from '../../../Channel/components/ChannelHeader/utils';
import { useThreadContext } from '../../context/ThreadProvider';
import { ParentMessageStateTypes, ThreadListStateTypes } from '../../types';
import ParentMessageInfo from '../ParentMessageInfo';
import ThreadHeader from '../ThreadHeader';
import ThreadList from '../ThreadList';
import ThreadMessageInput from '../ThreadMessageInput';
import useMemorizedHeader from './useMemorizedHeader';
import useMemorizedParentMessageInfo from './useMemorizedParentMessageInfo';
import useMemorizedThreadList from './useMemorizedThreadList';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import { isAboutSame } from '../../context/utils';
import { useVoicePlayerContext } from '../../../../hooks/VoicePlayer';
import uuidv4 from '../../../../utils/uuid';

export interface ThreadUIProps {
  renderHeader?: () => React.ReactElement;
  renderParentMessageInfo?: () => React.ReactElement;
  renderMessage?: (props: {
    message: UserMessage | FileMessage,
    chainTop: boolean,
    chainBottom: boolean,
    hasSeparator: boolean,
  }) => React.ReactElement;
  renderMessageInput?: () => React.ReactElement;
  renderCustomSeparator?: () => React.ReactElement;
  renderParentMessageInfoPlaceholder?: (type: ParentMessageStateTypes) => React.ReactElement;
  renderThreadListPlaceHolder?: (type: ThreadListStateTypes) => React.ReactElement;
}

const ThreadUI: React.FC<ThreadUIProps> = ({
  renderHeader,
  renderParentMessageInfo,
  renderMessage,
  renderMessageInput,
  renderCustomSeparator,
  renderParentMessageInfoPlaceholder,
  renderThreadListPlaceHolder,
}: ThreadUIProps): React.ReactElement => {
  const {
    stores,
  } = useSendbirdStateContext();
  const currentUserId = stores?.sdkStore?.sdk?.currentUser?.userId;
  const {
    stringSet,
  } = useLocalization();
  const {
    currentChannel,
    allThreadMessages,
    parentMessage,
    parentMessageState,
    threadListState,
    hasMorePrev,
    hasMoreNext,
    fetchPrevThreads,
    fetchNextThreads,
    onHeaderActionClick,
    onMoveToParentMessage,
  } = useThreadContext();
  const replyCount = allThreadMessages.length;

  // Memoized custom components
  const MemorizedHeader = useMemorizedHeader({ renderHeader });
  const MemorizedParentMessageInfo = useMemorizedParentMessageInfo({
    parentMessage,
    parentMessageState,
    renderParentMessageInfo,
    renderParentMessageInfoPlaceholder, // nil, loading, invalid
  });
  const MemorizedThreadList = useMemorizedThreadList({
    threadListState,
    renderThreadListPlaceHolder,
  });

  // voice message
  const {
    checkInChannel,
    checkOutChannel,
  } = useVoicePlayerContext();
  useEffect(() => {
    if (currentChannel?.url) {
      const uuid = uuidv4();
      checkInChannel(currentChannel.url, uuid);
      return () => {
        checkOutChannel(currentChannel.url, uuid);
      }
    }
  }, [currentChannel?.url]);

  // scroll
  const [scrollBottom, setScrollBottom] = useState(0);
  const scrollRef = useRef(null);
  const onScroll = (e) => {
    const element = e.target;
    const {
      scrollTop,
      clientHeight,
      scrollHeight,
    } = element;

    const threadItemNodes = scrollRef.current.querySelectorAll('.sendbird-thread-list-item');
    const firstNode = threadItemNodes?.[0];
    if (isAboutSame(scrollTop, 0, 10) && hasMorePrev) {
      fetchPrevThreads((messages) => {
        if (messages) {
          try {
            firstNode?.scrollIntoView?.({ block: 'start', inline: 'nearest' });
          } catch (error) {
            //
          }
        }
      });
    }

    if (isAboutSame(clientHeight + scrollTop, scrollHeight, 10) && hasMoreNext) {
      const scrollTop_ = scrollTop;
      fetchNextThreads((messages) => {
        if (messages) {
          try {
            element.scrollTop = scrollTop_;
            scrollRef.current.scrollTop = scrollTop_;
          } catch (error) {
            //
          }
        }
      });
    }

    // save the lastest scroll bottom value
    if (scrollRef?.current) {
      const current = scrollRef?.current;
      setScrollBottom(current.scrollHeight - current.scrollTop - current.offsetHeight)
    }
  };

  return (
    <div className='sendbird-thread-ui'>
      {
        MemorizedHeader || (
          <ThreadHeader
            className="sendbird-thread-ui__header"
            channelName={getChannelTitle(currentChannel, currentUserId, stringSet)}
            onActionIconClick={onHeaderActionClick}
            onChannelNameClick={() => onMoveToParentMessage({ message: parentMessage, channel: currentChannel })}
          />
        )
      }
      <div
        className="sendbird-thread-ui--scroll"
        ref={scrollRef}
        onScroll={onScroll}
      >
        {
          MemorizedParentMessageInfo || (
            <ParentMessageInfo
              className="sendbird-thread-ui__parent-message-info"
            />
          )
        }
        {
          replyCount > 0 && (
            <div className="sendbird-thread-ui__reply-counts">
              <Label
                type={LabelTypography.BODY_1}
                color={LabelColors.ONBACKGROUND_3}
              >
                {`${replyCount} ${replyCount > 1 ? stringSet.THREAD__THREAD_REPLIES : stringSet.THREAD__THREAD_REPLY}`}
              </Label>
            </div>
          )
        }
        {
          MemorizedThreadList || (
            <ThreadList
              className="sendbird-thread-ui__thread-list"
              allThreadMessages={allThreadMessages}
              renderMessage={renderMessage}
              renderCustomSeparator={renderCustomSeparator}
              scrollRef={scrollRef}
              scrollBottom={scrollBottom}
            />
          )
        }
        {/* MessageInput */}
        {
          renderMessageInput?.() || (
            <ThreadMessageInput
              className="sendbird-thread-ui__message-input"
            />
          )
        }
      </div>
    </div>
  );
};

export default ThreadUI;
