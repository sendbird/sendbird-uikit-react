import React from 'react';

import getStringSet, { StringSet } from '../ui/Label/stringSet';
import type { Locale } from 'date-fns';
import en from 'date-fns/locale/en-US';

const LocalizationContextDefault = {
  stringSet: getStringSet('en'),
  dateLocale: en,
};
const LocalizationContext = React.createContext(LocalizationContextDefault);

interface LocalizationProviderProps {
  stringSet: StringSet;
  dateLocale?: Locale;
  children: React.ReactElement;
}

const LocalizationProvider = (props: LocalizationProviderProps): React.ReactElement => {
  const { children } = props;
  return <LocalizationContext.Provider value={{ ...LocalizationContextDefault, ...props }}>{children}</LocalizationContext.Provider>;
};

const useLocalization = () => React.useContext(LocalizationContext);
export { LocalizationContext, LocalizationProvider, useLocalization };
