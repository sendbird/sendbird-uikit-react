import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@sendbird/uikit-react/dist/index.css';
import { FixtureProvider, olderStartingPoint, type SendRecord } from './fixture';
import { StockConversation } from './integration';
import '../shared/page.css';
import './style.css';

const query = new URLSearchParams(location.search);
const atOlder = query.has('older');
const theme = query.get('theme') === 'dark' ? 'dark' : 'light';
const renderAppHeader = query.has('app-header') ? () => <h2>App channel header</h2> : undefined;

function historyHref(older: boolean) {
  const params = new URLSearchParams(query);
  if (older) params.set('older', '');
  else params.delete('older');
  const search = params.toString();
  return search ? `?${search}` : './';
}

function App() {
  const [sent, setSent] = useState<SendRecord | null>(null);
  return <main>
    <a className="recipe-back" href="../">All recipes</a>
    <h1>Jump to latest and Send icon</h1>
    <nav className="controls" aria-label="Open the channel">
      <a href={historyHref(false)} aria-current={atOlder ? undefined : 'page'}>At the latest message</a>
      <a href={historyHref(true)} aria-current={atOlder ? 'page' : undefined}>At History 12</a>
    </nav>
    <FixtureProvider onSend={setSent} theme={theme} allowReplies={!query.has('no-replies')} mobile={query.has('mobile')}>
      <StockConversation channelUrl="fixture-channel" startingPoint={atOlder ? olderStartingPoint : undefined}
        renderChannelHeader={renderAppHeader} />
    </FixtureProvider>
    <h2>Last local send call</h2>
    <output className="log" data-testid="sent-record" aria-live="polite">
      {sent ? JSON.stringify(sent) : ''}
    </output>
  </main>;
}

createRoot(document.getElementById('root')!).render(<App />);
