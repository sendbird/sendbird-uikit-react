import React from 'react';
import PlaceHolder, { PlaceHolderTypes } from '../index';

const description = `
  \`import PlaceHolder, { PlaceHolderTypes } from "@sendbird/uikit-react/ui/PlaceHolder";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/PlaceHolder',
  component: PlaceHolder,
  subcomponents: { PlaceHolderTypes },
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (arg) => (
  <PlaceHolder type={PlaceHolderTypes.LOADING} {...arg} />
);

export const loading = () => <PlaceHolder type={PlaceHolderTypes.LOADING} />;
export const noChannels = () => <PlaceHolder type={PlaceHolderTypes.NO_CHANNELS} />;
export const somethingWrong = () => <PlaceHolder type={PlaceHolderTypes.WRONG} />;
export const placeHodersInHTML = () => [
  <div style={{ display: 'flex', flexDirection: 'row' }}>
    <div style={{ width: 300, height: 300, border: 'solid 1px black', marginRight: '15px' }}>
      <PlaceHolder type={PlaceHolderTypes.LOADING} />
    </div>
    <div style={{ width: 300, height: 300, border: 'solid 1px black' }}>
      <PlaceHolder type={PlaceHolderTypes.NO_CHANNELS} />
    </div>
  </div>,
  <br />,
  <div style={{ display: 'flex', flexDirection: 'row' }}>
    <div style={{ width: 300, height: 300, border: 'solid 1px black', marginRight: '15px' }}>
      <PlaceHolder type={PlaceHolderTypes.WRONG} />
    </div>
    <div style={{ width: 300, height: 300, border: 'solid 1px black' }}>
      <PlaceHolder type={PlaceHolderTypes.WRONG} retryToConnect={() => alert('Retry to connect')} />
    </div>
  </div>,
  <br />,
  <div style={{ display: 'flex', flexDirection: 'row' }}>
    <div style={{ width: 300, height: 300, border: 'solid 1px black', marginRight: '15px' }}>
      <PlaceHolder type={PlaceHolderTypes.NO_MESSAGES} />
    </div>
    {/* <div style={{ width: 300, height: 300, border: 'solid 1px black' }}>
      <PlaceHolder type={PlaceHolderTypes.WRONG} retryToConnect={() => alert('Retry to connect')} />
    </div> */}
  </div>,
];
