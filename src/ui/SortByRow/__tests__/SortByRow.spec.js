import React from 'react';
import { render } from '@testing-library/react';

import SortByRow from "../index";

const MOCK_ARR = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
];
const ITME_WIDTH = 44;
const ITEM_HEIGHT = 40;

describe('ui/SortByRow', () => {
  it('should be sorted by 3', function () {
    const className = "exam-classname";
    const maxItemCount = 3;
    const { container } = render(
      <SortByRow
        className={className}
        maxItemCount={maxItemCount}
        itemWidth={ITME_WIDTH}
        itemHeight={ITME_WIDTH}
      >
        {MOCK_ARR}
      </SortByRow>
    );
    expect(
      container.getElementsByClassName(className)
    ).toHaveLength(parseInt(MOCK_ARR.length / maxItemCount) + ((MOCK_ARR.length % maxItemCount > 0) ? 1 : 0));
    expect(
      container.getElementsByClassName(className)
    ).toHaveLength(3);
  });

  it('should be sorted by 8', function () {
    const className = "exam-classname";
    const maxItemCount = 8;
    const { container } = render(
      <SortByRow
        className={className}
        maxItemCount={maxItemCount}
        itemWidth={ITME_WIDTH}
        itemHeight={ITME_WIDTH}
      >
        {MOCK_ARR}
      </SortByRow>
    );

    expect(
      container.getElementsByClassName(className)
    ).toHaveLength(parseInt(MOCK_ARR.length / maxItemCount) + ((MOCK_ARR.length % maxItemCount > 0) ? 1 : 0));
    expect(
      container.getElementsByClassName(className)
    ).toHaveLength(2);
  });

  it('should be sorted by 10', function () {
    const className = "exam-classname";
    const maxItemCount = 10;
    const { container } = render(
      <SortByRow
        className={className}
        maxItemCount={maxItemCount}
        itemWidth={ITME_WIDTH}
        itemHeight={ITME_WIDTH}
      >
        {MOCK_ARR}
      </SortByRow>
    );

    expect(
      container.getElementsByClassName(className)
    ).toHaveLength(
      parseInt(MOCK_ARR.length / maxItemCount) + ((MOCK_ARR.length % maxItemCount > 0) ? 1 : 0)
    );
    expect(
      container.getElementsByClassName(className)
    ).toHaveLength(1);
  });

  it('should do a snapshot test of the SortByRow DOM', function () {
    const className = 'exam-classname';
    const maxItemCount = 8;
    const { asFragment } = render(
      <SortByRow
        className={className}
        maxItemCount={maxItemCount}
        itemWidth={ITME_WIDTH}
        itemHeight={ITEM_HEIGHT}
      >
        {MOCK_ARR}
      </SortByRow>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
