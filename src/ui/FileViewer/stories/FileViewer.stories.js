import React from 'react';
import FileViewer from '../index.jsx';

export default { title: 'UI Components/FileViewer' };

import { msg1, msg0 } from '../data.mock';

export const imageViewer = () => (
  <FileViewer
    onClose={() => {}}
    onDelete={() => {}}
    message={msg0}
  />
);
export const movieViewer = () => (
  <FileViewer
    onClose={() => {}}
    onDelete={() => {}}
    message={msg1}
  />
);
export const unSupportedViewer = () => (
  <FileViewer
    onClose={() => {}}
    onDelete={() => {}}
    message={{ sender: {} }}
  />
);
