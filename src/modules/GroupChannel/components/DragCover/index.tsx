import React, { useCallback, useEffect, useState } from 'react';
import Label from '../../../../ui/Label';
import { Typography } from '../../../../ui/Label/types';

export interface DragCoverProps {
  targetRef: React.RefObject<HTMLDivElement>;
  onDrop: (files: File[]) => void;
}

export const DragCover = (props: DragCoverProps) => {
  const {
    targetRef,
    onDrop,
  } = props;

  const [isShowing, setIsShowing] = useState(false);

  const onDragEnter = useCallback((e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsShowing(true);
  }, [targetRef]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
  }, [targetRef]);

  const onDragLeave = useCallback((e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsShowing(false);
  }, [targetRef]);

  const _onDrop = useCallback((e) => {
    e.preventDefault();
    setIsShowing(false);
    onDrop(Array.from(e.dataTransfer.files));
  }, [targetRef]);

  useEffect(() => {
    if (!targetRef) return;

    targetRef.current.addEventListener('dragenter', onDragEnter);
    targetRef.current.addEventListener('dragover', onDragOver);
    targetRef.current.addEventListener('dragleave', onDragLeave);
    targetRef.current.addEventListener('drop', _onDrop);

    return () => {
      targetRef.current.removeEventListener('dragenter', onDragEnter);
      targetRef.current.removeEventListener('dragover', onDragOver);
      targetRef.current.removeEventListener('dragleave', onDragLeave);
      targetRef.current.removeEventListener('drop', _onDrop);
    };

  }, [targetRef]);

  return (
    isShowing
      ? <div style={{
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        zIndex: 1,
      }}>
        <Label type={Typography.H_1}>Drop Here</Label>
      </div>
      : null
  );
};
