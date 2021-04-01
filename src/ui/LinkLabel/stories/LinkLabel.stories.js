import React from 'react';
import LinkLabel from '../index.jsx';

export default { title: 'UI Components/LinkLabel' };

import { LinkLabelTypography, LinkLabelColors } from '../index';

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
