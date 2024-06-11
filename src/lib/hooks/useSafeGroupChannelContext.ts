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

// Overload signatures
export function useSafeGroupChannelContext(): GroupChannelContextType | ChannelProviderInterface;
export function useSafeGroupChannelContext<T extends TargetChannelContextTypes[]>(...args: T): ContextReturnType<T>;
// Implementing the function
export function useSafeGroupChannelContext(...args: TargetChannelContextTypes[]) {
  const defaultArgs: TargetChannelContextTypes[] = ['groupChannel', 'channel'];
  const actualArgs = args.length > 0 ? args : defaultArgs;

  let lastError: Error | null = null;

  for (const arg of actualArgs) {
    try {
      return match(arg)
        .with('groupChannel', () => useGroupChannelContext())
        .with('channel', () => useChannelContext())
        .with('thread', () => useThreadContext())
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
