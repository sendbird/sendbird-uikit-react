import { ButtonTypes, ButtonSizes } from './types';

export function changeTypeToClassName(type: ButtonTypes): string | null {
  switch (type) {
    case ButtonTypes.PRIMARY: return 'sendbird-button--primary';
    case ButtonTypes.SECONDARY: return 'sendbird-button--secondary';
    case ButtonTypes.DANGER: return 'sendbird-button--danger';
    case ButtonTypes.DISABLED: return 'sendbird-button--disabled';
    case ButtonTypes.WARNING: return 'sendbird-button--warning';

    default: return null;
  }
}

export function changeSizeToClassName(size: ButtonSizes): string | null {
  switch (size) {
    case ButtonSizes.BIG: return 'sendbird-button--big';
    case ButtonSizes.SMALL: return 'sendbird-button--small';
    default: return null;
  }
}
