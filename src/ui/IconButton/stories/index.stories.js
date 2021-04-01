import React from 'react';
import IconButton from '../index.jsx';

import DefaultIcon from '../../../svgs/icon-create.svg';

export default { title: 'UI Components/IconButton' };

export const simpleIconButton = () => (
  <IconButton onClick={() => alert("clicked the button")}>
    <DefaultIcon />
  </IconButton>
);
