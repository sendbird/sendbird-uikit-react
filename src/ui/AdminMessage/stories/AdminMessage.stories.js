import React from 'react';
import AdminMessage from '../index.jsx';
const description = `
  \`import Accordion, { AccordionGroup } from "@sendbird/uikit-react/ui/Accordion";\`
  \n A simple Accordion component, Accordion must be placed inside AccordionGroup
`;

export default {
  title: '@sendbird/uikit-react/ui/AdminMessage',
  component: AdminMessage,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};



import dummyAdminMessage from '../adminMessageDummyData.mock';

export const adminMessage = () => <AdminMessage message={dummyAdminMessage} />;
