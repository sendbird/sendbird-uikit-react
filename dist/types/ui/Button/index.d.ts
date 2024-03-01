import { ReactElement } from 'react';
import './index.scss';
import { LabelColors } from '../Label';
import { ButtonTypes, ButtonSizes } from './types';
import { ObjectValues } from '../../utils/typeHelpers/objectValues';
import { Typography } from '../Label/types';
export interface ButtonProps {
    className?: string | Array<string>;
    type?: ButtonTypes;
    size?: ButtonSizes;
    children: string | ReactElement;
    disabled?: boolean;
    onClick?: () => void;
    labelType?: ObjectValues<typeof Typography>;
    labelColor?: ObjectValues<typeof LabelColors>;
}
export default function Button({ className, type, size, children, disabled, onClick, labelType, labelColor, }: ButtonProps): ReactElement;
export * from './types';
