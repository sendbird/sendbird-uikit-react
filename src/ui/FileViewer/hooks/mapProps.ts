import {FileInfo, FileViewerComponentProps, MultiFileViewer, SingleFileViewer} from "../types";

/**
 * Converts file/fileinfo[] into nice props for FileViewer
 * // shouldnt even need to be a hook. maybe simplify this to a function
 */
export function mapProps({ props, idx }: {
  props: SingleFileViewer | MultiFileViewer;
  idx: number;
}): FileInfo {
  if (props.fileInfoList) {
    const file = props.fileInfoList[idx];
    return {
      // do default props
      name: file.fileName || '',
      type: file.mimeType || '',
      url: file.url,
    };
  }
  // single
  const file = props as SingleFileViewer;
  return {
    name: file.name,
    type: file.type,
    url: file.url,
  };
}
