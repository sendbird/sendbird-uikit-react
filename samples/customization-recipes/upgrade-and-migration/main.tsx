import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@sendbird/uikit-react/dist/index.css';
import { UpgradeFixture } from './fixture';
import type { Observation } from './scenario';
import '../shared/page.css';
import './style.css';

const requestedMode = new URLSearchParams(location.search).get('reactions');
const mode = requestedMode === 'mixed' || requestedMode === 'heart' ? requestedMode : 'like';

function App() {
  const [latestAction, record] = useState<Observation | null>(null);

  return <main>
    <a className="recipe-back" href="../">All recipes</a>
    <h1>Upgrade and migration</h1>
    <p>The stock channel preview, message body and composer with one customized reaction button.</p>
    <UpgradeFixture record={record} mode={mode} />
    <h2>Latest local action</h2>
    <output className="log" aria-label="Latest local action" data-testid="observations">{JSON.stringify(latestAction)}</output>
  </main>;
}

createRoot(document.getElementById('root')!).render(<App />);
