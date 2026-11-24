import { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@sendbird/uikit-react/dist/index.css';
import { MessageFixture, type Operation } from './fixture';
import '../shared/page.css';
import './style.css';

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

createRoot(document.getElementById('root')!).render(<App />);
