import { useEffect } from 'react';
import { MODAL_ROOT } from '../../../hooks/useModal';
import { EMOJI_REACTION_LIST_PORTAL_ROOT, DROPDOWN_PORTAL_ROOT } from '../../../ui/ContextMenu';
import { HTMLTextDirection } from '../../../types';
import { APP_LAYOUT_ROOT } from '../const';
import { useMediaQueryContext } from '../../../lib/MediaQueryContext';

const ELEMENT_IDS = [
  MODAL_ROOT,
  EMOJI_REACTION_LIST_PORTAL_ROOT,
  DROPDOWN_PORTAL_ROOT,
  APP_LAYOUT_ROOT,
];

/**
 * This hook sets the direction (dir) attribute for specified elements.
 *
 * @param {HTMLTextDirection} direction - The direction to set ('ltr' or 'rtl').
 *
 * Note:
 * This is necessary because elements such as modal, emoji reaction list, and dropdown
 * are at the same level as the Sendbird app root element. They need to have the 'dir'
 * attribute set explicitly to ensure proper directionality based on the app's language setting.
 */
const useApplyTextDirection = (direction: HTMLTextDirection) => {
  const { isMobile } = useMediaQueryContext();
  useEffect(() => {
    ELEMENT_IDS.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.dir = direction;
      }
    });
  }, [direction, isMobile]);
};

export default useApplyTextDirection;
