interface Request<Response> {
    (): Promise<Response>;
    cancel?(): void;
}
interface Options {
    resetResponseOnRefresh?: boolean;
}
interface State<T, E = unknown> {
    loading: boolean;
    response?: T;
    error?: E;
}
interface Return<T> extends State<T> {
    refresh(): Promise<void>;
}
export declare function useAsyncRequest<T>(request: Request<T>, options?: Options): Return<T>;
export {};
