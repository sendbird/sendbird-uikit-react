import React from 'react';
import Accordion, { AccordionGroup } from '../index';

export default { title: 'UI Components/Accordion' };

export const sampleAccordion = () => (
  <AccordionGroup>
    <Accordion
      id="a1"
      renderTitle={() => (<div>Header</div>)}
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
