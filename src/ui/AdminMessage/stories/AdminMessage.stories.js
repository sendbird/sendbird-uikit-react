import React from 'react';
import AdminMessage from '../index.jsx';
import dummyAdminMessage from '../adminMessageDummyData.mock';

const description = `
  \`import AdminMessage from "@sendbird/uikit-react/ui/AdminMessage";\`
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

export const WithControl = (arg) => (<AdminMessage message={dummyAdminMessage} {...arg} />);

export const adminMessage = () => <AdminMessage message={dummyAdminMessage} />;
