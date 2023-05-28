import { render } from '@testing-library/react';
import React, { useRef } from 'react';
import { useDirtyGetMentions } from '../useDirtyGetMentions';

const logger = {
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
};

const TestComponent = ({
  mentions,
  showInput,
}: {
  mentions: number[],
  showInput: boolean,
}): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const mentionNodes = useDirtyGetMentions({ ref }, { logger });
  return (
    <div>
      <div id="mentions">
        {mentionNodes.map((node) => (
          <div key={node.id}>{node.id}</div>
        ))}
      </div>
      {
        showInput && (
          <div ref={ref} id="input">
            {
              mentions.map((mention) => (
                <div data-sb-mention='true' id={mention.toString()} key={mention.toString()}>
                  mention-{mention}
                </div>
              ))
            }
          </div>
        )
      }
    </div>
  );
}

describe('useDirtyGetMentions', () => {
  it('should get mention nodes when Input is visible', () => {
    const { asFragment } = render(<TestComponent mentions={[1, 2, 3]} showInput={true} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should get empty list of mentions when Input is not rendered', () => {
    const { asFragment } = render(<TestComponent mentions={[1, 2, 3]} showInput={false} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should get list of mentions when Input is changed', () => {
    const { rerender, asFragment } = render(<TestComponent mentions={[1, 2, 3]} showInput={false} />);
    expect(asFragment()).toMatchSnapshot();
    rerender(<TestComponent mentions={[1, 2, 3, 4]} showInput={true} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
