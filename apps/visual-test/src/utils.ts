import { MockMessageFormProps } from '../../../__visual_tests__/__fixtures__/form/interface.ts';

export const getMockMessageForm = (props: MockMessageFormProps) => {
  return {
    "id": 75,
    "name": props.name,
    "created_at": 1721366635.670897,
    "updated_at": 1724815262.717879,
    "items": props.items.map((item, index) => {
      return {
        id: index,
        name: item.name,
        required: item.required,
        sort_order: item.sort_order,
        placeholder: item.placeholder,
        style: item.style,
        validators: item.validators ?? [],
        values: item.values,
      };
    }),
  };
}
