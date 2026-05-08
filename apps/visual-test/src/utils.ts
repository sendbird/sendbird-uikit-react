import { MockMessageFormProps } from '../../../__visual_tests__/__fixtures__/form/interface.ts';

export const getMockMessageForm = (props: MockMessageFormProps) => {
  const isSubmitted = props.items.some((item) => item.values);

  return {
    id: 75,
    name: props.name ?? '',
    messageId: 7619141941,
    version: 1,
    isSubmitted,
    isSubmittable: !isSubmitted,
    createdAt: 1721366635.670897,
    updatedAt: 1724815262.717879,
    items: props.items.map((item, index) => {
      const style = item.style as {
        default_options?: string[];
        defaultOptions?: string[];
        result_count?: object;
        resultCount?: object;
      };

      return {
        id: index,
        name: item.name,
        required: item.required,
        sortOrder: item.sort_order,
        placeholder: item.placeholder,
        style: {
          ...style,
          defaultOptions: style.defaultOptions ?? style.default_options,
          resultCount: style.resultCount ?? style.result_count,
        },
        validators: item.validators ?? [],
        submittedValues: item.values,
      };
    }),
  };
};
