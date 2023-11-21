# sendbird-uikit

[![Platform React](https://img.shields.io/badge/Platform-React-orange.svg)](https://reactjs.org)
[![Language TypeScript](https://img.shields.io/badge/Language-TypeScript-orange.svg)](https://www.typescriptlang.org/)

> React based UI kit based on sendbird javascript SDK

We are introducing a new version of the Sendbird Chat UIKit. Version 3 features a new modular architecture with more granular components that give you enhanced flexibility to customize your web and mobile apps. Check out our [migration guides](MIGRATION_v2-to-v3.md).

## Installation

`npm i @sendbird/uikit-react`
or if you're using yarn
`yarn add @sendbird/uikit-react`

## Getting Started

With Sendbird UI Kit React, we export these components:
(See `src/index.jsx`)

* SendBirdProvider - The context provider for SDK component
* useSendbirdStateContext - Hook to access SendBirdProvider context
* sendBirdSelectors - A bunch of useful selectors that can be used along with *useSendbirdStateContext*

* Channel - A UI Component where conversations happen
* ChannelList - A ChannelList UI component
* ChannelSettings - A component to handle the settings of a given channel
* MessageSearch - To search for a message from a Channel
* OpenChannel - A UI Component where open channel conversations happen
* OpenChannelSettings - A component to handle the settings of a given channel
And many more...

* App - is a full fledged app(group channel) component made by combining the above components so that you dont have to combine all the above components by hand. Also it can be used as an example for composing components to build a chat UI

> Note 1: Dont forget to import the stylesheet from the repo too
> Note 2: Name of some components are different from the directories they are in(example -> Channel component is from Conversation component). Please keep that in mind

### Prerequisites

You need to install:
* nodejs 16 LTS https://nodejs.org/en/download/
* npm 8 >= or yarn

**Caveats**
 - We tried development on Mac OS / Linux systems. You might encounter problems in running `npm run build` or `yarn run build` in Windows machines

### Development
We use storybook for development and rollup for building the npm distribution(bundled JS file)
Make sure you have nodejs and npm (or yarn) installed and run

> Make a copy of .env.example and save it as .env 
> Set your appId STORYBOOK_APP_ID

```
npm install
npm run storybook
```
or
```
yarn install
yarn storybook
```

* By default, storybook opens in http://localhost:6006/
* Smart Components such as ChannelList, Channel, ChannelSetting, App can be found under `OTHERS`
* Dumb components such as inputs, buttons etc can be found under `OTHERS/UI Components` in storybook sidebar
* Overridden storybook configs can be found in: `./storybook`

> If you face the error during running storybook<br />
> `Error: error: 0308010C:digital envelope rountines::unsupported` <br />
> try to run below in termial, and run storybook again
```
export NODE_OPTIONS=--openssl-legacy-provider
```

### Husky

We use Husky for githooks

To enable Husky in local, run:
`yarn husky install` or `npx husky install`

### Build

We use rollupJS for building the production bundle script that you want to use inside your applications.

We have both esm and commonjs output

```
npm run build
```
or
```
yarn run build
```

The bundled JS code can be found in `./release`
The CSS is in `./release/dist/index.css`

## Running the tests

We have implemented tests for dumb ui components only. Technologies used: Jest and testing-library

```
npm run test
```
or
```
yarn run test
```

### Lint

```
npm run lint
```
or
```
yarn run lint
```
* .eslintrc.json lints ts files and .eslintrc.js lints js files

### Webpack 5

Webpack 5 removes stream and buffer componets from default polyfill
To enable these, install buffer and stream and then add the following to webpack.cofig.js
```javascript
module.exports = {
  //...
  resolve: {
    fallback: {
      buffer: require.resolve('buffer'),
      stream: require.resolve('stream-browserify'),
    },
  },
};

```
To read more: https://webpack.js.org/configuration/resolve/#resolvefallback

### Creating/Exporting New Components

1. Define your component inside `./src`.
2. ~~Add the following line to `./src/index.ts`:~~
    ```
    export { default as NewComponent } from './src/location/of/NewComponent';
    ```
    - Will be imported as: `import { NewComponent } from '@sendbird/uikit-react';`
    - We don't do this anymore for new components; we prefer fine-grained exports (as in step 3).
3. Add the following line to `./rollup.module-exports.js`:
    ```
    'NewComponent/SubComponent': 'location/of/NewComponent/SubComponent',
    ```
    - This component can be imported by the consumer as: `import SubComponent from '@sendbird/uikit-react/NewComponent/SubComponent';`

### Scaffolding New Components

1. Use `yarn run generate-component` to generate a UI component in `src/ui`. It uses [Plop.js](https://plopjs.com/) to generate the component.
2. It can also be used to generate [reducers](/src/utils/typeHelpers/reducers/README.md).
3. Plop templates are found in [here](/plop-templates).

## Troubleshooting Guide
- If you use node.js >= 17 and see `ERR_OSSL_EVP_UNSUPPORTED` error on any run cmd, try to run `yarn storybook:stable` instead.


## Acknowledgments
### LameJS

We use lamejs for converting audio formats
It is a fast mp3 encoder written in JavaScript. The original repo is:
* https://lame.sourceforge.net or
* https://github.com/zhuker/lamejs
