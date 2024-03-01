import { ThreadMessageKindType } from '../../../../ui/MultipleFilesMessageItemBody';
interface DynamicSideLengthProps {
    threadMessageKind?: ThreadMessageKindType;
    isMobile: boolean;
}
export declare function useThreadMessageKindKeySelector({ threadMessageKind, isMobile, }: DynamicSideLengthProps): string;
export {};
