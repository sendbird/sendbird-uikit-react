import React from 'react';
import { LabelTypography, LabelColors } from '../Label';
import { ObjectValues } from '../../utils/typeHelpers/objectValues';
export interface PlaybackTimeProps {
    className?: string;
    time: number;
    labelType?: ObjectValues<typeof LabelTypography>;
    labelColor?: ObjectValues<typeof LabelColors>;
}
export declare const PlaybackTime: ({ className, time, labelType, labelColor, }: PlaybackTimeProps) => React.ReactElement;
export default PlaybackTime;
