import { Component, ErrorInfo, ReactNode } from 'react';
import { LoggerInterface } from '../../lib/Logger';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackMessage: ReactNode;
  logger?: LoggerInterface;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class MessageTemplateErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.logger?.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallbackMessage;
    }
    return this.props.children;
  }
}

export default MessageTemplateErrorBoundary;
