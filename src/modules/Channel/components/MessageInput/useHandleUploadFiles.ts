import { useCallback, type ChangeEvent } from "react";
import { Logger } from "../../../../lib/SendbirdState";

/**
 * The handleUploadFiles is a function sending a FileMessage and MultipleFilesMessage
 * by the received FileList from the ChangeEvent of MessageInput component.
 */

interface UseHandleUploadFilesDynamicProps {
  onUploadFiles: (files: Array<File>) => void;
}
interface UseHandleUploadFilesStaticProps {
  logger: Logger;
}
type HandleUploadFunctionType = (event: ChangeEvent<HTMLInputElement>) => void;

export const useHandleUploadFiles = ({
  onUploadFiles,
}: UseHandleUploadFilesDynamicProps, {
  logger,
}: UseHandleUploadFilesStaticProps): Array<HandleUploadFunctionType> => {
  const handleUploadeFiles = useCallback((event) => {
    // Alert
    // check selected files size IF it's over 300MB
    // check selected files count IF it's over xxx
      // how? alert IF condition is not acceptable

    // Send Message
    // check condition of the file list
      // sendFileMessage: FileList(1)
      // sendMultipelFilesMessage: FileList(Image<n>)
      // sendFileMessage & sendMultipelFilesMessage: FileList(Image<n>, File<n>)
  }, [
    onUploadFiles,
  ]);
  // return [handleUploadeFiles]
  return [(event: ChangeEvent<HTMLInputElement>) => {}]
};
