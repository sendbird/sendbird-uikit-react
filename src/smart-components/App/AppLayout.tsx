import React, { useState } from 'react';

import type { AppLayoutProps } from './types';

import { useMediaQueryContext } from '../../lib/MediaQueryContext';

import { DesktopLayout } from './DesktopLayout';
import { MobileLayout } from './MobileLayout';

export const AppLayout: React.FC<AppLayoutProps> = (
  props: AppLayoutProps,
) => {
  const {
    isReactionEnabled,
    replyType,
    isMessageGroupingEnabled,
    allowProfileEdit,
    showSearchIcon,
    onProfileEditSuccess,
    disableAutoSelect,
    currentChannelUrl,
    setCurrentChannelUrl,
  } = props;
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [highlightedMessage, setHighlightedMessage] = useState<number>(null);
  const [startingPoint, setStartingPoint] = useState<number>(null);
  const { isMobile } = useMediaQueryContext();
  return (
    <>
      {
        isMobile
          ? (
            <MobileLayout
              replyType={replyType}
              isMessageGroupingEnabled={isMessageGroupingEnabled}
              allowProfileEdit={allowProfileEdit}
              isReactionEnabled={isReactionEnabled}
              showSearchIcon={showSearchIcon}
              onProfileEditSuccess={onProfileEditSuccess}
              currentChannelUrl={currentChannelUrl}
              setCurrentChannelUrl={setCurrentChannelUrl}
              highlightedMessage={highlightedMessage}
              setHighlightedMessage={setHighlightedMessage}
              startingPoint={startingPoint}
              setStartingPoint={setStartingPoint}
            />
          )
          : (
            <DesktopLayout
              isReactionEnabled={isReactionEnabled}
              replyType={replyType}
              isMessageGroupingEnabled={isMessageGroupingEnabled}
              allowProfileEdit={allowProfileEdit}
              showSearchIcon={showSearchIcon}
              onProfileEditSuccess={onProfileEditSuccess}
              disableAutoSelect={disableAutoSelect}
              currentChannelUrl={currentChannelUrl}
              setCurrentChannelUrl={setCurrentChannelUrl}
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
  )
}
