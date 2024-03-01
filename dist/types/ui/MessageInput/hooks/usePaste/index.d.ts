/// <reference types="react" />
import { DynamicProps } from './types';
export declare function usePaste({ ref, setIsInput, setHeight, channel, setMentionedUsers, }: DynamicProps): (e: React.ClipboardEvent<HTMLDivElement>) => void;
export default usePaste;
