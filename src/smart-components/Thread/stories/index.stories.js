import Thread from '../index';
import Sendbird from '../../../lib/Sendbird';

import { fitPageSize } from "../../OpenChannelApp/stories/utils";

export default { title: 'Thread' };

export const ThreadComponent = () => fitPageSize(
  <Sendbird
  >
    <Thread />
  </Sendbird>
);
