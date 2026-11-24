import { createRoot } from 'react-dom/client';
import '@sendbird/uikit-react/dist/index.css';
import { ThemeFixture } from './fixture';
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
    <ThemeFixture mode={mode} />
  </main>,
);
