import { ReactElement, ReactNode, useMemo, useRef } from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { AdminMessage as AdminMessageType, ThreadInfo, UserMessage } from '@sendbird/chat/message';

import { createRoot } from 'react-dom/client';
import { SendbirdContext, createSendbirdContextStore } from '../../src/lib/Sendbird/context/SendbirdContext';
import { LocalizationProvider } from '../../src/lib/LocalizationContext';
import getStringSet from '../../src/ui/Label/stringSet';
import Label, { LabelColors, LabelTypography } from '../../src/ui/Label';
import Button, { ButtonSizes, ButtonTypes } from '../../src/ui/Button';
import TextButton from '../../src/ui/TextButton';
import Icon, { IconColors, IconTypes } from '../../src/ui/Icon';
import IconButton from '../../src/ui/IconButton';
import Avatar from '../../src/ui/Avatar';
import Badge from '../../src/ui/Badge';
import DateSeparator from '../../src/ui/DateSeparator';
import AdminMessage from '../../src/ui/AdminMessage';
import TextMessageItemBody from '../../src/ui/TextMessageItemBody';
import MessageStatus from '../../src/ui/MessageStatus';
import ConnectionStatus from '../../src/ui/ConnectionStatus';
import PlaceHolder, { PlaceHolderTypes } from '../../src/ui/PlaceHolder';
import ThreadReplies from '../../src/ui/ThreadReplies';
import ReactionButton from '../../src/ui/ReactionButton';
import ReactionBadge from '../../src/ui/ReactionBadge';
import QuoteMessage from '../../src/ui/QuoteMessage';
import MessageInput from '../../src/ui/MessageInput';
import { MenuItem, MenuItems, MenuRoot } from '../../src/ui/ContextMenu';
import BottomSheet from '../../src/ui/BottomSheet';
import { Toggle } from '../../src/ui/Toggle';
import Checkbox from '../../src/ui/Checkbox';
import ProgressBar from '../../src/ui/ProgressBar';
import Header from '../../src/ui/Header';
import { MODAL_ROOT } from '../../src/hooks/useModal';
import { APP_LAYOUT_ROOT } from '../../src/modules/App/const';
import { UI_VISUAL_CASE_IDS, UiVisualCaseId } from './visualCaseIds';
import '../../src/lib/index.scss';
import './visual-cases.scss';

type VisualCase = {
  id: UiVisualCaseId;
  title: string;
  theme?: 'light' | 'dark';
  render: () => ReactElement;
};

type VisualUser = {
  userId: string;
  nickname: string;
  profileUrl: string;
};

type MockUserMessage = UserMessage & {
  parentMessage?: UserMessage;
  threadInfo?: ThreadInfo;
};

type MockUserMessageOverrides = Partial<{
  messageId: number;
  message: string;
  sender: VisualUser;
  createdAt: number;
  updatedAt: number;
  sendingStatus: string;
  reactions: unknown[];
  mentionedUsers: VisualUser[];
  mentionedMessageTemplate: string;
  threadInfo: ThreadInfo;
  parentMessage: UserMessage;
  parentMessageId: number;
}>;

const stringSet = getStringSet('en');
const noop = () => {};

const groupChannel = {
  channelType: 'group',
  url: 'visual-group-channel',
  name: 'Design QA',
  isGroupChannel: () => true,
  isOpenChannel: () => false,
  isSuper: false,
  isBroadcast: false,
  isEphemeral: false,
  getUnreadMemberCount: () => 0,
  getUndeliveredMemberCount: () => 0,
} as unknown as GroupChannel;

const currentUser = { userId: 'current-user', nickname: 'You', profileUrl: '' };
const otherUsers = [
  { userId: 'alex', nickname: 'Alex', profileUrl: '' },
  { userId: 'bee', nickname: 'Bee', profileUrl: '' },
  { userId: 'cara', nickname: 'Cara', profileUrl: '' },
  { userId: 'dev', nickname: 'Dev', profileUrl: '' },
  { userId: 'eve', nickname: 'Eve', profileUrl: '' },
];

function userMessage(overrides: MockUserMessageOverrides = {}): MockUserMessage {
  return {
    messageId: overrides.messageId ?? 1000,
    messageType: 'user',
    isUserMessage: () => true,
    message: overrides.message ?? 'Message preview',
    sender: overrides.sender ?? otherUsers[0],
    createdAt: overrides.createdAt ?? 1724815262717,
    updatedAt: overrides.updatedAt ?? 0,
    sendingStatus: overrides.sendingStatus ?? 'succeeded',
    reactions: overrides.reactions ?? [],
    mentionedUsers: overrides.mentionedUsers ?? [],
    mentionedMessageTemplate: overrides.mentionedMessageTemplate ?? '',
    threadInfo: overrides.threadInfo,
    parentMessage: overrides.parentMessage,
    parentMessageId: overrides.parentMessageId,
  } as unknown as MockUserMessage;
}

function adminMessage(message: string): AdminMessageType {
  return {
    messageId: 9000,
    messageType: 'admin',
    isAdminMessage: () => true,
    message,
  } as unknown as AdminMessageType;
}

function threadInfo(replyCount: number, mostRepliedUsers: VisualUser[] = otherUsers): ThreadInfo {
  return {
    replyCount,
    mostRepliedUsers,
  } as unknown as ThreadInfo;
}

function VisualProviders({ children }: { children: ReactNode }) {
  const store = useMemo(() => {
    const overrides = {
      config: {
        userId: currentUser.userId,
        groupChannel: {
          enableDocument: true,
          enableVoiceMessage: true,
          enableMarkdownForUserMessage: true,
        },
        logger: {
          info: noop,
          warning: noop,
          error: noop,
        },
      },
    } as unknown as Parameters<typeof createSendbirdContextStore>[0];

    return createSendbirdContextStore(overrides);
  }, []);

  return (
    <SendbirdContext.Provider value={store}>
      <LocalizationProvider stringSet={stringSet}>
        <>{children}</>
      </LocalizationProvider>
    </SendbirdContext.Provider>
  );
}

function CaseFrame({ title, theme = 'light', children }: { title: string; theme?: 'light' | 'dark'; children: ReactNode }) {
  return (
    <div className={`visual-case sendbird-theme--${theme}`} data-testid="visual-case">
      <div className="visual-case__title">
        <Label type={LabelTypography.H_2} color={LabelColors.ONBACKGROUND_1}>{title}</Label>
      </div>
      {children}
    </div>
  );
}

function Bubble({ outgoing = false, children }: { outgoing?: boolean; children: ReactNode }) {
  return (
    <div className={`visual-case__bubble visual-case__bubble--${outgoing ? 'outgoing' : 'incoming'}`}>
      {children}
    </div>
  );
}

function StatusSample({ label, message }: { label: string; message: MockUserMessage }) {
  return (
    <div className="visual-case__panel">
      <Label type={LabelTypography.CAPTION_2} color={LabelColors.ONBACKGROUND_2}>{label}</Label>
      <MessageStatus channel={groupChannel} message={message} />
    </div>
  );
}

type IconType = Parameters<typeof Icon>[0]['type'];

function ReactionIcon({ type = IconTypes.EMOJI_MORE }: { type?: IconType }) {
  return <Icon type={type} fillColor={IconColors.ON_BACKGROUND_2} width="20px" height="20px" />;
}

function MessageInputCase({ mode }: { mode: 'compose' | 'edit' | 'disabled' }) {
  const isEdit = mode === 'edit';
  const disabled = mode === 'disabled';
  return (
    <div className="visual-case__column">
      <MessageInput
        channel={groupChannel}
        channelUrl={groupChannel.url}
        isEdit={isEdit}
        disabled={disabled}
        value={isEdit ? 'Follow up with the release checklist' : undefined}
        message={isEdit ? userMessage({ messageId: 444, message: 'Follow up with the release checklist' }) : undefined}
        placeholder={disabled ? stringSet.MESSAGE_INPUT__PLACE_HOLDER__DISABLED : stringSet.MESSAGE_INPUT__PLACE_HOLDER}
        isVoiceMessageEnabled
        isSelectingMultipleFilesEnabled
        onSendMessage={noop}
        onUpdateMessage={noop}
        onCancelEdit={noop}
      />
    </div>
  );
}

function StaticMenuCase() {
  const parentRef = useRef<HTMLDivElement>(null);
  return (
    <div id={APP_LAYOUT_ROOT} className="visual-case__panel" ref={parentRef} style={{ height: 210, position: 'relative' }}>
      <MenuRoot />
      <Button type={ButtonTypes.SECONDARY} size={ButtonSizes.SMALL}>Message actions</Button>
      <MenuItems parentRef={parentRef} closeDropdown={noop} testID="visual-context-menu">
        <MenuItem onClick={noop}>Copy</MenuItem>
        <MenuItem onClick={noop}>Reply</MenuItem>
        <MenuItem onClick={noop}>Reply in thread</MenuItem>
        <MenuItem onClick={noop} disable>Delete</MenuItem>
      </MenuItems>
    </div>
  );
}

function BottomSheetCase() {
  return (
    <div id={MODAL_ROOT} className="visual-case__panel" style={{ height: 260, position: 'relative' }}>
      <BottomSheet>
        <div className="visual-case__column" style={{ padding: 16 }}>
          <Label type={LabelTypography.H_2} color={LabelColors.ONBACKGROUND_1}>Message options</Label>
          <Button type={ButtonTypes.SECONDARY} size={ButtonSizes.SMALL}>Reply</Button>
          <Button type={ButtonTypes.DANGER} size={ButtonSizes.SMALL}>Delete</Button>
        </div>
      </BottomSheet>
    </div>
  );
}

function ChannelItem({ name, message, unread }: { name: string; message: string; unread?: number }) {
  return (
    <div className="visual-case__channel-item">
      <Avatar width="40px" height="40px" alt={name} />
      <div className="visual-case__channel-copy">
        <Label type={LabelTypography.SUBTITLE_2} color={LabelColors.ONBACKGROUND_1}>{name}</Label>
        <Label type={LabelTypography.BODY_2} color={LabelColors.ONBACKGROUND_2}>{message}</Label>
      </div>
      {unread ? <Badge count={unread} /> : null}
    </div>
  );
}

function ChannelShell({ open = false }: { open?: boolean }) {
  return (
    <div className="visual-case__channel-shell">
      <div className="visual-case__channel-list">
        <Header
          renderMiddle={() => <Header.Title title={open ? 'Open channels' : 'Channels'} subtitle="3 active" />}
          renderRight={() => <Header.IconButton type={IconTypes.CREATE} />}
        />
        <ChannelItem name="Design QA" message="Alex: Layout reviewed" unread={3} />
        <ChannelItem name="Release room" message="You: Snapshots updated" />
        <ChannelItem name="Support" message="Cara: Reproduced on Safari" unread={12} />
      </div>
      <div className="visual-case__channel-main">
        <Header
          renderLeft={() => <Avatar width="32px" height="32px" alt="Design QA" />}
          renderMiddle={() => <Header.Title title={open ? 'Community lounge' : 'Design QA'} subtitle={open ? '128 participants' : '5 members'} />}
          renderRight={() => <Header.IconButton type={IconTypes.INFO} />}
        />
        <div className="visual-case__message-stack">
          <Bubble>
            <TextMessageItemBody message={userMessage({ message: open ? 'Welcome to the open channel.' : 'The message row should stay aligned.' })} />
          </Bubble>
          <Bubble outgoing>
            <TextMessageItemBody isByMe message={userMessage({ sender: currentUser, message: 'Visual smoke looks stable.' })} />
          </Bubble>
          <ThreadReplies threadInfo={threadInfo(6)} />
        </div>
      </div>
    </div>
  );
}

const cases: VisualCase[] = [
  {
    id: 'message-text-states',
    title: 'Message Text States',
    render: () => (
      <div className="visual-case__bubble-row">
        <Bubble><TextMessageItemBody message={userMessage({ message: 'Incoming message with https://sendbird.com link' })} /></Bubble>
        <Bubble outgoing><TextMessageItemBody isByMe message={userMessage({ sender: currentUser, message: 'Outgoing message with markdown **bold** text' })} isMarkdownEnabled /></Bubble>
        <Bubble><TextMessageItemBody message={userMessage({ message: 'Edited message keeps suffix spacing', updatedAt: 1724815362717 })} /></Bubble>
      </div>
    ),
  },
  {
    id: 'message-text-overflow',
    title: 'Message Text Overflow',
    render: () => (
      <div className="visual-case__bubble-row">
        <Bubble>
          <TextMessageItemBody message={userMessage({ message: 'A long message wraps without expanding the channel wider than the viewport and preserves readable spacing across browsers.' })} />
        </Bubble>
        <Bubble outgoing>
          <TextMessageItemBody isByMe message={userMessage({ sender: currentUser, message: 'Supercalifragilisticexpialidocious-super-long-token-should-not-break-layout' })} />
        </Bubble>
      </div>
    ),
  },
  {
    id: 'message-admin-separators',
    title: 'Admin And Date Separators',
    render: () => (
      <div className="visual-case__column">
        <DateSeparator>Today</DateSeparator>
        <AdminMessage message={adminMessage('Channel frozen by an operator')} />
        <DateSeparator>Yesterday</DateSeparator>
      </div>
    ),
  },
  {
    id: 'message-status-states',
    title: 'Message Status States',
    render: () => (
      <div className="visual-case__row">
        <StatusSample label="Sent" message={userMessage({ sendingStatus: 'succeeded' })} />
        <StatusSample label="Read" message={userMessage({ sendingStatus: 'succeeded' })} />
        <StatusSample label="Failed" message={userMessage({ sendingStatus: 'failed' })} />
      </div>
    ),
  },
  {
    id: 'message-placeholder-connection',
    title: 'Placeholder And Connection',
    render: () => (
      <div className="visual-case__row">
        <div className="visual-case__panel"><PlaceHolder type={PlaceHolderTypes.NO_MESSAGES} /></div>
        <div className="visual-case__panel"><PlaceHolder type={PlaceHolderTypes.WRONG} retryToConnect={noop} /></div>
        <ConnectionStatus />
      </div>
    ),
  },
  {
    id: 'thread-reply-summary',
    title: 'Thread Reply Summary',
    render: () => <ThreadReplies threadInfo={threadInfo(7, otherUsers.slice(0, 3))} />,
  },
  {
    id: 'thread-reply-overflow',
    title: 'Thread Reply Overflow',
    render: () => <ThreadReplies threadInfo={threadInfo(128)} />,
  },
  {
    id: 'reaction-button-states',
    title: 'Reaction Button States',
    render: () => (
      <div className="visual-case__row">
        <ReactionButton width={44} height={36}><ReactionIcon /></ReactionButton>
        <ReactionButton selected width={44} height={36}><ReactionIcon type={IconTypes.FEEDBACK_LIKE} /></ReactionButton>
        <ReactionButton width={44} height={36}><ReactionIcon type={IconTypes.PLUS} /></ReactionButton>
      </div>
    ),
  },
  {
    id: 'reaction-badge-strip',
    title: 'Reaction Badge Strip',
    render: () => (
      <div className="visual-case__row">
        <ReactionBadge count={1}><ReactionIcon type={IconTypes.FEEDBACK_LIKE} /></ReactionBadge>
        <ReactionBadge selected count={24}><ReactionIcon type={IconTypes.FEEDBACK_DISLIKE} /></ReactionBadge>
        <ReactionBadge isAdd><ReactionIcon type={IconTypes.PLUS} /></ReactionBadge>
      </div>
    ),
  },
  {
    id: 'quote-message-states',
    title: 'Quote Message States',
    render: () => (
      <div className="visual-case__column">
        <QuoteMessage
          userId={currentUser.userId}
          message={userMessage({
            sender: currentUser,
            parentMessageId: 777,
            parentMessage: userMessage({ messageId: 777, message: 'Original quoted text', sender: otherUsers[1] }),
          })}
          isByMe
        />
        <QuoteMessage
          userId={currentUser.userId}
          message={userMessage({ parentMessage: userMessage({ messageId: 778, message: '', sender: otherUsers[2] }) })}
          isUnavailable
        />
      </div>
    ),
  },
  {
    id: 'message-input-compose',
    title: 'Message Input Compose',
    render: () => <MessageInputCase mode="compose" />,
  },
  {
    id: 'message-input-edit',
    title: 'Message Input Edit',
    render: () => <MessageInputCase mode="edit" />,
  },
  {
    id: 'message-input-disabled',
    title: 'Message Input Disabled',
    render: () => <MessageInputCase mode="disabled" />,
  },
  {
    id: 'context-menu-actions',
    title: 'Context Menu Actions',
    render: () => <StaticMenuCase />,
  },
  {
    id: 'bottom-sheet-actions',
    title: 'Bottom Sheet Actions',
    render: () => <BottomSheetCase />,
  },
  {
    id: 'channel-list-shell',
    title: 'Channel List Shell',
    render: () => (
      <div className="visual-case__channel-list" style={{ maxWidth: 360, border: '1px solid var(--sendbird-light-onlight-04)' }}>
        <Header renderMiddle={() => <Header.Title title="Channels" subtitle="All messages" />} renderRight={() => <Header.IconButton type={IconTypes.CREATE} />} />
        <ChannelItem name="Design QA" message="Alex: Layout reviewed" unread={3} />
        <ChannelItem name="Release room" message="You: Snapshots updated" />
        <ChannelItem name="Support" message="Cara: Reproduced on Safari" unread={12} />
      </div>
    ),
  },
  {
    id: 'group-channel-shell',
    title: 'Group Channel Shell',
    render: () => <ChannelShell />,
  },
  {
    id: 'open-channel-shell',
    title: 'Open Channel Shell',
    render: () => <ChannelShell open />,
  },
  {
    id: 'channel-settings-shell',
    title: 'Channel Settings Shell',
    render: () => (
      <div className="visual-case__settings-layout">
        <div className="visual-case__panel">
          <Avatar width="64px" height="64px" alt="Channel" />
          <Label type={LabelTypography.H_2} color={LabelColors.ONBACKGROUND_1}>Design QA</Label>
          <Label type={LabelTypography.BODY_2} color={LabelColors.ONBACKGROUND_2}>5 members</Label>
        </div>
        <div className="visual-case__column">
          <Button type={ButtonTypes.SECONDARY} size={ButtonSizes.SMALL}>Invite users</Button>
          <Button type={ButtonTypes.SECONDARY} size={ButtonSizes.SMALL}>Operators</Button>
          <Button type={ButtonTypes.DANGER} size={ButtonSizes.SMALL}>Leave channel</Button>
        </div>
      </div>
    ),
  },
  {
    id: 'toolbar-controls',
    title: 'Toolbar Controls',
    render: () => (
      <div className="visual-case__toolbar">
        <IconButton><Icon type={IconTypes.SEARCH} fillColor={IconColors.ON_BACKGROUND_2} /></IconButton>
        <IconButton><Icon type={IconTypes.NOTIFICATIONS} fillColor={IconColors.ON_BACKGROUND_2} /></IconButton>
        <Toggle checked width="44px" />
        <Checkbox checked />
        <TextButton><Label type={LabelTypography.BUTTON_1} color={LabelColors.PRIMARY}>View details</Label></TextButton>
        <ProgressBar maxSize={100} currentSize={68} />
      </div>
    ),
  },
  {
    id: 'theme-dark-message-cases',
    title: 'Dark Theme Messages',
    theme: 'dark',
    render: () => (
      <div className="visual-case__bubble-row">
        <Bubble><TextMessageItemBody message={userMessage({ message: 'Incoming dark theme message' })} /></Bubble>
        <Bubble outgoing><TextMessageItemBody isByMe message={userMessage({ sender: currentUser, message: 'Outgoing dark theme message' })} /></Bubble>
        <ReactionBadge selected count={9}><ReactionIcon type={IconTypes.FEEDBACK_LIKE} /></ReactionBadge>
      </div>
    ),
  },
];

const caseMap = new Map(cases.map((item) => [item.id, item]));

function VisualCases({ caseId }: { caseId?: UiVisualCaseId }): ReactElement {
  const id = caseId ?? UI_VISUAL_CASE_IDS[0];
  const visualCase = caseMap.get(id ?? UI_VISUAL_CASE_IDS[0]);

  if (!visualCase) {
    return <></>;
  }

  return (
    <VisualProviders>
      <div className="visual-cases-page">
        <CaseFrame title={visualCase.title} theme={visualCase.theme}>
          {visualCase.render()}
        </CaseFrame>
      </div>
    </VisualProviders>
  );
}

export function mountVisualCase(caseId: UiVisualCaseId): void {
  const target = document.getElementById('visual-root');
  if (!target) {
    throw new Error('Missing #visual-root container for visual case');
  }

  createRoot(target).render(<VisualCases caseId={caseId} />);
}
