import React from 'react';
import Button from '../index.jsx';

import { Type, Size } from '../type';

export default { title: 'UI Components/Button' };

export const defaultButton = () => <Button />;
export const primaryButton = () => <Button type={Type.PRIMARY}>PRIMARY</Button>;
export const secondaryButton = () => <Button type={Type.SECONDARY}>SECONDARY</Button>;
export const dangerButton = () => <Button type={Type.DANGER}>DANGER</Button>;
export const disabledButton = () => <Button type={Type.DISABLED}>DISABLED</Button>;

export const smallPrimaryButton = () => <Button type={Type.PRIMARY} size={Size.SMALL}>PRIMARY</Button>;
export const smallSecondaryButton = () => <Button type={Type.SECONDARY} size={Size.SMALL}>SECONDARY</Button>;
export const smallDangerButton = () => <Button type={Type.DANGER} size={Size.SMALL}>DANGER</Button>;
export const smallDisabledButton = () => <Button type={Type.DISABLED} size={Size.SMALL}>DISABLED</Button>;
