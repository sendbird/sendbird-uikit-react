import React, { useEffect, useState } from 'react';
import ProgressBar from '../index';

const description = `
  \`import ProgressBar from "@sendbird/uikit-react/ui/ProgressBar";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/ProgressBar',
  component: ProgressBar,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

let interval = null;
export const Basic = () => {
  const maxSize = 3000;
  const frame = maxSize / 100;
  const [running, setRunning] = useState(false);
  const [currentSize, setCurrentSize] = useState(0);

  useEffect(() => {
    if (running) {
      interval = setInterval(() => {
        setCurrentSize((currentSize) => currentSize + frame);
      }, frame);
    } else {
      clearInterval(interval);
    }
  }, [running]);

  useEffect(() => {
    if (currentSize >= maxSize) {
      setRunning(false);
      clearInterval(interval);
    }
  }, [currentSize]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <button type="button" onClick={() => {
        setRunning(true);
        setCurrentSize(0);
      }}>
        Start
      </button>
      <ProgressBar
        maxSize={maxSize}
        currentSize={currentSize}
      />
    </div>
  )
};
