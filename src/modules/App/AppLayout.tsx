import React, { useState } from 'react';

import type { AppLayoutProps } from './types';

import { useMediaQueryContext } from '../../lib/MediaQueryContext';
import { DesktopLayout } from './DesktopLayout';
import { MobileLayout } from './MobileLayout';

import { SendableMessageType } from '../../utils';
import { getCaseResolvedReplyType } from '../../lib/utils/resolvedReplyType';
import useSendbird from '../../lib/Sendbird/context/hooks/useSendbird';

export const AppLayout = (props: AppLayoutProps) => {
  const {
    isMessageGroupingEnabled,
    allowProfileEdit,
    onProfileEditSuccess,
    disableAutoSelect,
    currentChannel,
    setCurrentChannel,
    enableLegacyChannelModules,
  } = props;

  // const { state } = useSendbird();
  // const globalConfigs = state.config;

  const [showThread, setShowThread] = useState(false);
  const [threadTargetMessage, setThreadTargetMessage] = useState<SendableMessageType | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [highlightedMessage, setHighlightedMessage] = useState<number | null>(null);
  const [startingPoint, setStartingPoint] = useState<number | null>(null);
  const { isMobile } = useMediaQueryContext();

  /**
   * Below configs can be set via Dashboard UIKit config setting but as a lower priority than App props.
   * So need to be have fallback value \w global configs even though each prop values are undefined
   */
  const replyType = props.replyType;
  const isReactionEnabled = props.isReactionEnabled;
  const showSearchIcon = props.showSearchIcon;
  // const replyType = props.replyType ?? getCaseResolvedReplyType(globalConfigs.groupChannel.replyType).upperCase;
  // const isReactionEnabled = props.isReactionEnabled ?? globalConfigs.groupChannel.enableReactions;
  // const showSearchIcon = props.showSearchIcon ?? globalConfigs.groupChannelSettings.enableMessageSearch;

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
              enableLegacyChannelModules={enableLegacyChannelModules}
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
              enableLegacyChannelModules={enableLegacyChannelModules}
            />
          )
      }
    </>
  );
};
