## Usage

```tsx
import React, { useCallback } from 'react';
import { GlobalModalProvider, useGlobalModalContext } from 'src/hooks/useModal';

export const CustomComponent = () => {
  const { openModal } = useGlobalModalContext();

  const showUpAlert = useCallback(() => {
    openModal({
      modalProps: {},
      childElement: (
        <div className="custom-alert">
          "Button has been clicked!"
        </div>
      ),
    });
  }, []);

  return (
    <div className="custom-button">
      <button onClick={open}>OPEN</button>
    </div>
  );
};
```
