import { FileInfo, FileViewerComponentProps, MultiFilesViewer, SingleFileViewer, ViewerTypes } from './types';

export function mapFileViewerComponentProps({ props }: {
  props: FileViewerComponentProps;
}): FileInfo {
  if (props.viewerType === ViewerTypes.MULTI) {
    const { fileInfoList, currentIndex } = props as MultiFilesViewer;
    return fileInfoList[currentIndex];
  }
  const fileInfo: FileInfo = props as SingleFileViewer;
  return {
    name: fileInfo.name,
    type: fileInfo.type,
    url: fileInfo.url,
  };
}
