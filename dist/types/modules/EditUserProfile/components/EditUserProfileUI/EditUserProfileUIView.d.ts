import React, { type MutableRefObject, type Dispatch } from 'react';
export interface EditUserProfileUIViewProps {
    formRef: MutableRefObject<any>;
    inputRef: MutableRefObject<any>;
    onThemeChange: (theme: string) => void;
    setProfileImage: Dispatch<File | null>;
}
export declare const EditUserProfileUIView: ({ formRef, inputRef, onThemeChange, setProfileImage, }: EditUserProfileUIViewProps) => React.JSX.Element;
