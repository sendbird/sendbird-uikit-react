import { ChangeEvent, ReactElement } from 'react';
import './index.scss';
export interface CheckboxProps {
    id?: string;
    checked?: boolean;
    disabled?: boolean;
    onChange?(e: ChangeEvent<HTMLInputElement>): void;
}
export default function Checkbox({ id, checked, disabled, onChange, }: CheckboxProps): ReactElement;
