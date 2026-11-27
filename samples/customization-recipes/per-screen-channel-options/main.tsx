import { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@sendbird/uikit-react/dist/index.css';
import { ResolvedOptions } from './fixture';
import { GroupChannelFixture, type Operation } from '../shared/group-channel-fixture';
import { ChannelScreen } from './integration';
import { celebrate, gesture, screenPolicy } from './policy';
import '../shared/page.css';
import './style.css';

const providerEnabled = new URLSearchParams(location.search).has('provider-enabled');

function App() {
  const [aCategory, setACategory] = useState<number>(screenPolicy.A.categoryId);
  const [events, setEvents] = useState<Operation[]>([]);
  const record = useCallback((event: Operation) => setEvents(previous => [...previous, event]), []);
  return <main>
    <a className="recipe-back" href="../">All recipes</a>
    <h1>Per-screen channel options</h1>
    <div className="controls">
      <button type="button" onClick={() => setACategory(id => id === gesture.id ? celebrate.id : gesture.id)}>
        Remount A with {aCategory === gesture.id ? celebrate.name : gesture.name}
      </button>
    </div>
    <GroupChannelFixture record={record} uikitOptions={{ groupChannel: {
      enableMention: true, enableReactions: providerEnabled, replyType: providerEnabled ? 'quote_reply' : 'none',
    } }}>
      <div className="panels">
        <section className="panel" aria-label="Screen A">
          <h2>Screen A</h2>
          <p>Reactions and quote replies on · {aCategory === gesture.id ? gesture.name : celebrate.name}</p>
          <div className="conversation">
            <ChannelScreen channelUrl="fixture-A" {...screenPolicy.A} categoryId={aCategory}>
              <ResolvedOptions />
            </ChannelScreen>
          </div>
        </section>
        <section className="panel" aria-label="Screen B">
          <h2>Screen B</h2>
          <p>Reactions and quote replies off</p>
          <div className="conversation">
            <ChannelScreen channelUrl="fixture-B" {...screenPolicy.B}><ResolvedOptions /></ChannelScreen>
          </div>
        </section>
      </div>
    </GroupChannelFixture>
    <output hidden data-testid="operations">{JSON.stringify(events)}</output>
  </main>;
}

createRoot(document.getElementById('root')!).render(<App />);
