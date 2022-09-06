import React from 'react';
import { render, screen } from '@testing-library/react';

import AdminMessage from "../index";
import dummyAdminMessage from '../adminMessageDummyData.mock';

describe('ui/AdminMessage', () => {
  it('should contain className', function () {
    const text = "example-classname";
    render(<AdminMessage className={text} message={dummyAdminMessage} />);
    expect(screen.getByTestId('sendbird-admin-message').className).toContain(text);
  });

  it('should do a snapshot test of the AdminMessage DOM', function () {
    const text = "example-classname";
    const { asFragment } = render(<AdminMessage className={text} message={dummyAdminMessage} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
