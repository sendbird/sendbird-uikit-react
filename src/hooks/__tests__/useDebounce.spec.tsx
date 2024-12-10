import { renderHook } from '@testing-library/react-hooks';
import { useDebounce } from '../useDebounce';

describe('useAsyncRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handle useDebounce correctly', async () => {
    const mockFunction = jest.fn();
    const { result } = renderHook(() => useDebounce(mockFunction, 1000));

    const debounceFunction = result.current;

    debounceFunction();
    debounceFunction();
    debounceFunction();
    debounceFunction();
    debounceFunction();

    await new Promise(resolve => setTimeout(resolve, 1000));

    expect(mockFunction).toBeCalledTimes(1);
  });

});
