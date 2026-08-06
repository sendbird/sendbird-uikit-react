import { useConfigParams } from '../utils/paramsBuilder.ts';
import GroupChannelApp from '../../../../src/modules/App';
import { defaultProps } from '../libs/const.ts';

export function GroupChannelPage() {
  const props = useConfigParams(defaultProps);
  // Read URL params directly to avoid double useSearchParams calls
  const urlParams = new URLSearchParams(window.location.search);
  const breakpoint = urlParams.get('breakpoint') === 'true' || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const themeParam = urlParams.get('theme');
  const themeProps = themeParam === 'dark' || themeParam === 'light' ? { theme: themeParam as 'dark' | 'light' } : {};
  // showSearchIcon URL param overrides server-side config (needed when SDK app has it disabled)
  const showSearchIconParam = urlParams.get('showSearchIcon');
  const showSearchIconProps = showSearchIconParam === 'true' ? { showSearchIcon: true as const } : {};
  // replyType URL param passes the deprecated prop directly, bypassing the uikitOptions config chain
  const replyTypeParam = urlParams.get('replyType') as 'THREAD' | 'QUOTE_REPLY' | 'NONE' | null;
  const replyTypeProps = replyTypeParam ? { replyType: replyTypeParam } : {};
  return <GroupChannelApp {...props} {...themeProps} {...showSearchIconProps} {...replyTypeProps} breakpoint={breakpoint} config={{ logLevel: 'all' }} />;
}
