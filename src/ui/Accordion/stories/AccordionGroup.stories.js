import { AccordionGroup } from '../index';

const description = `
  \`import AccordionGroup from "@sendbird/uikit-react/ui/AccordionGroup";\`
  \n Parent of Accordion component, Accordion must be placed inside AccordionGroup
`;

export default {
  title: '@sendbird/uikit-react/ui/AccordionGroup',
  component: AccordionGroup,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControls = (args) => <AccordionGroup {...args} />;
