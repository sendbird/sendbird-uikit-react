import { ReactElement } from 'react';
interface Props {
    onCancel(): void;
    onSubmit(members: Array<string>): void;
}
export default function AddOperatorsModal({ onCancel, onSubmit, }: Props): ReactElement;
export {};
