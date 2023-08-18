import React from "react";
import {FileViewerComponentProps, ViewerTypes} from "./types";
import Icon, { IconColors, IconTypes } from '../Icon';

export function CloseButton({ props }: {
  props: FileViewerComponentProps;
}) {
  if (props.viewerType !== ViewerTypes.MULTI) {
    const { onDelete, isByMe, disableDelete } = props;
    return onDelete && isByMe && (
      <div className="sendbird-fileviewer__header__right__actions__delete">
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
  }
  return null;
}