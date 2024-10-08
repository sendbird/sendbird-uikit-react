export const formSingleFixture = [
  {
    name: '100',
    form: {
      name: 'All Required Fields 5 (Short answer+Paragraph+Phone number+Email+Single selector)',
      items: [
        {
          name: '[Field label] Data type: Short answer',
          required: true,
          sort_order: 0,
          placeholder: 'Please enter short answer.😀 (required)',
          style: {
            layout: 'text',
          },
          validators: [],
        },
        {
          name: '[Field label] Data type: Paragraph',
          required: true,
          sort_order: 1,
          placeholder: 'Please enter Paragraph.😀 (required)',
          style: {
            layout: 'textarea',
          },
          validators: [],
        },
        {
          name: '[Field label] Data type: Phone number',
          required: true,
          sort_order: 2,
          placeholder: 'Please enter Phone number.😀 (required)',
          style: {
            layout: 'phone',
          },
          validators: [
            {
              key: 'regex',
              regex: '^[+]?[0-9]+(-[0-9]+)*$',
            },
          ],
        },
        {
          name: '[Field label] Data type: Email',
          required: true,
          sort_order: 3,
          placeholder: 'Please enter Email.😀 (required)',
          style: {
            layout: 'email',
          },
          validators: [
            {
              key: 'regex',
              regex: '^[^<>()\\[\\]\\/\\.,;:\\s@][^<>()\\[\\]\\/,;:\\s@]*@([a-zA-Z-0-9]+\\.)+[a-zA-Z]{2,}$',
            },
          ],
        },
        {
          name: '[Field label] Data type: Single selector',
          required: true,
          sort_order: 4,
          placeholder: '',
          style: {
            layout: 'chip',
            options: [
              'Please select option 1.😀 (required)',
              'Please select option 2.😀 (required)',
              'Please select option 3.😀 (required)',
              'Please select option 4.😀 (required)',
              'Please select option 5.😀 (required)',
              'Please select option 6.😀 (required)',
            ],
            resultCount: {
              min: 1,
              max: 1,
            },
          },
          validators: [
            {
              key: 'regex',
              regex: '^[^<>()\\[\\]\\/\\.,;:\\s@][^<>()\\[\\]\\/,;:\\s@]*@([a-zA-Z-0-9]+\\.)+[a-zA-Z]{2,}$',
            },
          ],
        },
      ],
    },
  },
];
