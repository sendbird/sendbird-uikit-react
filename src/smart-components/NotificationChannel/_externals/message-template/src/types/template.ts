import type { ComponentsUnion } from './components';

export interface Template {
  version: number;
  body: {
    items: ComponentsUnion['properties'][];
  };
}
