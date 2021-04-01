import React from 'react';
import PlaceHolder from '../index.jsx';

import PlaceHolderType from '../type';

export default { title: 'UI Components/PlaceHolder' };

export const loading = () => <PlaceHolder type={PlaceHolderType.LOADING} />;
export const noChannels = () => <PlaceHolder type={PlaceHolderType.NO_CHANNELS} />;
export const somethingWrong = () => <PlaceHolder type={PlaceHolderType.WRONG} />;
export const placeHodersInHTML = () => [
  <div style={{ display: 'flex', flexDirection: 'row' }}>
    <div style={{ width: 300, height: 300, border: 'solid 1px black', marginRight: '15px' }}>
      <PlaceHolder type={PlaceHolderType.LOADING} />
    </div>
    <div style={{ width: 300, height: 300, border: 'solid 1px black' }}>
      <PlaceHolder type={PlaceHolderType.NO_CHANNELS} />
    </div>
  </div>,
  <br />,
  <div style={{ display: 'flex', flexDirection: 'row' }}>
    <div style={{ width: 300, height: 300, border: 'solid 1px black', marginRight: '15px' }}>
      <PlaceHolder type={PlaceHolderType.WRONG} />
    </div>
    <div style={{ width: 300, height: 300, border: 'solid 1px black' }}>
      <PlaceHolder type={PlaceHolderType.WRONG} retryToConnect={() => alert('Retry to connect')} />
    </div>
  </div>,
  <br />,
  <div style={{ display: 'flex', flexDirection: 'row' }}>
    <div style={{ width: 300, height: 300, border: 'solid 1px black', marginRight: '15px' }}>
      <PlaceHolder type={PlaceHolderType.NO_MESSAGES} />
    </div>
    {/* <div style={{ width: 300, height: 300, border: 'solid 1px black' }}>
      <PlaceHolder type={PlaceHolderType.WRONG} retryToConnect={() => alert('Retry to connect')} />
    </div> */}
  </div>,
];
