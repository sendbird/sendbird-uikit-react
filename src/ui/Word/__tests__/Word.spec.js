import React from 'react';
import { render } from '@testing-library/react';

import Word from "../index";

describe('ui/Word', () => {
  it('should do a snapshot test of the Word DOM', function() {
    const text = "example-text";
    const { asFragment } = render(
      <Word
        word="hello@{hoon}"
        message={{
          mentionedUsers: [{ userId: 'hoon', nickname: 'Hoon Baek' }]
        }}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
