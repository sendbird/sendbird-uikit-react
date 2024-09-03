import React, { useRef, useState } from 'react';
import IconButton from '../../IconButton';
import Icon, { IconColors, IconTypes } from '../../Icon';
import Label from '../../Label';

interface Params {
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
}

export function useFileUploadButton({ accept, multiple, disabled }: Params) {
  const [files, setFiles] = useState<File[]>([]);
  const [filePreview, setFilePreview] = useState<{ url: string; type: string; name: string }[]>([]);

  const [focus, setFocus] = useState<number>();
  const input = useRef<HTMLInputElement>();

  const addFiles = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setFilePreview((prev) => [...prev, ...newFiles.map((it) => ({ url: URL.createObjectURL(it), type: it.type, name: it.name }))]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreview((prev) => {
      return prev.filter((it, i) => {
        if (i !== index) {
          URL.revokeObjectURL(it.url);
          return true;
        }
        return false;
      });
    });

    setFocus(undefined);
  };

  const clearFiles = () => {
    setFiles([]);
    setFilePreview((prev) => {
      prev.forEach((it) => URL.revokeObjectURL(it.url));
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
          fillColor={disabled ? IconColors.ON_BACKGROUND_4 : IconColors.CONTENT_INVERSE}
          width={'20px'}
          height={'20px'}
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
    if (filePreview.length === 0) return null;

    return (
      <div className={'sendbird-message-input--file-preview'}>
        {filePreview.map((it, i) => {
          return (
            <div
              className={'sendbird-message-input--file'}
              key={it.url}
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
                if (it.type.startsWith('image/')) {
                  {
                    /** FIXME(file-support): support open file previewer */
                  }
                  return <img className={'image'} alt={'file-image'} src={it.url} />;
                }
                if (it.type.startsWith('application/pdf')) {
                  return (
                    <div className={'pdf'}>
                      <div className={'pdf-icon'}>
                        <Icon type={IconTypes.FILE_DOCUMENT} width={'24px'} height={'24px'} />
                      </div>
                      <div className={'pdf-info'}>
                        <Label type={'BUTTON_1'} className={'pdf-name'} title={it.name}>
                          {it.name}
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
    filePreview,
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
