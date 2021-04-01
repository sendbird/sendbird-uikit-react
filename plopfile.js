module.exports = function (plop) {
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
      templateFile: 'plop-templates/tsx.hbs',
    }, {
      // add scss
      type: 'add',
      path: 'src/ui/{{name}}/index.scss',
      templateFile: 'plop-templates/scss.hbs',
    }, {
      // add test
      type: 'add',
      path: 'src/ui/{{name}}/__tests__/{{name}}.spec.js',
      templateFile: 'plop-templates/test.hbs',
    }, {
      // add story
      type: 'add',
      path: 'src/ui/{{name}}/stories/{{name}}.stories.js',
      templateFile: 'plop-templates/stories.hbs',
    }],
  });
};
