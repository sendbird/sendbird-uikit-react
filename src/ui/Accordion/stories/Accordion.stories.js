import React from 'react';
import Accordion, { AccordionGroup } from '../index';

const description = `
  \`import Accordion from "@sendbird/uikit-react/ui/Accordion";\`
  \`import AccordionGroup from "@sendbird/uikit-react/ui/AccordionGroup";\`
  \n A simple Accordion component, Accordion must be placed inside AccordionGroup
`;

export default {
  title: '@sendbird/uikit-react/ui/Accordion',
  component: Accordion,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (args) => (
  <AccordionGroup>
    <Accordion
      {...args}
      renderTitle={() => (<div>Simple Accordion</div>)}
      renderContent={() => (<div>Content</div>)}
      renderFooter={() => (<div>Footer</div>)}
    />
  </AccordionGroup>
);

export const multipleAccordions = () => (
  <AccordionGroup>
    <Accordion
      id="a1"
      renderTitle={() => (<div>Header</div>)}
      renderContent={() => (<div>Content</div>)}
      renderFooter={() => (<div>Footer</div>)}
    />
    <Accordion
      id="a2"
      renderTitle={() => (<div>Header</div>)}
      renderContent={() => (<div>Content</div>)}
      renderFooter={() => (<div>Footer</div>)}
    />
  </AccordionGroup>
);

export const AccordionComponent = () => (
  <AccordionGroup>
    <Accordion
      id="a1"
      renderTitle={() => (<div>Header</div>)}
      renderContent={() => (<div>Content</div>)}
      renderFooter={() => (<div>Footer</div>)}
    />
  </AccordionGroup>
);
