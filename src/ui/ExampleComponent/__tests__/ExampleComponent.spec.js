import React from 'react';
import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';

import ExampleComponent from "../index";

describe('ExampleComponent', () => {
  it('should render text prop', function() {
    const text = "example-text";
    const component = shallow(<ExampleComponent text={text} />);

    expect(
      component.find(".sendbird-text").text()
    ).toEqual(text);
  });

  it('should do a snapshot test of the ExampleComponent DOM', function() {
    const text = "example-text";
    const component = renderer.create(
      <ExampleComponent text={text} />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
