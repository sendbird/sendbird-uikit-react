import React from 'react';

import getStringSet from '../rogu/ui/Label/stringSet';

//import getStringSetRogu from '../rogu/ui/Label/stringSet';

const LocalizationContext = React.createContext({
  stringSet: getStringSet('en'),
  //oguStringSet: getStringSetRogu('en'),
});

console.log(getStringSet('en'));

interface LocalizationProviderProps {
  stringSet: Record<string, string>;
  //roguStringSet: Record<string, string>;
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
