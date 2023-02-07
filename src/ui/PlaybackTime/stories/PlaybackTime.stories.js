import React, { useState, useEffect } from 'react';
import PlaybackTime from '../index';

const description = `
  \`import PlaybackTime from "@sendbird/uikit-react/ui/PlaybackTime";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/PlaybackTime',
  component: PlaybackTime,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

let counter = null;
export const Basic = () => {
  const PERIOD = 10;
  const INIT_VALUE = 60000;// start from 1 min

  // PlaybackTime
  const [isCounting, setIsCounting] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(INIT_VALUE);
  useEffect(() => {
    if (isCounting) {
      counter = setInterval(() => {
        setPlaybackTime((prev) => prev + 1000);// count up 1 sec
      }, PERIOD);
    } else {
      clearInterval(counter);
    }
  }, [isCounting]);

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        width: '100%',
        height: '300px',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <input
        type="button"
        value={isCounting ? "Stop" : "Start"}
        onClick={() => {
          setIsCounting(!isCounting);
        }}
      />
      <input
        type="button"
        value={"Reset"}
        onClick={() => {
          setPlaybackTime(0);
        }}
      />
      <div style={{
        backgroundColor: 'black',
        width: 100,
        height: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <PlaybackTime
          time={playbackTime}
        />
      </div>
    </div>
  )
};

