import { renderHook } from '@testing-library/react-hooks';
import useAppendDomNode from '../useAppendDomNode';

describe('useAppendDomNode', () => {
  const ids = ['test-id-0', 'test-id-1'];
  const rootId = 'root';
  const rootSelector = `#${rootId}`;

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = `
    <div id=${rootId}>
    </div>
    `;
  });

  it('renders correctly', () => {
    const { result } = renderHook(() => useAppendDomNode(ids, rootSelector));

    expect(document.getElementById(rootId).children.length).toBe(ids.length);
    ids.forEach((_, i) => {
      expect(document.getElementById(rootId).children[i].id).toBe(ids[i]);
    });
  });
});
