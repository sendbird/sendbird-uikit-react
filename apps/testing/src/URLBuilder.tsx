import { paramKeys } from './utils/paramsBuilder.ts';
import React, { useEffect } from 'react';

const appConfigs = ['appId', 'userId', 'nickname', 'enableProfileEdit', 'enableMultipleFilesMessage'];
const uikitConfigs = [...paramKeys];

export function URLBuilder() {
  useEffect(() => {
    uikitConfigs.forEach((label) => {
      const elem = document.getElementsByName(label)[0];
      if (elem && (elem instanceof HTMLInputElement || elem instanceof HTMLSelectElement)) elem.disabled = true;
    });
  }, []);

  const isOptionalConfig = (label: string) => ['appId', 'userId', 'nickname'].includes(label);

  return (
    <div style={styles.container}>
      <h1>{'Testing App URL Builder'}</h1>
      <form
        id={'builder'}
        style={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          const values = [...appConfigs, ...uikitConfigs]
            .filter((label) => {
              if (isOptionalConfig(label)) return Boolean(e.currentTarget[label].value);

              const target = e.currentTarget[`${label}-enabled`] as HTMLInputElement;
              return target.checked;
            })
            .map((label) => {
              const target = e.currentTarget[label] as unknown;

              if (target instanceof HTMLInputElement) {
                if (target.type === 'checkbox') {
                  return [label, target.checked];
                }
                if (target.type === 'text') {
                  return [label, target.value];
                }
              }

              if (target instanceof HTMLSelectElement) {
                return [label, [...target.selectedOptions].map((it) => it.value).join(',')];
              }

              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              return [label, target.value];
            });

          const route = e.currentTarget['channel_type'].value;
          const queryParams = values.map(([key, value]) => `${key}=${value}`).join('&');
          const url = `${window.origin}/${route}?${queryParams}`;
          navigator.clipboard.writeText(url);
        }}
      >
        <label style={styles.label}>
          <b>{'Channel type'}</b>
          <select defaultValue={'group_channel'} name={'channel_type'}>
            <option value="group_channel">{'Group Channel'}</option>
            <option value="open_channel">{'Open Channel'}</option>
          </select>
        </label>
        {appConfigs.map((label) => (
          <div key={`appConfigs-${label}`}>
            {!isOptionalConfig(label) && (
              <label style={styles.label}>
                <i>{'Enable'}</i>
                <input
                  type="checkbox"
                  name={`${label}-enabled`}
                  onChange={(e) => {
                    const elem = document.getElementsByName(label)[0];
                    if (elem && (elem instanceof HTMLInputElement || elem instanceof HTMLSelectElement)) elem.disabled = !e.target.checked;
                  }}
                />
              </label>
            )}
            <label key={label} style={styles.label}>
              <b>{label}</b>
              {(() => {
                if (label.startsWith('enable')) {
                  return <input type="checkbox" name={label} />;
                }
                return <input placeholder={'optional'} type="text" name={label} />;
              })()}
            </label>
          </div>
        ))}
        {uikitConfigs.map((label) => (
          <div key={`uikitConfigs-${label}`}>
            <label style={styles.label}>
              <i>{'Enable'}</i>
              <input
                type="checkbox"
                name={`${label}-enabled`}
                onChange={(e) => {
                  const elem = document.getElementsByName(label)[0];
                  if (elem && (elem instanceof HTMLInputElement || elem instanceof HTMLSelectElement)) elem.disabled = !e.target.checked;
                }}
              />
            </label>

            <label key={label} style={styles.label}>
              <b>{label}</b>
              {(() => {
                if (label.includes('_enable')) {
                  return <input type="checkbox" name={label} />;
                }

                if (label.includes('_replyType')) {
                  return (
                    <select name={label}>
                      {['none', 'quote_reply', 'thread'].map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  );
                }

                if (label.includes('_threadReplySelectType')) {
                  return (
                    <select name={label}>
                      {['thread', 'parent'].map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  );
                }

                if (label.includes('_typingIndicatorTypes')) {
                  return (
                    <select name={label} multiple>
                      {['text', 'bubble'].map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  );
                }

                if (label.includes('_showSuggestedRepliesFor')) {
                  return (
                    <select name={label}>
                      {['all_messages', 'last_message_only'].map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  );
                }

                return <input type="text" name={label} />;
              })()}
            </label>
          </div>
        ))}
      </form>
      <button className={'sticky-bottom-button'} style={styles.stickyBottomButton} form={'builder'}>
        {'Copy'}
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: 24,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    height: '100%',
    paddingBottom: 60,
    overflow: 'scroll',
  },
  label: {
    display: 'flex',
    gap: 8,
  },
  stickyBottomButton: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    fontSize: 24,
  },
};
