import React, { ReactNode } from 'react';
import { LabelColors, LabelTypography } from '../Label';
import './index.scss';
import { ObjectValues } from '../../utils/typeHelpers/objectValues';
type LinkLabelProps = {
    src: string;
    className?: string | string[];
    type?: ObjectValues<typeof LabelTypography>;
    color?: ObjectValues<typeof LabelColors>;
    children: ReactNode;
};
export default function LinkLabel({ className, src, type, color, children }: LinkLabelProps): React.JSX.Element;
export declare const LinkLabelTypography: {
    readonly H_1: "H_1";
    readonly H_2: "H_2";
    readonly SUBTITLE_1: "SUBTITLE_1";
    readonly SUBTITLE_2: "SUBTITLE_2";
    readonly BODY_1: "BODY_1";
    readonly BODY_2: "BODY_2";
    readonly BUTTON_1: "BUTTON_1";
    readonly BUTTON_2: "BUTTON_2";
    readonly BUTTON_3: "BUTTON_3";
    readonly CAPTION_1: "CAPTION_1";
    readonly CAPTION_2: "CAPTION_2";
    readonly CAPTION_3: "CAPTION_3";
};
export declare const LinkLabelColors: {
    readonly ONBACKGROUND_1: "ONBACKGROUND_1";
    readonly ONBACKGROUND_2: "ONBACKGROUND_2";
    readonly ONBACKGROUND_3: "ONBACKGROUND_3";
    readonly ONBACKGROUND_4: "ONBACKGROUND_4";
    readonly ONCONTENT_1: "ONCONTENT_1";
    readonly ONCONTENT_2: "ONCONTENT_2";
    readonly PRIMARY: "PRIMARY";
    readonly ERROR: "ERROR";
    readonly SECONDARY_3: "SECONDARY_3";
};
export {};
