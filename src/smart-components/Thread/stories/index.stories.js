import Thread from '../index';
import Sendbird from '../../../lib/Sendbird';

import { fitPageSize } from "../../OpenChannelApp/stories/utils";

export default { title: 'Thread' };

export const Thread = () => fitPageSize(
  <Sendbird
  >
    <Thread />
  </Sendbird>
);
