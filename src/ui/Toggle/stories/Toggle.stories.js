import React from 'react';
import { Toggle, ToggleContainer, ToggleUI } from '../index.tsx';

export default { title: 'UI Components/Toggle' };

export const withText = () => {
  return (
    <div style={{ paddingLeft: '10px' }}>
      <h5>Noraml: controll</h5>
      <Toggle onChange={(e) => { console.log('OnChange: ', e.currentTarget.checked) }} />
      <h5>Noraml: controll, default checked</h5>
      <Toggle onChange={(e) => { console.log('OnChange: ', e.currentTarget.checked) }} defaultChecked />
      <h5>Noraml: uncontroll, checked</h5>
      <Toggle checked animationDuration="0s" />
      <h5>Noraml: uncontroll, unchecked</h5>
      <Toggle checked={false} animationDuration="0s" />
      <h5>Noraml: disabled</h5>
      <Toggle disabled />
      <h5>Reverse: controll</h5>
      <Toggle reversed onChange={(e) => { console.log('OnChange: ', e.currentTarget.checked) }} />
      <h5>Size up: controll</h5>
      <Toggle onChange={(e) => { console.log('OnChange: ', e.currentTarget.checked) }} width="80px" />
      <h5>Size down: controll</h5>
      <Toggle onChange={(e) => { console.log('OnChange: ', e.currentTarget.checked) }} width="30px" />
      <h5>One Container and Several UI</h5>
      <ToggleContainer>
        <span>normal</span><ToggleUI />
        <span>reversed</span><ToggleUI reversed />
      </ToggleContainer>
    </div>
  )
};
