import React from 'react';
import { GroupChannelUIBasicProps } from '../../../GroupChannel/components/GroupChannelUI/GroupChannelUIView';
export interface ChannelUIProps extends GroupChannelUIBasicProps {
    isLoading?: boolean;
    /**
     * Customizes all child components of the message component.
     * */
    renderMessage?: GroupChannelUIBasicProps['renderMessage'];
}
declare const ChannelUI: (props: ChannelUIProps) => React.JSX.Element;
export default ChannelUI;
