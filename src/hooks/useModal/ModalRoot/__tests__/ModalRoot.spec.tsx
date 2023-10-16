import React from 'react';
import { render } from '@testing-library/react';

import ModalRoot from '../index';

describe('ModalRoot', () => {
  it('should have expected id', () => {
    const { container } = render(<ModalRoot />);
    expect(container.getElementsByClassName('sendbird-modal-root')[0].id).toBe(
      'sendbird-modal-root',
    );
    expect(
      container.getElementsByClassName('sendbird-modal-root')[0].className,
    ).toBe('sendbird-modal-root');
  });
});
