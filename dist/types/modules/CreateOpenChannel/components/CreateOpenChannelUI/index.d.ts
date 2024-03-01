import React from 'react';
import './index.scss';
export interface CreateOpenChannelUIProps {
    closeModal?: () => void;
    renderHeader?: () => React.ReactElement;
    renderProfileInput?: () => React.ReactElement;
}
declare function CreateOpenChannelUI({ closeModal, renderHeader, renderProfileInput, }: CreateOpenChannelUIProps): React.ReactElement;
export default CreateOpenChannelUI;
