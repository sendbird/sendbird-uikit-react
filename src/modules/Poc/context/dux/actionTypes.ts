// import from correct place
import { CreateAction } from "../../../../utils/typeHelpers/reducers/createAction";

export const POC_ACTIONS = {
  INIT_POC: 'INIT_POC',
} as const;

type PAYLOAD_TYPES = {
  [POC_ACTIONS.INIT_POC]: {
    poc: any;
  },
};

export type PocActionTypes = CreateAction<PAYLOAD_TYPES>;
