import { Type, Size } from './type';

export function changeTypeToClassName(type: Type): string {
  switch (type) {
    case Type.PRIMARY: return 'sendbird-button--primary';
    case Type.SECONDARY: return 'sendbird-button--secondary';
    case Type.DANGER: return 'sendbird-button--danger';
    case Type.DISABLED: return 'sendbird-button--disabled';
    default: return null;
  }
}

export function changeSizeToClassName(size: Size): string {
  switch (size) {
    case Size.BIG: return 'sendbird-button--big';
    case Size.SMALL: return 'sendbird-button--small';
    default: return null;
  }
}
