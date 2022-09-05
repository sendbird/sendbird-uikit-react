import React from 'react';
import { render, screen } from '@testing-library/react';

import ModalRoot from '../index';

describe('ModalRoot', () => {
  it('should have expected id', function () {
    render(<ModalRoot />);
    expect(screen.getByRole('root').id).toBe('sendbird-modal-root');
  });
});
