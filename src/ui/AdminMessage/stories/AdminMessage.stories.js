import React from 'react';
import AdminMessage from '../index.jsx';

import dummyAdminMessage from '../adminMessageDummyData.mock';

export default { title: 'UI Components/AdminMessage' };

export const adminMessage = () => <AdminMessage message={dummyAdminMessage} />;
