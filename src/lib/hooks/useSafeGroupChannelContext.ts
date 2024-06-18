import { match } from 'ts-pattern';
import { type ChannelProviderInterface, useChannelContext } from '../../modules/Channel/context/ChannelProvider';
import { type GroupChannelContextType, useGroupChannelContext } from '../../modules/GroupChannel/context/GroupChannelProvider';
import { type ThreadProviderInterface, useThreadContext } from '../../modules/Thread/context/ThreadProvider';

type TargetChannelContextTypes = 'channel' | 'groupChannel' | 'thread';
type ContextReturnType<T extends TargetChannelContextTypes[]> =
  T extends [] ? GroupChannelContextType | ChannelProviderInterface :
  T[number] extends 'groupChannel' ? GroupChannelContextType :
  T[number] extends 'channel' ? ChannelProviderInterface :
  T[number] extends 'thread' ? ThreadProviderInterface :
  never;

export function useSafeGroupChannelContext<T extends TargetChannelContextTypes[]>(...args: TargetChannelContextTypes[]): ContextReturnType<T> {
  const defaultArgs: TargetChannelContextTypes[] = ['groupChannel', 'channel'];
  const actualArgs = args.length > 0 ? args : defaultArgs;

  let lastError: Error | null = null;

  for (const arg of actualArgs) {
    try {
      return match(arg)
        .with('groupChannel', () => useGroupChannelContext() as ContextReturnType<T>)
        .with('channel', () => useChannelContext() as ContextReturnType<T>)
        .with('thread', () => useThreadContext() as ContextReturnType<T>)
        .exhaustive(); // Ensure all cases are handled
    } catch (error) {
      lastError = error;
    }
  }

  // If all attempts fail, throw the last encountered error
  if (lastError) {
    throw new Error('No suitable context provider found.');
  }
}
