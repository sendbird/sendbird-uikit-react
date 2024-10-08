export interface GetMockMessageFormItemProps {
  name: string;
  required?: boolean;
  sortOrder: number;
  placeholder?: string;
  style: object;
  submittedValues?: string[];
  validators?: object[];
}

export interface GetMockMessageFormProps {
  name?: string;
  items: GetMockMessageFormItemProps[];
}

export const getMockMessageForm = (props: GetMockMessageFormProps) => {
  return {
    "id": 75,
    "name": props.name,
    "created_at": 1721366635.670897,
    "updated_at": 1724815262.717879,
    "items": props.items.map((item, index) => {
      return {
        'id': index,
        name: item.name,
        required: item.required,
        'sort_order': item.sortOrder,
        'placeholder': item.placeholder,
        style: item.style,
        validators: item.validators ?? [],
      };
    }),
  };
}
