import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';
import MessageContent from '@sendbird/uikit-react/ui/MessageContent';
import { MessageMenu, type MessageMenuProps } from '@sendbird/uikit-react/ui/MessageMenu';
import '@sendbird/uikit-react/dist/index.css';
import { CopyIdMessageContent, CopyMessageIdMenu, type CopyResult } from './integration';
import { emojiContainer, menuFixture, type Scenario } from './fixture';
import '../shared/page.css';

const scenarios: { value: Scenario; label: string }[] = [
  { value: 'own', label: 'My delivered message' },
  { value: 'other', label: 'Someone else’s delivered message' },
  { value: 'other-reply', label: 'Someone else’s reply' },
  { value: 'pending', label: 'My pending message' },
  { value: 'failed', label: 'My failed message' },
];

function App() {
  const [scenario, setScenario] = useState<Scenario>('other');
  const [extended, setExtended] = useState(true);
  const [reactions, setReactions] = useState(false);
  const [result, setResult] = useState('');
  const props = menuFixture(scenario);
  const demo = { extended, props, report: setResult };

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
        <SendbirdProvider appId="" userId="self" breakpoint="600px">
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

function Menu({ extended, props, report }: DemoProps) {
  const menuProps: MessageMenuProps = {
    ...props,
    ...stockCallbacks(report),
    renderTrigger: ({ ref, onClick }) => (
      <button type="button" ref={ref} onClick={onClick} aria-haspopup="menu">Open menu</button>
    ),
  };
  return extended
    ? <CopyMessageIdMenu {...menuProps} onCopyResult={copyReporter(report)} />
    : <MessageMenu {...menuProps} />;
}

function Content({ extended, props, report, reactions }: DemoProps & { reactions: boolean }) {
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
  return extended
    ? <CopyIdMessageContent {...contentProps} onCopyResult={copyReporter(report)} />
    : <MessageContent {...contentProps} />;
}

createRoot(document.getElementById('root')!).render(<App />);
