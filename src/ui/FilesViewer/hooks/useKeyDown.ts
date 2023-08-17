import {useEffect, useState} from "react";
import {FileInfo} from "../index";

export function useKeyDown({ viewerRef, fileInfoList, currentIndex,   onClickLeft,
  onClickRight, onClose
}) {
  const [currentFileInfo, setCurrentFileInfo] = useState<FileInfo>();
  useEffect(() => {
    if (fileInfoList && currentIndex > -1) {
      setCurrentFileInfo(fileInfoList[currentIndex]);
    } else {
      setCurrentFileInfo(null);
    }
  }, [fileInfoList, currentIndex]);

  useEffect(() => {
    const onKeyDown = (event) => {
      // const html = match(event.key)
      //   .with('Escape', () => ``)
      //   .with({ type: 'ok', data: { type: 'text' } }, (res) => `<p>${res.data.content}</p>`)
      //   .with({ type: 'ok', data: { type: 'img', src: P.select() } }, (src) => `<img src=${src} />`)
      //   .exhaustive();

      switch (event.key) {
        case 'Escape':
          onClose?.();
          break;
        case 'ArrowLeft':
          onClickLeft?.();
          break;
        case 'ArrowRight':
          onClickRight?.();
          break;
        default:
      }
      event.preventDefault();
    }
    viewerRef.current.addEventListener('keydown', onKeyDown);
    return () => {
      viewerRef.current.removeEventListener('keydown', onKeyDown);
    };
  }, [viewerRef]);

  return { currentFileInfo };
}