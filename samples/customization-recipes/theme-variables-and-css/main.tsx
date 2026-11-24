import { createRoot } from 'react-dom/client';
import '@sendbird/uikit-react/dist/index.css';
import { ThemeFixture } from './fixture';
import { BrandedConversation } from './integration';
import { GroupChannelFixture } from '../shared/group-channel-fixture';
import '../shared/page.css';
import './style.css';

const modes = [
  ['default', 'UIKit default'],
  ['tokens', 'Theme variables'],
  ['target', 'Variables and CSS'],
] as const;
const query = new URLSearchParams(location.search);
const mode = modes.find(([value]) => value === query.get('mode'))?.[0] ?? 'target';

createRoot(document.getElementById('root')!).render(
  <main>
    <a className="recipe-back" href="../">All recipes</a>
    <h1>Theme variables and CSS</h1>
    <nav className="controls" aria-label="Theme step">
      {modes.map(([value, label]) => <a key={value} href={`?mode=${value}`}
        aria-current={value === mode ? 'page' : undefined}>{label}</a>)}
    </nav>
    {query.has('wrapper')
      ? <GroupChannelFixture record={() => {}} historySize={25}>
          <BrandedConversation channelUrl="fixture-A" aria-label="Branded chat" />
        </GroupChannelFixture>
      : <ThemeFixture mode={mode} />}
  </main>,
);
