export interface MockMessageFormItemProps {
  name: string;
  required?: boolean;
  sort_order: number;
  placeholder?: string;
  style: object;
  values?: string[];
  validators?: object[];
}

export interface MockMessageFormProps {
  name?: string;
  items: MockMessageFormItemProps[];
}

export interface FormFixtureProps {
  name: string;
  form: MockMessageFormProps;
}
