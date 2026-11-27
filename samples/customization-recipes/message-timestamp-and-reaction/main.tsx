import { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@sendbird/uikit-react/dist/index.css';
import { MessageFixture, type Operation } from './fixture';
import { ChannelWithMessageDetails } from './integration';
import { secondsFormat } from './timestamp-format';
import { GroupChannelFixture } from '../shared/group-channel-fixture';
import '../shared/page.css';
import './style.css';

const query = new URLSearchParams(location.search);
const theme = query.get('theme') === 'dark' ? 'dark' : 'light';

function MountedRecipe() {
  const [operations, setOperations] = useState<string[]>([]);
  const like = query.has('sampled') ? { count: 20, hasCurrentUserReacted: true } : true;
  return <main aria-label="Mounted timestamp recipe" style={{ height: 580 }}>
    <GroupChannelFixture record={event => setOperations(items => [...items, event.operation])} theme={theme}
      seed={{ like }} stringSet={query.has('localized')
      ? { ...secondsFormat, FEEDBACK_LIKE: 'J’aime' } : secondsFormat}
      uikitOptions={{ groupChannel: { enableReactions: true } }}>
      <ChannelWithMessageDetails channelUrl="fixture-A" />
    </GroupChannelFixture>
    <output data-testid="mounted-reactions">{operations.join(', ')}</output>
  </main>;
}

function App() {
  const [custom, setCustom] = useState(false);
  const [long, setLong] = useState(false);
  const [mixed, setMixed] = useState(false);
  const [operations, setOperations] = useState<Operation[]>([]);
  const record = useCallback((operation: Operation) => {
    setOperations(previous => [...previous, operation]);
  }, []);

  return <main>
    <a className="recipe-back" href="../">All recipes</a>
    <h1>Message timestamp and reaction</h1>
    <div className="controls">
      <label><input type="checkbox" checked={custom} onChange={event => setCustom(event.target.checked)} /> Custom message details</label>
      <label><input type="checkbox" checked={long} onChange={event => setLong(event.target.checked)} /> Long message</label>
      <label><input type="checkbox" checked={mixed} onChange={event => setMixed(event.target.checked)} /> Mixed reactions</label>
    </div>
    <section className="message-frame" aria-label="Message preview">
      <MessageFixture custom={custom} long={long} mixed={mixed} onOperation={record} />
    </section>
    <h2>Local SDK calls</h2>
    <ol className="log" data-testid="operations" aria-live="polite">
      {operations.map(({ action, messageId, key }, index) => <li key={index}>{action}({messageId}, {key})</li>)}
    </ol>
  </main>;
}

createRoot(document.getElementById('root')!).render(query.has('wrapper') ? <MountedRecipe /> : <App />);
