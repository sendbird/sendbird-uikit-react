## Usage

```
import React, { useState, useCallback } from 'react';
import { render } from 'react-dom';
import useModal, { ModalRoot } from 'src/hooks/useModal';
const App = () => {
  const [Modal, open, close] = useModal('className');
  return (
    <div>
      <button onClick={open}>OPEN</button>
      <Modal>
        <div>
          <h1>Title</h1>
          <p>This is a customizable modal.</p>
          <button onClick={close}>CLOSE</button>
        </div>
      </Modal>
      <ModalRoot />
    </div>
  );
};
render(<App />, document.getElementById('root'));
```
