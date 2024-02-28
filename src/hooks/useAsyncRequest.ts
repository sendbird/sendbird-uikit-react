import { DependencyList, useEffect, useState } from 'react';

interface Request<Response> {
  (): Promise<Response>;
  cancel?(): void;
}

interface Options {
  resetResponseOnRefresh?: boolean;
  persistLoadingIfNoResponse?: boolean;
  deps?: DependencyList;
}

interface State<T, E = unknown> {
  loading: boolean;
  response?: T;
  error?: E;
}

interface Return<T> extends State<T> {
  refresh(): Promise<void>;
}

export function useAsyncRequest<T>(request: Request<T>, options?: Options): Return<T> {
  const [state, setState] = useState<State<T>>({ loading: true, response: undefined, error: undefined });

  const updateWithRequest = async () => {
    try {
      setState((prev) => ({ loading: true, error: undefined, response: options?.resetResponseOnRefresh ? undefined : prev.response }));
      const response = await request();
      if (response) {
        setState((prev) => ({ ...prev, response, loading: false }));
      } else {
        setState((prev) => ({ ...prev, loading: Boolean(options?.persistLoadingIfNoResponse) }));
      }
    } catch (error) {
      setState((prev) => ({ ...prev, error, loading: false }));
    }
  };

  useEffect(() => {
    updateWithRequest();
    return () => {
      if (request.cancel && typeof request.cancel === 'function') {
        request.cancel();
      }
    };
  }, options?.deps ?? []);

  return { ...state, refresh: updateWithRequest };
}
