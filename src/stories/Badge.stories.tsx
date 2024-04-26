import React from 'react';
import Badge from '../ui/Badge';
import { LocalizationContext } from '../lib/LocalizationContext';
import type { StringSet } from '../ui/Label/stringSet';
import type { Meta, StoryObj } from '@storybook/react';

const FakeLocalizationContext = ({ children }) => (
  <LocalizationContext.Provider value={{ stringSet: { BADGE__OVER: '+' } as StringSet, dateLocale: null as unknown as Locale }}>
    {children}
  </LocalizationContext.Provider>
);

const meta: Meta<typeof Badge> = {
  title: '2.UI/Badge',
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
export default meta;

type StoryOfBadge = StoryObj<typeof Badge>;
const Template = (args) => <Badge {...args} />;
export const Default: StoryOfBadge = Template.bind({});
Default.args = {
  count: 1,
};
export const StringCount: StoryOfBadge = Template.bind({});
StringCount.args = {
  count: '99+',
};
export const MaxLevelThree: StoryOfBadge = Template.bind({});
MaxLevelThree.args = {
  count: 1000,
  maxLevel: 3,
};
