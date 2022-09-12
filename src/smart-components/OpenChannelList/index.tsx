import React, { ReactElement } from 'react';
import OpenChannelListUI, { OpenChannelListUIProps } from './components/OpenChannelListUI';
import { OpenChannelListProvider } from './context/OpenChannelListProvider';
import { OpenChannelListProviderProps }  from './context/OpenChannelListInterfaces';

export interface OpenChannelListProps extends OpenChannelListProviderProps, OpenChannelListUIProps { }

function OpenChannelList({
  // provider
  className,
  queries,
  onChannelSelected,
  // ui
  renderHeader,
  renderChannelPreview,
  renderPlaceHolderEmpty,
  renderPlaceHolderError,
  renderPlaceHolderLoading,
}: OpenChannelListProps): ReactElement {
  return (
    <OpenChannelListProvider
      className={className}
      queries={queries}
      onChannelSelected={onChannelSelected}
    >
      <OpenChannelListUI
        renderHeader={renderHeader}
        renderChannelPreview={renderChannelPreview}
        renderPlaceHolderEmpty={renderPlaceHolderEmpty}
        renderPlaceHolderError={renderPlaceHolderError}
        renderPlaceHolderLoading={renderPlaceHolderLoading}
      />
    </OpenChannelListProvider>
  );
}

export default OpenChannelList;
