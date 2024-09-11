import React, { useCallback, useRef, useState } from 'react';
import IconButton from '../../IconButton';
import Icon, { IconColors, IconTypes } from '../../Icon';
import Label from '../../Label';

interface Params {
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
  onLimitReached?: () => void;
}

interface AttachedFile {
  file: File;
  preview: {
    url: string;
    type: string;
    name: string;
  };
}

export function useFileUploadButton({ accept, multiple, disabled, onLimitReached }: Params) {
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [focus, setFocus] = useState<number>();
  const input = useRef<HTMLInputElement>();

  const addFiles = useCallback(
    (newFiles: File[]) => {
      const filtered = newFiles.filter((it) => (accept ? accept.includes(it.type) : true));
      if (filtered.length === 0) return;
      if (!multiple && filtered.length > 1) {
        onLimitReached?.();
        return;
      }
      if (!multiple && filtered.length > 0 && files.length > 0) {
        onLimitReached?.();
        return;
      }

      setFiles((prev) => [
        ...prev,
        ...filtered.map((file) => ({ file, preview: { url: URL.createObjectURL(file), type: file.type, name: file.name } })),
      ]);
    },
    [accept, files, multiple, onLimitReached],
  );

  const removeFile = (index: number) => {
    setFiles((prev) => {
      return prev.filter((it, i) => {
        if (i !== index) {
          URL.revokeObjectURL(it.preview.url);
          return true;
        }
        return false;
      });
    });

    setFocus(undefined);
  };

  const clearFiles = () => {
    setFiles(() => {
      files.forEach((it) => URL.revokeObjectURL(it.preview.url));
      return [];
    });

    setFocus(undefined);
  };

  const renderFileButton = () => {
    return (
      <IconButton
        className={'sendbird-message-input--attach'}
        height={'32px'}
        width={'32px'}
        onClick={() => {
          clearFiles();
          input.current.click();
        }}
      >
        <Icon
          type={IconTypes.ATTACH}
          fillColor={disabled ? IconColors.ON_BACKGROUND_4 : IconColors.ON_BACKGROUND_2}
          width={'16px'}
          height={'16px'}
        />
        <input
          className={'sendbird-message-input--attach-input'}
          type={'file'}
          ref={input}
          onChange={(event) => {
            const fileList = event.currentTarget.files;
            if (fileList) {
              addFiles(Array.from(fileList));
            }
            event.target.value = '';
          }}
          accept={accept}
          multiple={multiple}
        />
      </IconButton>
    );
  };

  const renderFilePreview = () => {
    if (files.length === 0) return null;

    return (
      <div className={'sendbird-message-input--file-preview'}>
        {files.map(({ preview }, i) => {
          return (
            <div
              className={'sendbird-message-input--file'}
              key={preview.url}
              onMouseOver={() => setFocus(i)}
              onMouseLeave={() => setFocus(undefined)}
            >
              {focus === i && (
                <span
                  onClick={() => removeFile(i)}
                  style={{ display: 'flex', position: 'absolute', insetInlineEnd: -8, insetBlockStart: -8, cursor: 'pointer' }}
                >
                  <RemoveButton />
                </span>
              )}
              {(() => {
                if (preview.type.startsWith('image/')) {
                  {
                    /** FIXME(file-support): support open file previewer */
                  }
                  return <img className={'image'} alt={'file-image'} src={preview.url} />;
                }
                if (preview.type.startsWith('application/pdf')) {
                  return (
                    <div className={'pdf'}>
                      <div className={'pdf-icon'}>
                        <Icon type={IconTypes.FILE_DOCUMENT} width={'24px'} height={'24px'} />
                      </div>
                      <div className={'pdf-info'}>
                        <Label type={'BUTTON_1'} className={'pdf-name'} title={preview.name}>
                          {preview.name}
                        </Label>
                        <Label type={'CAPTION_3'} className={'pdf-type'}>
                          {'PDF'}
                        </Label>
                      </div>
                    </div>
                  );
                }
              })()}
            </div>
          );
        })}
      </div>
    );
  };

  return {
    files,
    addFiles,
    clearFiles,
    renderFileButton,
    renderFilePreview,
  };
}

const RemoveButton = () => {
  return (
    <div className={'sendbird-message-input--file-remove'} title={'Remove file'}>
      <Icon type={IconTypes.REMOVE} width={'22px'} height={'22px'} />
    </div>
  );
};
