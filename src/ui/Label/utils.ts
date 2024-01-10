import { Typography, Colors } from './types';
import { ObjectValues } from '../../utils/typeHelpers/objectValues';

export function changeTypographyToClassName(type?: ObjectValues<typeof Typography>) {
  switch (type) {
    case Typography.H_1: return 'sendbird-label--h-1';
    case Typography.H_2: return 'sendbird-label--h-2';
    case Typography.SUBTITLE_1: return 'sendbird-label--subtitle-1';
    case Typography.SUBTITLE_2: return 'sendbird-label--subtitle-2';
    case Typography.BODY_1: return 'sendbird-label--body-1';
    case Typography.BODY_2: return 'sendbird-label--body-2';
    case Typography.BUTTON_1: return 'sendbird-label--button-1';
    case Typography.BUTTON_2: return 'sendbird-label--button-2';
    case Typography.BUTTON_3: return 'sendbird-label--button-3';
    case Typography.CAPTION_1: return 'sendbird-label--caption-1';
    case Typography.CAPTION_2: return 'sendbird-label--caption-2';
    case Typography.CAPTION_3: return 'sendbird-label--caption-3';
    default: return '';
  }
}

export function changeColorToClassName(color?: ObjectValues<typeof Colors>) {
  switch (color) {
    case Colors.ONBACKGROUND_1: return 'sendbird-label--color-onbackground-1';
    case Colors.ONBACKGROUND_2: return 'sendbird-label--color-onbackground-2';
    case Colors.ONBACKGROUND_3: return 'sendbird-label--color-onbackground-3';
    case Colors.ONBACKGROUND_4: return 'sendbird-label--color-onbackground-4';
    case Colors.ONCONTENT_1: return 'sendbird-label--color-oncontent-1';
    case Colors.ONCONTENT_2: return 'sendbird-label--color-oncontent-2';
    case Colors.PRIMARY: return 'sendbird-label--color-primary'; // should be Primary-3 fix me
    case Colors.ERROR: return 'sendbird-label--color-error';
    case Colors.SECONDARY_3: return 'sendbird-label--color-secondary-3';
    default: return '';
  }
}
