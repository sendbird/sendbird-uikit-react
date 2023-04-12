# How to define reducers

Reducers are functions that take the current state and an action,
and return a new state. Reducers are pure functions, which means they
should not mutate the state, but return a new state object

In this project we recommend using minimal external dependencies,
so we recommend using built in hooks like useState and useReducer

You can use useState if the component is simple, otherwise you can move to useReducer and move side effects into customHooks

# RULES for this project(April 10 2023)

* Patterns for keeping reducers simple, typesafe, uniform and readable
* Use Plop to generate boilerplate code

```javascript

// intialState.ts
export interface ${Prefix}StateType {
  sdk: SendbirdChat,
  loading: boolean,
}

const initialState: ${Prefix}StateType = {
  loading: false,
  sdk: {} as SendbirdChat,
};

// actionTypes.ts
import { CreateAction } from "./utils/typeHelpers/CreateAction/reducers";

export const ${PREFIX}_ACTIONS = {
  SET_SDK: "SET_SDK",
  SET_LOADING: "SET_LOADING",
} as const;

type ${PREFIX}_PAYLOAD_TYPES = {
  [${PREFIX}_ACTIONS.SET_SDK]: {
    sdk: SendbirdChat,
  },
  [${PREFIX}_ACTIONS.SET_LOADING]: boolean,
};

export type ${Prefix}ActionTypes = CreateAction<PAYLOAD_TYPES>;

// reducer.ts
import { ${Prefix}ActionTypes, ${PREFIX}_ACTIONS } from "./actionTypes";
import { ${Prefix}StateType } from "./initialState";

export const ${prefix}Reducer = (
  state: ${Prefix}StateType,
  action: ${Prefix}ActionTypes,
): ${Prefix}StateType => {
  return  match(action)
    .with({ type: ${PREFIX}_ACTIONS.SET_SDK }, (action) => ({
      ...state,
      sdk: action.payload.sdk,
    }))
    .with({ type: ${PREFIX}_ACTIONS.SET_LOADING }, (action) => ({
      ...state,
      loading: action.payload,
    }))
};

// in component
import { ${prefix}Reducer, initialState } from "./reducer";
import { ${Prefix}ActionTypes, ${PREFIX}_ACTIONS } from "./actionTypes";

const [state, dispatch] = useReducer(${prefix}Reducer, initialState);

```
