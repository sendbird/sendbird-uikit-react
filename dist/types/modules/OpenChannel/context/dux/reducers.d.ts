import { State as initialStateInterface } from './initialState';
interface ActionInterface {
    type: string;
    payload?: any;
}
export default function reducer(state: initialStateInterface, action: ActionInterface): initialStateInterface;
export {};
