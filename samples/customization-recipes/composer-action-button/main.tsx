import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@sendbird/uikit-react/dist/index.css';
import { ComposerRecipeChannel, ComposerWithWritingTip } from './integration';
import { GroupChannelFixture } from '../shared/group-channel-fixture';
import { ComposerFixture, type ComposerEvent } from './fixture';
import '../shared/page.css';
import './style.css';

const params = new URLSearchParams(location.search);
const broadcastMember = params.has('broadcast-member');

function MountedRecipe() {
  return <main aria-label="Mounted composer recipe" style={{ height: 580 }}>
    <GroupChannelFixture record={() => {}}>
      <ComposerRecipeChannel channelUrl="fixture-A" />
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
        <ComposerFixture broadcastMember={broadcastMember} record={(event) => setEvents((current) => [...current, event])}>
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
