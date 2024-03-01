import { ReactElement } from 'react';
import { OpenChannelListUIProps } from './components/OpenChannelListUI';
import { OpenChannelListProviderProps } from './context/OpenChannelListInterfaces';
export interface OpenChannelListProps extends OpenChannelListProviderProps, OpenChannelListUIProps {
}
declare function OpenChannelList({ className, queries, onChannelSelected, renderHeader, renderChannelPreview, renderPlaceHolderEmpty, renderPlaceHolderError, renderPlaceHolderLoading, }: OpenChannelListProps): ReactElement;
export default OpenChannelList;
