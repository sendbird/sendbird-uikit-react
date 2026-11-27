import { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@sendbird/uikit-react/dist/index.css';
import { SendbirdFixture } from './fixture';
import { scenarios, type Operation, type Scenario } from './scenarios';
import '../shared/page.css';
import './style.css';

const query = new URLSearchParams(location.search);
const rendererMode = query.has('hide-renderers') ? 'hidden' : query.has('custom-renderers') ? 'custom' : 'default';

function App() {
  const [scenario, setScenario] = useState<Scenario>('ready');
  const [reordered, setReordered] = useState(rendererMode !== 'default');
  const [operations, setOperations] = useState<Operation[]>([]);
  const record = useCallback((operation: Operation) => {
    setOperations(previous => [...previous, operation]);
  }, []);

  return <main>
    <a className="recipe-back" href="../">All recipes</a>
    <h1>Composer above the message list</h1>
    <div className="controls">
      <label><input type="checkbox" checked={reordered} onChange={event => setReordered(event.target.checked)} /> Composer on top</label>
      <label>Channel state <select value={scenario} onChange={event => setScenario(event.target.value as Scenario)}>
        {scenarios.map(value => <option key={value} value={value}>{value}</option>)}
      </select></label>
    </div>
    <section className="recipe-channel-frame" aria-label="Channel preview">
      <SendbirdFixture record={record} scenario={scenario} reordered={reordered} rendererMode={rendererMode} />
    </section>
    <h2>Local SDK calls</h2>
    <ol className="log" data-testid="operations" aria-live="polite">
      {operations.map(({ text, boundary }, index) => <li key={index}>{boundary}: {text}</li>)}
    </ol>
  </main>;
}

createRoot(document.getElementById('root')!).render(<App />);
