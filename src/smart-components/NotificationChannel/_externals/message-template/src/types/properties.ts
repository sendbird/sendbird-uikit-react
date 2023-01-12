export enum ActionType {
  Web = 'web',
  Custom = 'custom',
  UIKit = 'uikit',
}

export interface Action {
  type: ActionType;
  data: string;
  customData?: string;
}
