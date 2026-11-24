import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';
import '@sendbird/uikit-react/dist/index.css';
import { MessageExamples } from './fixture-messages';
import { ChannelPreviewExample } from './fixture-channel-list';
import type { MessageKind, SelectedChannel } from './scenario';
import '../shared/page.css';
import './style.css';

const scenarios: { kind: MessageKind; label: string }[] = [
  { kind: 'text', label: 'Plain text' },
  { kind: 'new', label: 'New product card' },
  { kind: 'edited', label: 'Edit product title' },
  { kind: 'file', label: 'File' },
  { kind: 'unknown', label: 'Unknown type' },
  { kind: 'malformed', label: 'Malformed product' },
];

function App() {
  const [useDefault, setUseDefault] = useState(false);
  const [kind, setKind] = useState<MessageKind>('text');
  const [selected, selectChannel] = useState<SelectedChannel>('workshop');
  const [unread, setUnread] = useState(0);
  const [bodyOnly, setBodyOnly] = useState(false);
  return <main>
    <a className="recipe-back" href="../">All recipes</a>
    <h1>Product message and channel preview</h1>
    {/* One provider for the page; both sections reuse the same product decoder and renderers. */}
    <SendbirdProvider appId="" userId="self" breakpoint="600px">
      <section aria-labelledby="message-bodies">
        <h2 id="message-bodies">1. Message bodies</h2>
        <div className="controls">
          <label><input type="checkbox" checked={useDefault} onChange={event => setUseDefault(event.target.checked)} /> Show default message bodies</label>
        </div>
        <div className="examples"><MessageExamples useDefault={useDefault} /></div>
      </section>
      <section aria-labelledby="channel-preview">
        <h2 id="channel-preview">2. Channel list preview</h2>
        <div className="controls" role="group" aria-label="Last message in Workshop">
          {scenarios.map(({ kind: choice, label }) =>
            <button key={choice} type="button" aria-pressed={kind === choice} onClick={() => setKind(choice)}>{label}</button>)}
          <button type="button" aria-pressed={unread > 0} onClick={() => setUnread(count => count ? 0 : 1)}>Unread badge</button>
          <label><input type="checkbox" checked={bodyOnly} onChange={event => setBodyOnly(event.target.checked)} /> Customize the body only</label>
        </div>
        <ChannelPreviewExample kind={kind} unread={unread} selected={selected} selectChannel={selectChannel} bodyOnly={bodyOnly} />
      </section>
    </SendbirdProvider>
  </main>;
}

createRoot(document.getElementById('root')!).render(<App />);
