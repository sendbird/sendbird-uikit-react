import { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';
import '@sendbird/uikit-react/dist/index.css';
import { MessageExamples } from './fixture-messages';
import { ChannelPreviewExample, type WorkshopOptions } from './fixture-channel-list';
import { ProductChat } from './integration';
import { encodeProduct } from './product';
import { GroupChannelFixture } from '../shared/group-channel-fixture';
import type { MessageKind, SelectedChannel } from './scenario';
import '../shared/page.css';
import './style.css';

// Fixture-only: app-level options are read once at load, so the form below reloads the page with them.
const query = new URLSearchParams(location.search);
const theme = query.get('theme') === 'dark' ? 'dark' : 'light';
const markAsUnread = query.has('mark-as-unread');
const mention = query.has('mention');
const workshopOptions: [keyof WorkshopOptions, string][] = [
  ['ephemeral', 'Make Workshop ephemeral'],
  ['mentioned', 'Mention me in Workshop'],
  ['defaultName', 'Use the default channel name'],
];

const scenarios: { kind: MessageKind; label: string }[] = [
  { kind: 'text', label: 'Plain text' },
  { kind: 'new', label: 'New product card' },
  { kind: 'edited', label: 'Edit product title' },
  { kind: 'file', label: 'File' },
  { kind: 'unknown', label: 'Unknown type' },
  { kind: 'malformed', label: 'Malformed product' },
];

function MountedRecipe() {
  const [operations, setOperations] = useState<string[]>([]);
  const retry = useRef<(() => void) | null>(null);
  const [retryPending, setRetryPending] = useState(false);
  const [leaveAttempts, setLeaveAttempts] = useState(0);
  const failed = useRef(false);
  async function leaveWithOneFailure() {
    setLeaveAttempts(attempts => attempts + 1);
    if (!failed.current) {
      failed.current = true;
      throw new Error('Synthetic leave failure');
    }
    setRetryPending(true);
    await new Promise<void>(resolve => { retry.current = resolve; });
    setRetryPending(false);
  }
  return <main aria-label="Mounted product recipe">
    <GroupChannelFixture breakpoint="600px" theme={theme} record={event => setOperations(current => [...current, `${event.screen}: ${event.operation}`])} seed={{
      text: 'A product in the installed UI', ...encodeProduct({ sku: 'LAMP-01', title: 'Fixture lamp' }),
      admin: query.has('admin'),
      leave: query.has('leave-fails-once') ? leaveWithOneFailure : undefined,
    }}>
      <ProductChat />
    </GroupChannelFixture>
    {retryPending && <button type="button" hidden onClick={() => retry.current?.()}>Complete synthetic leave</button>}
    {query.has('leave-fails-once') && <output data-testid="leave-attempts">{leaveAttempts}</output>}
    <output data-testid="product-operations">{operations.join(', ')}</output>
  </main>;
}

function App() {
  const [useDefault, setUseDefault] = useState(false);
  const [kind, setKind] = useState<MessageKind>('text');
  const [selected, selectChannel] = useState<SelectedChannel>('workshop');
  const [unread, setUnread] = useState(0);
  const [bodyOnly, setBodyOnly] = useState(false);
  const [workshop, setWorkshop] = useState<WorkshopOptions>({ ephemeral: false, mentioned: false, defaultName: false });
  return <main>
    <a className="recipe-back" href="../">All recipes</a>
    <h1>Product message and channel preview</h1>
    {/* One provider for the page; both sections reuse the same product decoder and renderers. */}
    <SendbirdProvider appId="" userId="self" breakpoint="600px" uikitOptions={{ groupChannel: { enableMarkAsUnread: markAsUnread, enableMention: mention } }}>
      <section aria-labelledby="message-bodies">
        <h2 id="message-bodies">1. Message bodies</h2>
        <div className="controls">
          <label><input type="checkbox" checked={useDefault} onChange={event => setUseDefault(event.target.checked)} /> Show default message bodies</label>
        </div>
        <div className="examples"><MessageExamples useDefault={useDefault} /></div>
      </section>
      <section aria-labelledby="channel-preview">
        <h2 id="channel-preview">2. Channel list preview</h2>
        <form className="controls" aria-label="App options">
          <label><input type="checkbox" name="mark-as-unread" defaultChecked={markAsUnread} /> enableMarkAsUnread</label>
          <label><input type="checkbox" name="mention" defaultChecked={mention} /> enableMention</label>
          <button type="submit">Reload with options</button>
        </form>
        <div className="controls" role="group" aria-label="Workshop channel">
          {workshopOptions.map(([key, label]) => <label key={key}><input type="checkbox" checked={workshop[key]}
            onChange={event => setWorkshop(current => ({ ...current, [key]: event.target.checked }))} /> {label}</label>)}
        </div>
        <div className="controls" role="group" aria-label="Last message in Workshop">
          {scenarios.map(({ kind: choice, label }) =>
            <button key={choice} type="button" aria-pressed={kind === choice} onClick={() => setKind(choice)}>{label}</button>)}
          <button type="button" aria-pressed={unread > 0} onClick={() => setUnread(count => count ? 0 : 1)}>Unread badge</button>
          <label><input type="checkbox" checked={bodyOnly} onChange={event => setBodyOnly(event.target.checked)} /> Customize the body only</label>
        </div>
        <ChannelPreviewExample kind={kind} unread={unread} selected={selected} selectChannel={selectChannel} bodyOnly={bodyOnly} workshop={workshop} />
      </section>
    </SendbirdProvider>
  </main>;
}

createRoot(document.getElementById('root')!).render(query.has('wrapper') ? <MountedRecipe /> : <App />);
