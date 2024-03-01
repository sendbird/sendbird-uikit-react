import './create-channel-ui.scss';
import React from 'react';
export interface CreateChannelUIProps {
    onCancel?(): void;
    renderStepOne?: (props: void) => React.ReactElement;
}
declare const CreateChannel: React.FC<CreateChannelUIProps>;
export default CreateChannel;
