import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@sendbird/uikit-react/dist/index.css';
import { FixtureProvider, type SendRecord } from './fixture';
import { StockConversation } from './integration';
import '../shared/page.css';
import './style.css';

function App() {
  const [sent, setSent] = useState<SendRecord | null>(null);
  return <main>
    <a className="recipe-back" href="../">All recipes</a>
    <h1>Jump to latest and Send icon</h1>
    <FixtureProvider onSend={setSent}>
      <StockConversation channelUrl="fixture-channel" />
    </FixtureProvider>
    <h2>Last local send call</h2>
    <output className="log" data-testid="sent-record" aria-live="polite">
      {sent ? JSON.stringify(sent) : ''}
    </output>
  </main>;
}

createRoot(document.getElementById('root')!).render(<App />);
