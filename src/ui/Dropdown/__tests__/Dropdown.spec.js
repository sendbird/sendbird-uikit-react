import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import DropdownMenu, { MenuItem } from "../index";
import IconButton from "../../IconButton";
import DefaultIcon from "../../../svgs/no-image.svg";

describe('ExampleComponent', () => {
  it('should match the snapshot of the DropdownMenu DOM', function () {
    const component = renderer.create(
      <DropdownMenu
        renderButton={(closeDropdown) => (
          <IconButton
            onClick={() => closeDropdown()}
            height="36px"
            width="36px"
          >
            <DefaultIcon />
          </IconButton>
        )}
        renderItems={(closeDropdown) => (
          <>
            <MenuItem onClick={e => { alert('clicked 1'); closeDropdown(); }}>
              option1
            </MenuItem>
          </>
        )}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should open dropdown on click', function () {
    const component = mount(<DropdownMenu
      renderButton={(toggleDropdown) => (
        <IconButton
          onClick={() => toggleDropdown()}
          height="36px"
          width="36px"
        >
          <DefaultIcon />
        </IconButton>
      )}
      renderItems={(closeDropdown) => (
        <>
          <MenuItem onClick={e => { alert('clicked 1'); closeDropdown(); }}>
            option1
          </MenuItem>
        </>
      )}
    />);
    component.find('button').simulate('click');
    expect(
      component.find('.sendbird-dropdown__menu-item').text()
    ).toEqual('option1');
  });

  it('should close dropdown when clicked twice', function () {
    const component = mount(<DropdownMenu
      renderButton={(toggleDropdown) => (
        <IconButton
          onClick={() => toggleDropdown()}
          height="36px"
          width="36px"
        >
          <DefaultIcon />
        </IconButton>
      )}
      renderItems={(closeDropdown) => (
        <>
          <MenuItem onClick={e => { alert('clicked 1'); closeDropdown(); }}>
            option1
          </MenuItem>
        </>
      )}
    />);
    component.find('button').simulate('click');
    // first click opens the component
    expect(
      component.find('.sendbird-dropdown__menu-item').text()
    ).toEqual('option1');

    component.find('button').simulate('click');
    // second click closes the component
    expect(
      component.find('.sendbird-dropdown__menu-item').length
    ).toEqual(0);
  });

  // todo - implement
  it.skip('should close dropdown when clicked outside', () => { });
});
