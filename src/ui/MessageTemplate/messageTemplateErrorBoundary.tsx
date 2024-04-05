import { Component, ErrorInfo, ReactNode } from 'react';
import { LoggerInterface } from '../../lib/Logger';
import { RenderedTemplateBodyType } from '../MessageContent/MessageBody';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackMessage: ReactNode;
  onTemplateMessageRenderedCallback: (renderedTemplateBodyType: RenderedTemplateBodyType) => void;
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
      this.props.onTemplateMessageRenderedCallback('failed');
      return this.props.fallbackMessage;
    }
    this.props.onTemplateMessageRenderedCallback(this.props.isComposite ? 'composite' : 'simple');
    return this.props.children;
  }
}

export default MessageTemplateErrorBoundary;
