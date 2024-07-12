import { useConfigParams } from '../utils/paramsBuilder.ts';
import GroupChannelApp from '../../../../src/modules/App';
import { defaultProps } from '../libs/const.ts';

export function GroupChannelPage() {
  const props = useConfigParams(defaultProps);
  return <GroupChannelApp
    {...props}
    breakpoint={/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)}
    config={{ logLevel: 'all' }}
    uikitOptions={{
      groupChannel: {
        enableFormTypeMessage: true,
        enableSuggestedReplies: true,
        enableFeedback: true,
      }
    }}
  />;
}
