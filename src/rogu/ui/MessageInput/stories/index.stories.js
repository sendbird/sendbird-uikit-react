import React from 'react';

import MessageInput from '../index';

export default { title: 'ruangkelas/ UI Components/MessageInput' };

export const basicMessageInput = () => {
  const ref = React.useRef();
  return (
    <MessageInput name="example" ref={ref} />
  )
};

export const messageInputEdit = () => {
  const ref = React.useRef();
  return (
    <MessageInput isEdit name="example" ref={ref} />
  )
};

export const disabledMessageInput = () => {
  const ref = React.useRef();
  return (
    <MessageInput disabled name="example" ref={ref} />
  )
};
