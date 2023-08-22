import { mapFileViewerComponentProps } from '../utils';
import { FileViewerComponentProps, ViewerTypes } from '../types';
import { FILE_INFO_LIST } from '../data.mock';

const noop = () => { /* noop */ };

describe('Global-utils/mapFileViewerComponentProps', () => {
  it('when given MULTI props, return indexed file viewer component props for index zero.', () => {
    const props: FileViewerComponentProps = {
      nickname: 'hoon100',
      profileUrl: 'https://static.sendbird.com/sample/profiles/profile_34_512px.png',
      viewerType: ViewerTypes.MULTI,
      fileInfoList: FILE_INFO_LIST,
      currentIndex: 0,
      onClickLeft: noop,
      onClickRight: noop,
      onClose: noop,
    };
    const { name, type, url } = mapFileViewerComponentProps({ props });
    const expectedFVCPs = FILE_INFO_LIST[0];
    expect(name).toBe(expectedFVCPs.name);
    expect(type).toBe(expectedFVCPs.type);
    expect(url).toBe(expectedFVCPs.url);
  });
  it('when given MULTI props, return indexed file viewer component props for index one.', () => {
    const props: FileViewerComponentProps = {
      nickname: 'hoon100',
      profileUrl: 'https://static.sendbird.com/sample/profiles/profile_34_512px.png',
      viewerType: ViewerTypes.MULTI,
      fileInfoList: FILE_INFO_LIST,
      currentIndex: 1,
      onClickLeft: noop,
      onClickRight: noop,
      onClose: noop,
    };
    const { name, type, url } = mapFileViewerComponentProps({ props });
    const expectedFVCPs = FILE_INFO_LIST[1];
    expect(name).toBe(expectedFVCPs.name);
    expect(type).toBe(expectedFVCPs.type);
    expect(url).toBe(expectedFVCPs.url);
  });
  it('when given SINGLE props, return single file viewer component props.', () => {
    const props: FileViewerComponentProps = {
      nickname: 'hoon100',
      profileUrl: 'https://static.sendbird.com/sample/profiles/profile_34_512px.png',
      viewerType: ViewerTypes.SINGLE,
      name: 'sent-mail (1).png',
      type: 'image/png',
      url: 'https://static.sendbird.com/sample/profiles/profile_15_512px.png',
      isByMe: false,
      disableDelete: true,
      onClose: noop,
      onDelete: noop,
    };
    const { name, type, url } = mapFileViewerComponentProps({ props });
    expect(name).toBe(props.name);
    expect(type).toBe(props.type);
    expect(url).toBe(props.url);
  });
});
