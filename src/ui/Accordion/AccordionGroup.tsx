import React, { type ReactElement, createContext, useState, useContext } from 'react';
import { noop } from '../../utils/utils';

// # Context
export interface AccordionGroupContextType {
  openedListKeys: Array<string>;
  addOpenedListKey: (key: string) => void;
  removeOpenedListKey: (key: string) => void;
  clearOpenedListKeys: () => void;
  allowMultipleOpen: boolean;
}
type AGCType = AccordionGroupContextType;
export const AccordionGroupContext = createContext<AccordionGroupContextType>({
  openedListKeys: [],
  addOpenedListKey: noop,
  removeOpenedListKey: noop,
  clearOpenedListKeys: noop,
  allowMultipleOpen: false,
});

// # Provider Component
export interface AccordionGroupProps {
  className?: string;
  children: ReactElement | Array<ReactElement>;
  allowMultipleOpen?: boolean;
}
export const AccordionGroupProvider = ({
  className,
  children,
  allowMultipleOpen = false,
}: AccordionGroupProps) => {
  const [openedListKeys, setOpenedListKeys] = useState<string[]>([]);

  const addOpenedListKey: AGCType['addOpenedListKey'] = (key) => {
    setOpenedListKeys((prevList) => {
      if (!allowMultipleOpen) {
        return [key];
      }
      prevList.push(key);
      return prevList;
    });
  };
  const removeOpenedListKey: AGCType['removeOpenedListKey'] = (key) => {
    setOpenedListKeys((prevList) => prevList.filter((k) => k !== key));
  };
  const clearOpenedListKeys: AGCType['clearOpenedListKeys'] = () => {
    setOpenedListKeys([]);
  };

  return (
    <div className={`sendbird-accordion-group-provider ${className}`}>
      <AccordionGroupContext.Provider
        value={{
          openedListKeys,
          addOpenedListKey,
          removeOpenedListKey,
          clearOpenedListKeys,
          allowMultipleOpen,
        }}
      >
        {children}
      </AccordionGroupContext.Provider>
    </div>
  );
};
export const useAccordionGroupContext = () => {
  const context = useContext(AccordionGroupContext);
  if (!context) throw new Error('No accordion group context available. Make sure you are rending <AccordionGroupContext />.');
  return context;
};

export default AccordionGroupProvider;
