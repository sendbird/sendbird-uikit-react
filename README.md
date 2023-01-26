# sendbird-uikit

[![Platform React](https://img.shields.io/badge/Platform-React-orange.svg)](https://reactjs.org)
[![Language TypeScript](https://img.shields.io/badge/Language-TypeScript-orange.svg)](https://www.typescriptlang.org/)

> React based UI kit based on sendbird javascript SDK

We are introducing a new version of the Sendbird Chat UIKit. Version 3 features a new modular architecture with more granular components that give you enhanced flexibility to customize your web and mobile apps. Check out our [migration guides](MIGRATION_v2-to-v3.md).

## Installation

`npm i @sendbird/uikit-react`

For typescript projects, add `node_modules/@sendbird/uikit-react/index.d.ts` to your `include` section in tsconfig file to get type definitions

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
* npm 8 or above

We tried development on Mac OS / Linux systems. You might encounter problems in running `npm run build` in Windows machines

### Development

We use storybook for development and rollup for building the npm distribution(bundled JS file)
Make sure you have nodejs and npm installed and run

```
Make a copy of .env.example and save it as .env
Set your appId STORYBOOK_APP_ID
npm install
npm run storybook
```
> `npm run generate-component` generates a UI component skeleton in `src/ui`

* By default, storybook opens in http://localhost:6006/
* Smart Components such as ChannelList, Channel, ChannelSetting, App can be found under `OTHERS`
* Dumb components such as inputs, buttons etc can be found under `OTHERS/UI Components` in storybook sidebar
* Overridden storybook configs can be found in: `./storybook`

### Build

We use rollupJS for building the production bundle script that you want to use inside your applications.

We have both esm and commonjs output

```
npm run build
```

The bundled JS code can be found in `./release`
The CSS is in `./release/dist/index.css`

## Running the tests

We have implemented tests for dumb ui components only. Technologies used: Jest and testing-library

```
npm run test
```

### Lint

```
npm run lint
```
* .eslintrc.json lints ts files and .eslintrc.js lints js files


### Typescript

* We are trying to progressively move our source code to typescript - which means older JS code and newly written TS code will coxist while we migrate older JS code to TS
* .eslintrc.json lints ts files and .eslintrc.js lints js files
* Type definition file can be `src/index.d.ts` which will be copied to `/release` directory

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

### Creating/exporting new components

1. Define your component inside './src'
2. Add the following line to './src/index.js'
  `export NewComponent from './src/location/of/NewComponent';`
3. Add the following line to './exports.js'
  `NewComponent: 'src/location/of/NewComponent',`
