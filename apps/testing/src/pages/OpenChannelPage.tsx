import { useConfigParams } from '../utils/paramsBuilder.ts';
import OpenChannelApp from '../../../../src/modules/OpenChannelApp';
import { defaultProps } from '../libs/const.ts';

export function OpenChannelPage() {
  const props = useConfigParams(defaultProps);
  return <OpenChannelApp {...props} />;
}
