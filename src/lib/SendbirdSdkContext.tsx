import React from 'react';
import type { SendBirdState } from './types';

type ContextAwareComponentType = {
  (props: any): JSX.Element;
  displayName: string;
};

export const SendbirdSdkContext = React.createContext<SendBirdState | null>(null);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const withSendbirdContext = (OriginalComponent: any, mapStoreToProps: Record<string, any>): ContextAwareComponentType => {
  const ContextAwareComponent = (props) => (
    <SendbirdSdkContext.Consumer>
      {(context) => {
        if (mapStoreToProps && typeof mapStoreToProps !== 'function') {
          // eslint-disable-next-line no-console
          console.warn('Second parameter to withSendbirdContext must be a pure function');
        }
        const mergedProps = (mapStoreToProps && typeof mapStoreToProps === 'function')
          ? { ...mapStoreToProps(context), ...props }
          : { ...context, ...props };
        // eslint-disable-next-line react/jsx-props-no-spreading
        return <OriginalComponent {...mergedProps} />;
      }}
    </SendbirdSdkContext.Consumer>
  );

  const componentName = OriginalComponent.displayName || OriginalComponent.name || 'Component';
  ContextAwareComponent.displayName = `SendbirdAware${componentName}`;

  return ContextAwareComponent;
};

export default withSendbirdContext;
