import React from 'react';

import getStringSet, { StringSet } from '../ui/Label/stringSet';
import type { Locale } from 'date-fns';
import es from 'date-fns/locale/es';

const LocalizationContext = React.createContext({
  stringSet: getStringSet('es'),
  dateLocale: es,
});

interface LocalizationProviderProps {
  stringSet: StringSet;
  dateLocale: Locale;
  children: React.ReactElement;
}

const LocalizationProvider = (props: LocalizationProviderProps): React.ReactElement => {
  const { children } = props;
  return <LocalizationContext.Provider value={props}>{children}</LocalizationContext.Provider>;
};

export type UseLocalizationType = () => {
  stringSet: StringSet;
  dateLocale: Locale;
};

const useLocalization: UseLocalizationType = () => React.useContext(LocalizationContext);

export { LocalizationContext, LocalizationProvider, useLocalization };
