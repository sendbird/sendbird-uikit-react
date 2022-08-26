import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

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

describe('SortByRow', () => {
  it('should be sorted by 3', function () {
    const className = "exam-classname";
    const maxItemCount = 3;
    const component = shallow(
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
      component.find(`.${className}`)
    ).toHaveLength(
      parseInt(MOCK_ARR.length / maxItemCount) + ((MOCK_ARR.length % maxItemCount > 0) ? 1 : 0)
    );
    expect(
      component.find(`.${className}`)
    ).toHaveLength(3);
  });

  it('should be sorted by 8', function () {
    const className = "exam-classname";
    const maxItemCount = 8;
    const component = shallow(
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
      component.find(`.${className}`)
    ).toHaveLength(
      parseInt(MOCK_ARR.length / maxItemCount) + ((MOCK_ARR.length % maxItemCount > 0) ? 1 : 0)
    );
    expect(
      component.find(`.${className}`)
    ).toHaveLength(2);
  });

  it('should be sorted by 10', function () {
    const className = "exam-classname";
    const maxItemCount = 10;
    const component = shallow(
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
      component
    ).toHaveLength(
      parseInt(MOCK_ARR.length / maxItemCount) + ((MOCK_ARR.length % maxItemCount > 0) ? 1 : 0)
    );
    expect(
      component
    ).toHaveLength(1);
  });

  it('should do a snapshot test of the SortByRow DOM', function () {
    const className = 'exam-classname';
    const maxItemCount = 8;
    const component = renderer.create(
      <SortByRow
        className={className}
        maxItemCount={maxItemCount}
        itemWidth={ITME_WIDTH}
        itemHeight={ITEM_HEIGHT}
      >
        {MOCK_ARR}
      </SortByRow>,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
