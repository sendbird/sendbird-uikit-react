module.exports = (plop) => {
  // create your generators here
  plop.setGenerator('basic component', {
    description: 'this will create a ui component with all necessary subitems - test, scss etc',
    prompts: [{
      type: 'input',
      name: 'name',
      message: 'Please name your component',
    }], // array of inquirer prompts
    actions: [{
      // add jsx
      type: 'add',
      path: 'src/ui/{{name}}/index.tsx',
      templateFile: 'plop-templates/ui/tsx.hbs',
    }, {
      // add scss
      type: 'add',
      path: 'src/ui/{{name}}/index.scss',
      templateFile: 'plop-templates/ui/scss.hbs',
    }, {
      // add test
      type: 'add',
      path: 'src/ui/{{name}}/__tests__/{{name}}.spec.js',
      templateFile: 'plop-templates/ui/test.hbs',
    }, {
      // add story
      type: 'add',
      path: 'src/ui/{{name}}/stories/{{name}}.stories.js',
      templateFile: 'plop-templates/ui/stories.hbs',
    }],
  });

  plop.setGenerator('basic reducer', {
    description: 'this will create a reducer component with all necessary subitems',
    prompts: [{
      type: 'input',
      name: 'name',
      message: 'Name your reducer',
    }, {
      type: 'input',
      name: 'path',
      message: 'Where should we put your reducer? ex: `src/modules/Channel/context/dux`',
    }], // array of inquirer prompts
    actions: [{
      // add initial state
      type: 'add',
      path: '{{path}}/initialState.ts',
      templateFile: 'plop-templates/reducer/initialState.hbs',
    }, {
      // add actionType
      type: 'add',
      path: '{{path}}/actionTypes.ts',
      templateFile: 'plop-templates/reducer/actionTypes.hbs',
    }, {
      // add reducer
      type: 'add',
      path: '{{path}}/reducer.ts',
      templateFile: 'plop-templates/reducer/reducer.hbs',
    }, {
      // add test
      type: 'add',
      path: '{{path}}/__tests__/{{camelCase name}}Reducer.spec.js',
      templateFile: 'plop-templates/reducer/test.hbs',
    }],
  });
};
