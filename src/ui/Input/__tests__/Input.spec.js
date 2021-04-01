import React, { useState, useRef } from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import Input from "../index";

describe('Input', () => {
  it('should do a snapshot test of the Input DOM', function() {
    const text = "example-text";
    const component = renderer.create(
      <Input
        value="value"
        placeHolder="placeholder"
        name="name"
        disabled={false}
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should be able to access value using ref', function() {
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
          <button onClick={onButtonClick}>click to set value</button>
          <span id="result">{value}</span>
        </>
      );
    }
    const component = mount(<App />);

    component.find('input').simulate('change', { target: { value: finalValue } });
    component.find('button').simulate('click');
    component.update();
    expect(
      component.find('#result').text()
  ).toEqual(finalValue);
  });
});
