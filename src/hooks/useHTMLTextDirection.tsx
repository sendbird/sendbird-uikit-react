import { useEffect } from 'react';
import { VOICE_PLAYER_ROOT_ID } from '../utils/consts';
import { HTMLTextDirection } from '../types';

const useHTMLTextDirection = (direction: HTMLTextDirection) => {
  useEffect(() => {
    /**
     * It sets the 'dir' attribute of the closest parent <div> element of the element with VOICE_PLAYER_ROOT_ID cause:
     * - An empty <div> element is created in the VoiceMessageProvider, which is the highest-level <div> element within the SendbirdProvider.
     * - It tries to find the nearest parent <div> element within the SendbirdProvider and sets 'dir' attribute,
     * ensuring that the directionality is applied correctly.
     * */
    const targetElement = document.getElementById(VOICE_PLAYER_ROOT_ID);
    targetElement.parentElement.dir = direction;
  }, [direction]);
};

export default useHTMLTextDirection;
