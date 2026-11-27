import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';
import MessageContent from '@sendbird/uikit-react/ui/MessageContent';
import { useLocalization } from '@sendbird/uikit-react/hooks/useLocalization';
import '@sendbird/uikit-react/dist/index.css';
import { channel, counts, replyFixture } from './fixture';
import { AppReplyLabel, stringSets, type Language } from './integration';
import '../shared/page.css';
import './style.css';

const languageOptions: { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'ko', name: 'Korean' },
  { code: 'ru', name: 'Russian' },
];

// Reads the merged dictionary so the page shows an override and an English fallback.
function LocalizedStrings() {
  const { stringSet } = useLocalization();
  return (
    <dl>
      <div><dt>Input placeholder</dt><dd data-testid="input-placeholder">{stringSet.MESSAGE_INPUT__PLACE_HOLDER}</dd></div>
      <div><dt>Unspecified string</dt><dd data-testid="fallback-string">{stringSet.MESSAGE_MENU__COPY}</dd></div>
    </dl>
  );
}

const messages = counts.map(count => ({ count, message: replyFixture(count) }));

function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [lastClick, setLastClick] = useState('');
  return (
    <main>
      <a className="recipe-back" href="../">All recipes</a>
      <h1>Localized reply count</h1>
      <label className="language">Language
        <select value={language} onChange={event => setLanguage(event.target.value as Language)}>
          {languageOptions.map(({ code, name }) => <option key={code} value={code}>{name}</option>)}
        </select>
      </label>
      <SendbirdProvider appId="" userId="self" breakpoint="600px" stringSet={stringSets[language]}>
        <LocalizedStrings />
        <table>
          <thead><tr><th scope="col">Replies</th><th scope="col">Default UIKit</th><th scope="col">App label</th></tr></thead>
          <tbody>
            {messages.map(({ count, message }) => (
              <tr key={count} data-count={count}>
                <th scope="row">{count}</th>
                <td className="native-reply">
                  <MessageContent channel={channel} message={message} userId="self" replyType="THREAD"
                    onReplyInThread={({ message }) => setLastClick(`UIKit reply clicked for message ${message.messageId}`)} />
                </td>
                <td>
                  <AppReplyLabel language={language} count={count}
                    onClick={() => setLastClick(`App reply clicked for message ${message.messageId}`)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SendbirdProvider>
      {lastClick && <output role="status">{lastClick}</output>}
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
