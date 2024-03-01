import { ReactElement } from 'react';
import './login.scss';
interface setValuesParams {
    userId: string;
    nickName: string;
    darkTheme: boolean;
}
interface Props {
    setValues(params: setValuesParams): void;
}
export default function Login({ setValues, }: Props): ReactElement;
export {};
