import React from 'react';
// import { SendBirdState } from './SendbirdState';

type ContextAwareComponentType = {
  (props: any): JSX.Element;
  displayName: string;
};

/**
 * TODO
 *  1. Add type to the SendbirdSdkContext
 *  2. Migrate the interface names and file strctures of each module
*/
// export const SendbirdSdkContext = React.createContext<SendBirdState>({});
export const SendbirdSdkContext = React.createContext({});

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
