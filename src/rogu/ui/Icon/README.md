### To add a new icon
* Copy the SVG file to svg directory
* Import the file to index.jsx
  `import IconAdd from '../../svgs/icon-add.svg';`
* Add icon type to type.js
  `ADD: 'ADD',`
* In index.jsx `changeTypeToIconComponent`
  `case Type.ADD: return <IconAdd />;`
* In your component, you can do:
  ```
    import Icon, { IconTypes, IconColors } from '../../../ui/Icon';

    ...

    <Icon
      type={IconTypes.ADD}
      fillColor={IconColors.PRIMARY}
      width="24px"
      height="24px"
    />
  ```
