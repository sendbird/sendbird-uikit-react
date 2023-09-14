import { CoreMessageType, isMultipleFilesMessage } from '../../utils';
import { match } from 'ts-pattern';
import { MultipleFilesMessage } from '@sendbird/chat/message';

export function getModalDeleteMessageTitle(stringSet: Record<string, string>, message: CoreMessageType): string {
  return match(message)
    .when(isMultipleFilesMessage, () => {
      const filesCount: number = (message as MultipleFilesMessage).fileInfoList.length;
      return `Do you want to delete all ${filesCount} photos?`;
    })
    .otherwise(() => {
      return stringSet.MODAL__DELETE_MESSAGE__TITLE;
    });
}
