import React, { useState } from 'react';
import type { FileMessage, UserMessage } from '@sendbird/chat/message';

import type { AppLayoutProps } from './types';

import { useMediaQueryContext } from '../../lib/MediaQueryContext';
import { DesktopLayout } from './DesktopLayout';
import { MobileLayout } from './MobileLayout';

import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';

export const AppLayout: React.FC<AppLayoutProps> = (
  props: AppLayoutProps,
) => {
  const {
    isMessageGroupingEnabled,
    allowProfileEdit,
    onProfileEditSuccess,
    disableAutoSelect,
    currentChannel,
    setCurrentChannel,
  } = props;

  const globalStore = useSendbirdStateContext();
  const globalConfigs = globalStore?.config;

  const [showThread, setShowThread] = useState(false);
  const [threadTargetMessage, setThreadTargetMessage] = useState<UserMessage | FileMessage | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [highlightedMessage, setHighlightedMessage] = useState<number | null>(null);
  const [startingPoint, setStartingPoint] = useState<number | null>(null);
  const { isMobile } = useMediaQueryContext();

  /**
   * Below configs can be set via Dashboard UIKit config setting but as a lower priority than App props.
   * So need to be have fallback value \w global configs even though each prop values are undefined
   */
  const replyType = props.replyType ?? globalConfigs?.replyType;
  const isReactionEnabled = props.isReactionEnabled ?? globalConfigs?.isReactionEnabled;
  const showSearchIcon = props.showSearchIcon ?? globalConfigs?.showSearchIcon;

  return (
    <>
      {
        isMobile
          ? (
            <MobileLayout
              replyType={replyType}
              showSearchIcon={showSearchIcon}
              isReactionEnabled={isReactionEnabled}
              isMessageGroupingEnabled={isMessageGroupingEnabled}
              allowProfileEdit={allowProfileEdit}
              onProfileEditSuccess={onProfileEditSuccess}
              currentChannel={currentChannel}
              setCurrentChannel={setCurrentChannel}
              highlightedMessage={highlightedMessage}
              setHighlightedMessage={setHighlightedMessage}
              startingPoint={startingPoint}
              setStartingPoint={setStartingPoint}
              threadTargetMessage={threadTargetMessage}
              setThreadTargetMessage={setThreadTargetMessage}
            />
          )
          : (
            <DesktopLayout
              replyType={replyType}
              isReactionEnabled={isReactionEnabled}
              showSearchIcon={showSearchIcon}
              isMessageGroupingEnabled={isMessageGroupingEnabled}
              allowProfileEdit={allowProfileEdit}
              onProfileEditSuccess={onProfileEditSuccess}
              disableAutoSelect={disableAutoSelect}
              currentChannel={currentChannel}
              setCurrentChannel={setCurrentChannel}
              showThread={showThread}
              setShowThread={setShowThread}
              threadTargetMessage={threadTargetMessage}
              setThreadTargetMessage={setThreadTargetMessage}
              showSettings={showSettings}
              setShowSettings={setShowSettings}
              showSearch={showSearch}
              setShowSearch={setShowSearch}
              highlightedMessage={highlightedMessage}
              setHighlightedMessage={setHighlightedMessage}
              startingPoint={startingPoint}
              setStartingPoint={setStartingPoint}
            />
          )
      }
    </>
  );
};
