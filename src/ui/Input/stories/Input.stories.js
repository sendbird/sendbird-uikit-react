import React, { useRef, useState } from 'react';
import Input, { InputLabel } from '../index.jsx';

export default { title: 'UI Components/Input' };

export const simpleInput = () => (
  <Input
    value=""
    placeHolder="placeholder"
    name="input"
  />
);

export const simpleInputWithText = () => (
  <Input
    value="alo"
    placeHolder="placeholder"
    name="input"
  />
);

const longText = "aloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloaloalo";

export const longInputWithText = () => (
  <Input
    value={longText}
    placeHolder="placeholder"
    name="input"
  />
);

export const disabled = () => (
  <Input
    disabled
    value={longText}
    placeHolder="placeholder"
    name="input"
  />
);

const text = "example";
export const inputWithLabel = () => (
  <div>
    <InputLabel>MyLabel</InputLabel>
    <Input
      value={text}
      placeHolder="placeholder"
      name="input"
    />
  </div>
);

export const refExample = () => {
  const inputEl = useRef(null);
  const [value, setvalue] = useState("initialState");
  const onButtonClick = () => {
    // `current` points to the mounted text input element
    setvalue(inputEl.current.value)
  };
  return (
    <>
      <InputLabel>An exmple to get value from input using ref:</InputLabel>
      <Input ref={inputEl} name="input" />
      <button onClick={onButtonClick}>click to set value</button>
      {value}
    </>
  );
};
