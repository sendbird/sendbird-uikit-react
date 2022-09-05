import React, { useState, useRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import Input from "../index";

describe('ui/Input', () => {
  it('should do a snapshot test of the Input DOM', function () {
    const { asFragment } = render(
      <Input
        value="value"
        placeHolder="placeholder"
        name="name"
        disabled={false}
        required={false}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should be able to access value using ref', function () {
    const initialValue = 'initialValue';
    const finalValue = 'finalValue';

    const App = () => {
      const inputEl = useRef(null);
      const [value, setvalue] = useState("initialState");
      const onButtonClick = () => {
        // `current` points to the mounted text input element
        setvalue(inputEl.current.value)
      };
      return (
        <>
          <Input ref={inputEl} name="input" value={initialValue} />
          <button role="button" onClick={onButtonClick}>click to set value</button>
          <span id="result">{value}</span>
        </>
      );
    }
    render(<App />);
    expect(
      screen.getByText("initialState").id
    ).toBe('result');

    fireEvent.change(screen.getByTestId('sendbird-input__input'), { target: { value: finalValue } });
    fireEvent.click(screen.getByRole('button'));
    expect(
      screen.getByText(finalValue).id
    ).toBe('result');
  });
});
