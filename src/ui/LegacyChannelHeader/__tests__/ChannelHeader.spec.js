import React from 'react';
import { render } from '@testing-library/react';

import ChannelHeader from '../index.jsx';

const noop = () => { };

describe('ui/LegacyChannelHeader', () => {
  it('should create a snapshot of a default ChannelHeader component', function () {
    const { asFragment } = render(
      <ChannelHeader onEdit={noop} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
