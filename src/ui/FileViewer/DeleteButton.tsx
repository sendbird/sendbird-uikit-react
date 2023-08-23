import React from 'react';
import { FileViewerComponentProps, ViewerTypes } from './types';
import Icon, { IconColors, IconTypes } from '../Icon';

export function DeleteButton(props: FileViewerComponentProps & { className?: string }): React.ReactElement {
  if (props.viewerType !== ViewerTypes.MULTI) {
    const { onDelete, isByMe, disableDelete, className } = props;
    return (isByMe)
      ? (
        <div className={`sendbird-fileviewer__header__right__actions__delete ${className}`}>
          <Icon
            className={disableDelete ? 'disabled' : ''}
            type={IconTypes.DELETE}
            fillColor={disableDelete ? IconColors.GRAY : IconColors.ON_BACKGROUND_1}
            height="24px"
            width="24px"
            onClick={(e) => { if (!disableDelete) { onDelete?.(e); } }}
          />
        </div>
      )
      : <></>;
  }
  return <></>;
}
