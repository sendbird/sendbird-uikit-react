import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';
import MessageContent from '@sendbird/uikit-react/ui/MessageContent';
import MobileMenu from '@sendbird/uikit-react/ui/MobileMenu';
import { MessageMenu, type MessageMenuProps } from '@sendbird/uikit-react/ui/MessageMenu';
import '@sendbird/uikit-react/dist/index.css';
import { ChannelWithCopyMessageId, CopyIdMessageContent, CopyMessageIdMenu, CopyMessageIdMobileMenu, type CopyResult } from './integration';
import { emojiContainer, menuFixture, type Scenario } from './fixture';
import { GroupChannelFixture } from '../shared/group-channel-fixture';
import '../shared/page.css';
import './style.css';

const query = new URLSearchParams(location.search);
const providerOptions = { groupChannel: { enableMarkAsUnread: query.has('mark-as-unread') } };

const scenarios: { value: Scenario; label: string }[] = [
  { value: 'own', label: 'My delivered message' },
  { value: 'own-hide-delete', label: 'My message with Delete hidden on mobile' },
  { value: 'other', label: 'Someone else’s delivered message' },
  { value: 'other-reply', label: 'Someone else’s reply' },
  { value: 'other-parent-only', label: 'Reply outside a thread list' },
  { value: 'other-thread-only', label: 'Top-level message in a thread list' },
  { value: 'other-ephemeral', label: 'Message in an ephemeral channel' },
  { value: 'other-broadcast', label: 'Message in a broadcast channel' },
  { value: 'other-thread-mode', label: 'Message with THREAD reply mode' },
  { value: 'other-jump-parent', label: 'Message with a jump-to-parent callback' },
  { value: 'pending', label: 'My pending message' },
  { value: 'failed', label: 'My failed message' },
];

function App() {
  const [scenario, setScenario] = useState<Scenario>('other');
  const [extended, setExtended] = useState(true);
  const [reactions, setReactions] = useState(false);
  const [result, setResult] = useState('');
  const props = menuFixture(scenario);
  const demo = { extended, props, report: setResult, scenario };

  return (
    <main className="copy-id-demo">
      <a className="recipe-back" href="../">All recipes</a>
      <h1>Copy message ID menu</h1>
      <section aria-label="Message action demo">
        <div className="controls">
          <div className="scenario">
            <label htmlFor="message-scenario">Message</label>
            <select id="message-scenario" value={scenario} onChange={event => { setScenario(event.target.value as Scenario); setResult(''); }}>
              {scenarios.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>
          <label><input type="checkbox" checked={extended} onChange={event => { setExtended(event.target.checked); setResult(''); }} /> Add ID action</label>
          <label><input type="checkbox" checked={reactions} onChange={event => { setReactions(event.target.checked); setResult(''); }} /> Reactions</label>
        </div>
        <SendbirdProvider appId="" userId="self" breakpoint="600px" uikitOptions={providerOptions}>
          <div className="message">
            <p>A sample message</p>
            <Menu key={`${scenario}-${extended}`} {...demo} />
          </div>
          <h2>Message with the long-press menu</h2>
          <p className="hint">Below 600px wide, press and hold the message to open UIKit's mobile menu.</p>
          <div className="message-content sendbird-conversation__messages" dir="ltr" data-testid="message-content">
            <Content key={`${scenario}-${extended}-${reactions}`} {...demo} reactions={reactions} />
          </div>
        </SendbirdProvider>
        {result && <output role="status">{result}</output>}
      </section>
    </main>
  );
}

type DemoProps = {
  extended: boolean;
  scenario: Scenario;
  props: ReturnType<typeof menuFixture>;
  report: (event: string) => void;
};

// Fixture-only: UIKit's stock actions stop at these local callbacks.
function stockCallbacks(report: DemoProps['report']) {
  return {
    showEdit: (open: boolean) => { if (open) report('UIKit opened edit'); },
    showRemove: (open: boolean) => { if (open) report('UIKit opened delete confirmation'); },
    deleteMessage: async () => report('UIKit requested local deletion'),
    resendMessage: () => report('UIKit requested retry'),
    setQuoteMessage: () => report('UIKit requested quote reply'),
  };
}

const copyReporter = (report: DemoProps['report']) => ({ messageId, copied }: CopyResult) =>
  report(copied ? `Copied ID ${messageId}` : 'Clipboard is unavailable');

function Menu({ extended, props, report, scenario }: DemoProps) {
  const menuProps: MessageMenuProps = {
    ...props,
    ...stockCallbacks(report),
    ...(scenario === 'other-jump-parent' && { onMoveToParentMessage: () => report('UIKit jumped to parent') }),
    renderTrigger: ({ ref, onClick }) => (
      <button type="button" ref={ref} onClick={onClick} aria-haspopup="menu">Open menu</button>
    ),
  };
  return extended
    ? <CopyMessageIdMenu {...menuProps} onCopyResult={copyReporter(report)} />
    : <MessageMenu {...menuProps} />;
}

function Content({ extended, props, report, reactions, scenario }: DemoProps & { reactions: boolean }) {
  const onCopyResult = copyReporter(report);
  const contentProps = {
    ...stockCallbacks(report),
    message: props.message,
    channel: props.channel as Parameters<typeof MessageContent>[0]['channel'],
    userId: 'self',
    replyType: props.replyType,
    isReactionEnabled: reactions,
    emojiContainer,
    toggleReaction: () => report('UIKit toggled a reaction'),
  };
  if (scenario === 'own-hide-delete' || scenario === 'other-thread-only') {
    // Thread rows supply inThreadList to both menus. Delete visibility here is a mobile-only override.
    return <MessageContent {...contentProps}
      renderMessageMenu={incoming => {
        const desktopProps = { ...incoming, inThreadList: props.inThreadList };
        return extended
          ? <CopyMessageIdMenu {...desktopProps} onCopyResult={onCopyResult} />
          : <MessageMenu {...desktopProps} />;
      }}
      renderMobileMenuOnLongPress={incoming => {
        const mobileProps: Parameters<typeof MobileMenu>[0] = {
          ...incoming,
          inThreadList: props.inThreadList,
          deleteMenuState: scenario === 'own-hide-delete' ? 'HIDE' : incoming.deleteMenuState,
        };
        return extended
          ? <CopyMessageIdMobileMenu {...mobileProps} onCopyResult={onCopyResult} />
          : <MobileMenu {...mobileProps} />;
      }} />;
  }
  return extended
    ? <CopyIdMessageContent {...contentProps} onCopyResult={onCopyResult} />
    : <MessageContent {...contentProps} />;
}

function WrapperFixture() {
  return <main className="copy-id-demo">
    <GroupChannelFixture record={() => {}} uikitOptions={{ groupChannel: { enableReactions: false } }}>
      <section aria-label="Copy wrapper" style={{ height: 600 }}>
        <ChannelWithCopyMessageId channelUrl="fixture-A" />
      </section>
    </GroupChannelFixture>
  </main>;
}

createRoot(document.getElementById('root')!).render(
  query.has('wrapper') ? <WrapperFixture /> : <App />,
);
