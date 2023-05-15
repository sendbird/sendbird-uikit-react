import jsdom from 'jsdom';

import { nodeListToArray } from '../utils';

describe('MessageInputUtils/nodeListToArray', () => {
  it('should convert node list to array', () => {
    const P_COUNT = 4;
    const dom = new jsdom.JSDOM(`
      <div>${Array(P_COUNT).fill(0).map(() => '<p></p>').join('')}
      </div>
    `);
    const nodes = nodeListToArray(dom.window.document.querySelectorAll('p'));
    expect(nodes.length).toEqual(4);
  });

  it('should return empty array if nodelist is null', () => {
    const nodes = nodeListToArray(null);
    expect(nodes.length).toBe(0);
  });

  it('should return empty array if nodelist is undefined', () => {
    const nodes = nodeListToArray(null);
    expect(nodes.length).toBe(0);
  });
});
