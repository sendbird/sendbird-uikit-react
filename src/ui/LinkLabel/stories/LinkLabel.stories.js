import React from 'react';
import LinkLabel, { LinkLabelTypography, LinkLabelColors } from '../index.jsx';

const description = `
  \`import LinkLabel from "@sendbird/uikit-react/ui/LinkLabel";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/LinkLabel',
  component: LinkLabel,
  subcomponents: { LinkLabelTypography, LinkLabelColors },
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

const rightLinks = [
  'https://sendbird.com',
  'http://sendbird.com',
  'www.sendbird.com',
  'sendbird.com',
];

const wrongLinks = [
  'https:www.sendbird.com',
  'w.sendbird.com',
  'htps://sendbird.com',
  'htp://sendbird.com',
  'https:/sendbird.com',
];

export const WithControl = (arg) => (
  <LinkLabel {...arg}>Sample Text</LinkLabel>
);

export const RightLinks = () => (
  rightLinks.map(link => (
    <LinkLabel
      src={link}
      type={LinkLabelTypography.BODY_1}
      color={LinkLabelColors.ONBACKGROUND_1}
    >
      {link}
    </LinkLabel>
  ))
);

export const WrongLinks = () => (
  wrongLinks.map(link => (
    <LinkLabel
      src={link}
      type={LinkLabelTypography.BODY_1}
      color={LinkLabelColors.ONBACKGROUND_1}
    >
      {link}
    </LinkLabel>
  ))
);
