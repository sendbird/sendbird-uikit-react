import './notification-list.scss';

import React, { useEffect } from "react";

import { renderMessage, renderMessageHeader } from "../../types";
import { useNotficationChannelContext } from "../../context/NotificationChannelProvider";
import NotificationMessageWrap from "../NotificationMessageWrap";
import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';

const OFF_SET = 50;
const shouldScroll = (clientHeight: number, scrollTop: number, scrollHeight: number) => {
  return (clientHeight + scrollTop + OFF_SET) > scrollHeight;
};
const SCROLL_DEBOUNCE = 400;

type Props = {
  renderMessage?: renderMessage;
  renderMessageHeader?: renderMessageHeader;
}

export default function NotificationList({
  renderMessage,
  renderMessageHeader,
}: Props) {
  const {
    allMessages,
    scrollRef,
    onFetchMore,
    hasMore,
  } = useNotficationChannelContext();

  useEffect(() => {
    let timerId;
    const scrollDiv = scrollRef?.current;
    const handleScroll = () => {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        const { scrollTop, clientHeight, scrollHeight } = scrollDiv;
        if (shouldScroll(clientHeight, scrollTop, scrollHeight) && hasMore) {
          const nodes = scrollRef.current.querySelectorAll('.sendbird-notification-channel__message-wrap');
          const last = nodes?.[nodes?.length - 1];
          onFetchMore(([messages]) => {
            if (messages?.length > 0) {
              // https://github.com/scabbiaza/react-scroll-position-on-updating-dom
              // Set block to nearest to prevent unexpected scrolling from outer components
              try {
                last.scrollIntoView({ block: "start", inline: "nearest" });
              } catch (error) {
                //
              }
            }
          });
        }
      }, SCROLL_DEBOUNCE);
    };
    scrollDiv?.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timerId);
      scrollDiv?.removeEventListener("scroll", handleScroll);
    };
  }, [onFetchMore, hasMore, scrollRef?.current]);

  if (allMessages.length === 0) {
    return (
      <div className="sendbird-notification-channel__list" data-notificationuistate="empty">
        <PlaceHolder
          type={PlaceHolderTypes.NO_NOTIFICATIONS}
          className="sendbird-notification-channel__placeholder"
        />
      </div>
    );
  }

  return (
    <div className="sendbird-notification-channel__list" data-notificationuistate="loaded" ref={scrollRef}>
      <div>
        {
          allMessages.map((message) => {
            return (
              <NotificationMessageWrap
                key={message?.messageId}
                message={message}
                renderMessage={renderMessage}
                renderMessageHeader={renderMessageHeader}
              />
            );
          })
        }
      </div>
    </div>
  );
}
