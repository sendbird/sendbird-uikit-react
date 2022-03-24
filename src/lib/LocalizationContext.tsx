import React from 'react';

import getStringSet from '../ui/Label/stringSet';
import type { Locale } from 'date-fns';
import en from 'date-fns/locale/en-US';

const LocalizationContext = React.createContext({
  stringSet: getStringSet('en'),
  dateLocale: en,
});

interface LocalizationProviderProps {
  stringSet: Record<string, string>;
  dateLocale: Locale;
  children: React.Component;
}

const LocalizationProvider = (props: LocalizationProviderProps): React.ReactNode => {
  const { children } = props;
  return (
    <LocalizationContext.Provider value={props}>
      {children}
    </LocalizationContext.Provider>
  );
};

const useLocalization = () => React.useContext(LocalizationContext);

export { LocalizationContext, LocalizationProvider, useLocalization };
