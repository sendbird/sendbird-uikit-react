import React from 'react';
import Avatar from '../ui/Avatar';

const imageUrlOptions = {
  None: '',
  Image1: 'https://avatars1.githubusercontent.com/u/1384313?s=460&v=4',
  Image2: 'https://avatars2.githubusercontent.com/u/11382805?s=460&v=4',
  Image3: 'https://avatars3.githubusercontent.com/u/46333979?s=460&v=4',
};

export default {
  title: 'UI/Avatar',
  component: Avatar,
  argTypes: {
    height: { control: 'number' },
    width: { control: 'number' },
    src: { 
      control: { type: 'select' },
      options: Object.values(imageUrlOptions),
      mapping: imageUrlOptions,
    },
    alt: { control: 'text' },
    customDefaultComponent: { action: 'customDefaultComponent' },
  },
};

const Template = (args) => <Avatar {...args} />;

export const DefaultAvatar = Template.bind({});
DefaultAvatar.args = {
  alt: 'Default Avatar',
  width: 56,
  height: 56,
  src: imageUrlOptions.None,
};

export const WithImage = Template.bind({});
WithImage.args = {
  ...DefaultAvatar.args,
  src: imageUrlOptions.Image3,
};
