export type Language = 'en' | 'ko' | 'ru';

// Pass stringSets[language] to the stringSet prop of your root SendbirdProvider.
// Keys you leave out keep UIKit's English defaults.
export const stringSets = {
  en: {},
  ko: {
    MESSAGE_INPUT__PLACE_HOLDER: '메시지 보내기',
    CHANNEL__THREAD_REPLY: '개의 답글',
    CHANNEL__THREAD_REPLIES: '개의 답글',
  },
  ru: {
    MESSAGE_INPUT__PLACE_HOLDER: 'Отправить сообщение',
    CHANNEL__THREAD_REPLY: 'ответ',
    CHANNEL__THREAD_REPLIES: 'ответов',
  },
};

type Nouns = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };
const nouns: Record<Language, Nouns> = {
  en: { one: 'reply', other: 'replies' },
  ko: { other: '개의 답글' },
  ru: { one: 'ответ', few: 'ответа', many: 'ответов', other: 'ответа' },
};
const pluralRules: Record<Language, Intl.PluralRules> = {
  en: new Intl.PluralRules('en'),
  ko: new Intl.PluralRules('ko'),
  ru: new Intl.PluralRules('ru'),
};

export function AppReplyLabel({ language, count, onClick }: { language: Language; count: number; onClick: () => void }) {
  if (count <= 0) return null;
  const category = pluralRules[language].select(count);
  const noun = nouns[language][category] ?? nouns[language].other;
  return <button type="button" onClick={onClick}>{count} {noun}</button>;
}
