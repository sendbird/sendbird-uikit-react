import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@sendbird/uikit-react/dist/index.css';
import { ComposerRecipeChannel, ComposerWithWritingTip } from './integration';
import { GroupChannelFixture } from '../shared/group-channel-fixture';
import { ComposerFixture, type ComposerEvent } from './fixture';
import '../shared/page.css';
import './style.css';

const params = new URLSearchParams(location.search);
const broadcastRole = params.has('broadcast-operator') ? 'operator' : params.has('broadcast-member') ? 'member' : undefined;
const theme = params.get('theme') === 'dark' ? 'dark' : 'light';

function MountedRecipe() {
  const [channelUrl, setChannelUrl] = useState('fixture-A');
  return <main aria-label="Mounted composer recipe">
    <button type="button" onClick={() => setChannelUrl(channelUrl === 'fixture-A' ? 'fixture-B' : 'fixture-A')}>Switch fixture channel</button>
    <GroupChannelFixture record={() => {}} theme={theme}>
      <div style={{ height: 580 }}>
        <ComposerRecipeChannel channelUrl={channelUrl} renderSendMessageIcon={() => <span>App send</span>} />
      </div>
    </GroupChannelFixture>
  </main>;
}

function App() {
  const [events, setEvents] = useState<ComposerEvent[]>([]);
  return (
    <main className="composer-action-demo">
      <a className="recipe-back" href="../">All recipes</a>
      <h1>Composer action button</h1>
      <p>The stock Sendbird composer runs against a local fixture. The tip button sits next to it.</p>
      <div className="composer-frame">
        <ComposerFixture broadcastRole={broadcastRole} record={(event) => setEvents((current) => [...current, event])}>
          <ComposerWithWritingTip />
        </ComposerFixture>
      </div>
      <section aria-label="Local send log">
        <h2>Local send log</h2>
        {events.length ? <ol className="log">{events.map((event, index) => <li key={index}>
          {event.kind === 'text' ? event.text : event.filename}
        </li>)}</ol> : <p>No messages sent yet.</p>}
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(params.has('wrapper') ? <MountedRecipe /> : <App />);
