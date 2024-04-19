import { paramKeys } from './utils/paramsBuilder.ts';
import { useEffect } from 'react';

export function URLBuilder() {
  const appConfigs = ['app_id', 'user_id', 'nickname'];
  const uikitConfigs = [...paramKeys];

  useEffect(() => {
    uikitConfigs.forEach((label) => {
      const elem = document.getElementsByName(label)[0];
      if (elem && (elem instanceof HTMLInputElement || elem instanceof HTMLSelectElement)) elem.disabled = true;
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: 24 }}>
      <h1>{'URL Builder for Testing'}</h1>
      <form
        id={'builder'}
        style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%', paddingBottom: 60, overflow: 'scroll' }}
        onSubmit={(e) => {
          e.preventDefault();
          const values = [...appConfigs, ...uikitConfigs]
            .filter((label) => {
              if (appConfigs.includes(label)) return Boolean((e.target[label as never] as HTMLInputElement).value);
              const target = e.target[`${label}-enabled` as never] as HTMLInputElement;
              return target.checked;
            })
            .map((label) => {
              const target = e.target[label as never] as unknown;

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

          const strings = values.map(([key, value]) => `${key}=${value}`).join('&');
          navigator.clipboard.writeText(`?${strings}`);
        }}
      >
        {appConfigs.map((label) => (
          <label key={label} style={{ gap: 8, display: 'flex' }}>
            <b>{label}</b>
            <input type="text" name={label} />
          </label>
        ))}
        {uikitConfigs.map((label) => (
          <div key={`${label}-enabled`}>
            <label style={{ gap: 8, display: 'flex' }}>
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
            <label key={label} style={{ gap: 8, display: 'flex' }}>
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
      <button
        className={'sticky-bottom-button'}
        style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 60, fontSize: 24 }}
        form={'builder'}
      >
        {'Copy'}
      </button>
    </div>
  );
}
