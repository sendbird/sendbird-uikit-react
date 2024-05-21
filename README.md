# @sendbird/uikit-react

[![Platform React](https://img.shields.io/badge/Platform-React-orange.svg)](https://reactjs.org)
[![Language TypeScript](https://img.shields.io/badge/Language-TypeScript-orange.svg)](https://www.typescriptlang.org/)

> React based UI kit based on sendbird javascript SDK

We are introducing a new version of the Sendbird Chat UIKit. Version 3 features a new modular architecture with more granular components that give you enhanced flexibility to customize your web and mobile apps. Check out our [migration guides](MIGRATION_v2-to-v3.md).

## Installation

`yarn add @sendbird/uikit-react`
or if you're using npm
`npm i @sendbird/uikit-react`

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
* [nodejs](https://nodejs.org/en/download/) 18>=
* npm 9>= or yarn 3>=


## Development
 
We use vite app for development and rollup for building the npm distribution(bundled JS file)
Make sure you have nodejs and yarn installed and run

> Make a copy of `apps/testing/.env.example` and save it as `apps/testing/.env` 
> Set your appId to `VITE_APP_ID`

```shell
yarn install
yarn dev
```

* By default, vite app opens in http://localhost:5173/
* Please refer to the following link for more details: [Link](apps/testing/README.md)

### Storybook

We provide a Storybook to easily view and understand the components.
<br/>https://sendbird.github.io/sendbird-uikit-react/

```shell
yarn storybook
```

### Build

We use RollupJS for building the production bundle script that you want to use inside your applications.

We have both `ESM` and `CJS` output

```
yarn build
```

The bundled JS code can be found in `./dist`
The CSS is in `./dist/dist/index.css`

**Caveats**
 - We tried development on Mac OS / Linux systems. You might encounter problems in running `yarn build`  in Windows machines

### Tests

We have implemented tests for dumb ui components only. Technologies used: Jest and testing-library

```
yarn test
```

### Lint

```
yarn lint
```

### Creating/Exporting New Components

1. Define your component inside `./src`.
2. Add the following line to `./rollup.module-exports.js`:
    ```
    'NewComponent/SubComponent': 'location/of/NewComponent/SubComponent',
    ```
    - This component can be imported by the consumer as: `import SubComponent from '@sendbird/uikit-react/NewComponent/SubComponent';`

### Scaffolding New Components

1. Use `yarn run generate-component` to generate a UI component in `src/ui`. It uses [Plop.js](https://plopjs.com/) to generate the component.
2. It can also be used to generate [reducers](/src/utils/typeHelpers/reducers/README.md).
3. Plop templates are found in [here](/plop-templates).

## Acknowledgments
### LameJS

We use lamejs for converting audio formats
It is a fast mp3 encoder written in JavaScript. The original repo is:
* https://lame.sourceforge.net or
* https://github.com/zhuker/lamejs
