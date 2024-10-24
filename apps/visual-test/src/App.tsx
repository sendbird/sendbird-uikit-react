import { ChangeEvent, useState } from 'react';
import FormMessageItemBody from '../../../src/ui/FormMessageItemBody';
import { UserMessage } from '@sendbird/chat/message';
import SendbirdChat from '@sendbird/chat';
import { mockUserMessage } from '../mock-data/form.ts';
import { getMockMessageForm } from './utils.ts';
// TODO: Need to change below imports into a single import later.
import '../../../src/ui/TextMessageItemBody/index.scss';
import '../../../src/ui/Input/index.scss';
import '../../../src/ui/FormMessageItemBody/index.scss';

const chat = SendbirdChat.init({
  appId: '',
  modules: [],
});

const App = () => {
  const [theme, setTheme] = useState('light');
  const [jsonText, setJsonText] = useState('');
  const [message, setMessage] = useState<UserMessage>();

  const onChangeText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setJsonText(text);
    
    try {
      const parsedJson = JSON.parse(text);
      const mockedMessage = {
        ...mockUserMessage,
        'extendedMessagePayload': {
          'message_form': getMockMessageForm(parsedJson),
        },
      };
      const built: UserMessage = chat.message.buildMessageFromSerializedData(mockedMessage) as UserMessage;
      built.submitMessageForm = async () => {};
      setMessage(built);
    } catch (e) {
      console.warn('## error: ', e);
      setMessage(undefined);
    }
  };

  return (
    <div dir={'ltr'} style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 24 }}>
        <textarea
          id="json"
          data-testid={'form-input'}
          className="editor"
          value={jsonText}
          onChange={onChangeText}
        />
      {
        message?.messageForm && <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            width: 400
          }}
          className={`${theme === 'dark' ? 'sendbird-theme--dark' : 'sendbird-theme--light'}`}
        >
          <div data-testid={'form-rendered'}>
            <FormMessageItemBody
              isByMe={false}
              message={message}
              form={message.messageForm}
            />
          </div>
          <button
            style={{ marginBottom: 20 }}
            onClick={() => (theme === 'dark' ? setTheme('light') : setTheme('dark'))}
          >
            switch theme
          </button>
        </div>
      }
    </div>
  );
};

export default App;
