import { Component, ErrorInfo, ReactNode } from 'react';
import { LoggerInterface } from '../../lib/Logger';
import { UI_CONTAINER_TYPES } from '../../utils';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackMessage: ReactNode;
  onTemplateMessageRenderedCallback: (renderedTemplateBodyType: UI_CONTAINER_TYPES) => void;
  isComposite?: boolean;
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
      this.props.onTemplateMessageRenderedCallback(UI_CONTAINER_TYPES.DEFAULT);
      return this.props.fallbackMessage;
    }
    this.props.onTemplateMessageRenderedCallback(UI_CONTAINER_TYPES.DEFAULT_CAROUSEL);
    return this.props.children;
  }
}

export default MessageTemplateErrorBoundary;
