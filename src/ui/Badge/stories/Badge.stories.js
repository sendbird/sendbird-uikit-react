import React from 'react';
import Badge from '../index.jsx';

export default { title: 'UI Components/Badge' };

export const defaultBadge = () => <Badge count={1} />;
export const wideBadge = () => <Badge count={10} />;
export const overHundredBadge = () => <Badge count={100} />;
