import React, { useRef, useState } from 'react';
import { FileMessage, UserMessage } from '@sendbird/chat/message';

import './index.scss';

import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useLocalization } from '../../../../lib/LocalizationContext';
import { getChannelTitle } from '../../../Channel/components/ChannelHeader/utils';
import { useThreadContext } from '../../context/ThreadProvider';
import { ParentMessageInfoStateTypes, ThreadListStateTypes } from '../../types';
import ParentMessageInfo from '../ParentMessageInfo';
import ThreadHeader from '../ThreadHeader';
import ThreadList from '../ThreadList';
import ThreadMessageInput from '../ThreadMessageInput';
import useMemorizedHeader from './useMemorizedHeader';
import useMemorizedParentMessageInfo from './useMemorizedParentMessageInfo';
import useMemorizedThreadList from './useMemorizedThreadList';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import { isAboutSame } from '../../context/utils';

export interface ThreadUIProps {
  onHeaderActionClick?: () => void;
  onMoveToParentMessage?: (props: { message: UserMessage | FileMessage }) => void;
  renderHeader?: () => React.ReactElement;
  renderParentMessageInfo?: () => React.ReactElement;
  renderMessage?: (props: { message: UserMessage | FileMessage }) => React.ReactElement;
  renderMessageInput?: () => React.ReactElement;
  renderCustomSeparator?: () => React.ReactElement;
  renderParentMessageInfoPlaceholder?: (type: ParentMessageInfoStateTypes) => React.ReactElement;
  renderThreadListPlaceHolder?: (type: ThreadListStateTypes) => React.ReactElement;
}

const ThreadUI: React.FC<ThreadUIProps> = ({
  onHeaderActionClick,
  onMoveToParentMessage,
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
    channelStatus,
    parentMessageInfoStatus,
    threadListStatus,
    hasMorePrev,
    hasMoreNext,
    emojiContainer,
    fetchPrevThreads,
    fetchNextThreads,
  } = useThreadContext();
  const replyCount = parentMessage?.threadInfo?.replyCount;

  // Memoized custom components
  const MemorizedHeader = useMemorizedHeader({ renderHeader });
  const MemorizedParentMessageInfo = useMemorizedParentMessageInfo({
    parentMessageInfoStatus,
    renderParentMessageInfo,
    renderParentMessageInfoPlaceholder, // nil, loading, invalid
  });
  const MemorizedThreadList = useMemorizedThreadList({
    threadListStatus,
    renderThreadListPlaceHolder,
  });

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
    console.log('스크롤 발생중', scrollTop, clientHeight, scrollHeight);
    if (isAboutSame(scrollTop, 0, 10) && hasMorePrev) {
      fetchPrevThreads((messages) => {
        console.log('fetchPrevThreads called', messages)
      });
    }
    if (isAboutSame(clientHeight + scrollTop, scrollHeight, 10) && hasMoreNext) {
      console.log('스크롤 이전', scrollTop, clientHeight, scrollHeight);
      const savedScrollTop = scrollTop;
      fetchNextThreads((messages) => {
        if (messages) {
          try {
            console.log('스크롤 이후', scrollTop, clientHeight, scrollHeight);
            element.scrollTop = savedScrollTop;
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
            onChannelNameClick={() => onMoveToParentMessage({ message: parentMessage })}
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
              channel={currentChannel}
              message={parentMessage}
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
                {`${replyCount > 99 ? '99+' : replyCount} ${replyCount > 1 ? stringSet.THREAD__THREAD_REPLIES : stringSet.THREAD__THREAD_REPLY}`}
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
