import React from 'react';
import { render, screen } from '@testing-library/react';
import en from 'date-fns/locale/en-US';

import { LocalizationProvider, useLocalization } from '../LocalizationContext';
import getStringSet from '../../ui/Label/stringSet';

const Consumer = () => {
  const { dateLocale, stringSet } = useLocalization();

  return (
    <>
      <div data-testid="locale-code">{dateLocale.code}</div>
      <div data-testid="no-name">{stringSet.NO_NAME}</div>
    </>
  );
};

describe('LocalizationProvider', () => {
  it('falls back to default localization when null values are provided', () => {
    render(
      <LocalizationProvider stringSet={null} dateLocale={null}>
        <Consumer />
      </LocalizationProvider>,
    );

    expect(screen.getByTestId('locale-code')).toHaveTextContent(en.code);
    expect(screen.getByTestId('no-name')).toHaveTextContent(getStringSet('en').NO_NAME);
  });
});
