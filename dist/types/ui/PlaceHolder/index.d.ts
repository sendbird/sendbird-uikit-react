import { ReactElement } from 'react';
import './index.scss';
export declare const PlaceHolderTypes: {
    readonly LOADING: "LOADING";
    readonly NO_CHANNELS: "NO_CHANNELS";
    readonly NO_MESSAGES: "NO_MESSAGES";
    readonly WRONG: "WRONG";
    readonly SEARCH_IN: "SEARCH_IN";
    readonly SEARCHING: "SEARCHING";
    readonly NO_RESULTS: "NO_RESULTS";
};
export interface PlaceHolderProps {
    className?: string | Array<string>;
    type: keyof typeof PlaceHolderTypes;
    iconSize?: string | number;
    searchInString?: string;
    retryToConnect?: () => void;
}
export default function PlaceHolder({ className, type, iconSize, searchInString, retryToConnect, }: PlaceHolderProps): ReactElement;
