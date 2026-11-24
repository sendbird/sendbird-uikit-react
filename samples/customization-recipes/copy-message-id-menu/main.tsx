import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';
import { MessageMenu, type MessageMenuProps } from '@sendbird/uikit-react/ui/MessageMenu';
import '@sendbird/uikit-react/dist/index.css';
import { CopyMessageIdMenu } from './integration';
import { menuFixture, type Scenario } from './fixture';
import '../shared/page.css';
import './style.css';

const scenarios: { value: Scenario; label: string }[] = [
  { value: 'own', label: 'My delivered message' },
  { value: 'other', label: 'Someone else’s delivered message' },
  { value: 'other-reply', label: 'Someone else’s reply' },
  { value: 'pending', label: 'My pending message' },
  { value: 'failed', label: 'My failed message' },
];

function App() {
  const [scenario, setScenario] = useState<Scenario>('other');
  const [extended, setExtended] = useState(true);
  const [result, setResult] = useState('');
  const props = menuFixture(scenario);

  return (
    <main>
      <a className="recipe-back" href="../">All recipes</a>
      <h1>Copy message ID menu</h1>
      <section aria-label="Message action demo">
        <div className="controls">
          <div className="scenario">
            <label htmlFor="message-scenario">Message</label>
            <select id="message-scenario" value={scenario} onChange={event => { setScenario(event.target.value as Scenario); setResult(''); }}>
              {scenarios.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>
          <label><input type="checkbox" checked={extended} onChange={event => { setExtended(event.target.checked); setResult(''); }} /> Add ID action</label>
        </div>
        <SendbirdProvider appId="" userId="self">
          <div className="message">
            <p>A sample message</p>
            <Menu key={`${scenario}-${extended}`} extended={extended} props={props} report={setResult} />
          </div>
        </SendbirdProvider>
        {result && <output role="status">{result}</output>}
      </section>
    </main>
  );
}

type DemoMenuProps = {
  extended: boolean;
  props: ReturnType<typeof menuFixture>;
  report: (event: string) => void;
};

function Menu({ extended, props, report }: DemoMenuProps) {
  const menuProps: MessageMenuProps = {
    ...props,
    renderTrigger: ({ ref, onClick }) => (
      <button type="button" ref={ref} onClick={onClick} aria-haspopup="menu">Open menu</button>
    ),
    showEdit: (open: boolean) => { if (open) report('UIKit opened edit'); },
    showRemove: (open: boolean) => { if (open) report('UIKit opened delete confirmation'); },
    deleteMessage: () => report('UIKit requested local deletion'),
    resendMessage: () => report('UIKit requested retry'),
    setQuoteMessage: () => report('UIKit requested quote reply'),
  };
  return extended
    ? <CopyMessageIdMenu {...menuProps} onCopyResult={({ messageId, copied }) => report(copied ? `Copied ID ${messageId}` : 'Clipboard is unavailable')} />
    : <MessageMenu {...menuProps} />;
}

createRoot(document.getElementById('root')!).render(<App />);
