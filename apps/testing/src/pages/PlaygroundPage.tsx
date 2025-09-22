import { useConfigParams } from '../utils/paramsBuilder.ts';
import GroupChannelApp from '../../../../src/modules/App';
import { defaultProps } from '../libs/const.ts';

export function PlaygroundPage() {
  const props = useConfigParams(defaultProps);
  return <GroupChannelApp {...props} breakpoint={/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)} config={{ logLevel: 'all' }}
  uikitOptions={{
    groupChannel: {
      replyType: 'thread',
    },
    
  }}
  />;
}
