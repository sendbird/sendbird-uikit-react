import React from 'react';
import { PlaceHolderTypes } from '../../../ui/PlaceHolder';
type ChannelsPlaceholderProps = {
    type: keyof typeof PlaceHolderTypes;
};
export default function ChannelsPlaceholder({ type }: ChannelsPlaceholderProps): React.JSX.Element;
export {};
