import React from 'react';

import getStringSet from '../ui/Label/stringSet';

const LocalizationContext = React.createContext({
  stringSet: getStringSet('en'),
});

interface LocalizationProviderProps {
  stringSet: Record<string, string>;
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

export { LocalizationContext, LocalizationProvider };
