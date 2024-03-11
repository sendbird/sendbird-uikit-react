import React from 'react';
import Badge from '../ui/Badge';
import { LocalizationContext } from '../lib/LocalizationContext';
import type { StringSet } from '../ui/Label/stringSet';

const FakeLocalizationContext = ({ children }) => (
  <LocalizationContext.Provider value={{ stringSet: { BADGE__OVER: '+' } as StringSet, dateLocale: null as unknown as Locale }}>
    {children}
  </LocalizationContext.Provider>
);

export default {
  title: 'UI/Badge',
  component: Badge,
  decorators: [(Story) => <FakeLocalizationContext><Story/></FakeLocalizationContext>],
  argTypes: {
    count: {
      control: 'number',
    },
    maxLevel: {
      control: 'number',
    },
    className: {
      control: 'text',
    },
  },
};

const Template = (args) => <Badge {...args} />;

export const Default = Template.bind({});
Default.args = {
  count: 1,
};

export const StringCount = Template.bind({});
StringCount.args = {
  count: '99+',
};

export const MaxLevelThree = Template.bind({});
MaxLevelThree.args = {
  count: 1000,
  maxLevel: 3,
};
