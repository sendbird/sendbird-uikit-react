import React, { ReactNode, useRef, useState } from 'react';

import './index.scss';

import { useLocalization } from '../../../../lib/LocalizationContext';
import { getChannelTitle } from '../../../GroupChannel/components/GroupChannelHeader/utils';
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
import { MessageProvider } from '../../../Message/context/MessageProvider';
import { SendableMessageType, getHTMLTextDirection } from '../../../../utils';
import { classnames } from '../../../../utils/utils';
import useThread from '../../context/useThread';
import useSendbird from '../../../../lib/Sendbird/context/hooks/useSendbird';

export interface ThreadUIProps {
  renderHeader?: () => React.ReactElement;
  renderParentMessageInfo?: () => ReactNode;
  renderMessage?: (props: {
    message: SendableMessageType,
    chainTop: boolean,
    chainBottom: boolean,
    hasSeparator: boolean,
  }) => React.ReactElement;
  renderFileUploadIcon?: () => React.ReactElement;
  renderVoiceMessageIcon?: () => React.ReactElement;
  renderSendMessageIcon?: () => React.ReactElement;
  renderMessageInput?: () => React.ReactElement;
  renderCustomSeparator?: () => React.ReactElement;
  renderParentMessageInfoPlaceholder?: (type: ParentMessageStateTypes) => React.ReactElement;
  renderThreadListPlaceHolder?: (type: ThreadListStateTypes) => React.ReactElement;
}

const ThreadUI: React.FC<ThreadUIProps> = ({
  renderHeader,
  renderParentMessageInfo = () => <ParentMessageInfo className="sendbird-thread-ui__parent-message-info" />,
  renderMessage,
  renderMessageInput,
  renderCustomSeparator,
  renderParentMessageInfoPlaceholder,
  renderThreadListPlaceHolder,
  renderFileUploadIcon,
  renderVoiceMessageIcon,
  renderSendMessageIcon,
}: ThreadUIProps): React.ReactElement => {
  const { state: { stores, config } } = useSendbird();
  const currentUserId = stores?.sdkStore?.sdk?.currentUser?.userId;
  const {
    stringSet,
  } = useLocalization();
  const {
    state: {
      currentChannel,
      allThreadMessages,
      parentMessage,
      parentMessageState,
      threadListState,
      hasMorePrev,
      hasMoreNext,
      onHeaderActionClick,
      onMoveToParentMessage,
    },
    actions: {
      fetchPrevThreads,
      fetchNextThreads,
    },
  } = useThread();
  const replyCount = allThreadMessages.length;
  const isByMe = currentUserId === parentMessage?.sender?.userId;

  // Memoized custom components
  const MemorizedHeader = useMemorizedHeader({ renderHeader });
  const MemorizedParentMessageInfo = useMemorizedParentMessageInfo({
    parentMessage,
    parentMessageState,
    renderParentMessageInfo,
    renderParentMessageInfoPlaceholder,
  });
  const MemorizedThreadList = useMemorizedThreadList({
    threadListState,
    renderThreadListPlaceHolder,
  });

  // scroll
  const [scrollBottom, setScrollBottom] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const onScroll = (e) => {
    const element = e.target;
    const {
      scrollTop,
      clientHeight,
      scrollHeight,
    } = element;

    const threadItemNodes = scrollRef.current?.querySelectorAll('.sendbird-thread-list-item');
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
            if (scrollRef.current) {
              scrollRef.current.scrollTop = scrollTop_;
            }
          } catch (error) {
            //
          }
        }
      });
    }

    // save the lastest scroll bottom value
    if (scrollRef?.current) {
      const current = scrollRef?.current;
      setScrollBottom(current.scrollHeight - current.scrollTop - current.offsetHeight);
    }
  };

  return (
    <div className='sendbird-thread-ui'>
      {
        MemorizedHeader || (
          <ThreadHeader
            className="sendbird-thread-ui__header"
            channelName={getChannelTitle(currentChannel, currentUserId ?? '', stringSet)}
            onActionIconClick={onHeaderActionClick}
            onChannelNameClick={() => {
              onMoveToParentMessage?.({ message: parentMessage, channel: currentChannel });
            }}
          />
        )
      }
      <div
        className={classnames('sendbird-thread-ui--scroll', 'sendbird-conversation__messages')}
        ref={scrollRef}
        onScroll={onScroll}
        dir={getHTMLTextDirection(config?.htmlTextDirection, config?.forceLeftToRightMessageLayout)}
      >
        <MessageProvider message={parentMessage} isByMe={isByMe}>
          {MemorizedParentMessageInfo}
        </MessageProvider>
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
              renderMessage={renderMessage}
              renderCustomSeparator={renderCustomSeparator}
              scrollRef={scrollRef}
              scrollBottom={scrollBottom}
            />
          )
        }
      </div>
      {/* MessageInput */}
      {
        renderMessageInput?.() || (
          <ThreadMessageInput
            className="sendbird-thread-ui__message-input"
            renderFileUploadIcon={renderFileUploadIcon}
            renderVoiceMessageIcon={renderVoiceMessageIcon}
            renderSendMessageIcon={renderSendMessageIcon}
          />
        )
      }
    </div>
  );
};

export default ThreadUI;
