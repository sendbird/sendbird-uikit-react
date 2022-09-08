import { ButtonTypes, ButtonSizes } from './index';

export function changeTypeToClassName(type: ButtonTypes): string {
  switch (type) {
    case ButtonTypes.PRIMARY: return 'sendbird-button--primary';
    case ButtonTypes.SECONDARY: return 'sendbird-button--secondary';
    case ButtonTypes.DANGER: return 'sendbird-button--danger';
    case ButtonTypes.DISABLED: return 'sendbird-button--disabled';
    default: return null;
  }
}

export function changeSizeToClassName(size: ButtonSizes): string {
  switch (size) {
    case ButtonSizes.BIG: return 'sendbird-button--big';
    case ButtonSizes.SMALL: return 'sendbird-button--small';
    default: return null;
  }
}
