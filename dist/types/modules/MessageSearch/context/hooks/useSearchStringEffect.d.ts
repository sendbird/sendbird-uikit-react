interface DynamicParams {
    searchString: string;
}
interface StaticParams {
    messageSearchDispatcher: (param: {
        type: string;
        payload: any;
    }) => void;
}
declare function useSearchStringEffect({ searchString }: DynamicParams, { messageSearchDispatcher }: StaticParams): string;
export default useSearchStringEffect;
