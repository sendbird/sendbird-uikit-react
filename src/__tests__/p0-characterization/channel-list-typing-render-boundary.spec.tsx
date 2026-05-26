/**
 * Phase 0 characterization — scenario 6: channel-list typing update render
 * boundary.
 *
 * When `typingChannelUrls` in the GroupChannelList store updates (a channel
 * starts/stops typing), today's whole-context subscription causes every
 * `useGroupChannelListStore` consumer to re-render — even the channel-list
 * header or "create channel" button that don't read typing data. Phase 1's
 * `useStoreSelector` should narrow this so only the affected channel's
 * preview / typing indicator re-renders.
 *
 * Captured baseline: delta === 1 for every consumer (whole-context fan-out).
 *
 * This spec uses a separate `listStoreHarness` because GroupChannelList has
 * its own `GroupChannelListContext` distinct from GroupChannelContext.
 */
import * as React from 'react';
import { render, act } from '@testing-library/react';
import {
  createCharacterizationListStore,
  createListWrapper,
  mockListChannel,
} from '../../utils/test/p0/characterization/listStoreHarness';
import { useGroupChannelListStore } from '../../modules/GroupChannelList/context/GroupChannelListProvider';
import { createRenderCounter, useRenderCountTracker } from '../../utils/test/p0/renderCounter';

describe('Phase 0 — channel-list typing render boundary (scenario 6)', () => {
  it('typingChannelUrls update re-renders every list consumer (baseline)', () => {
    const counter = createRenderCounter();
    const ch1 = mockListChannel({ url: 'list-channel-1' });
    const ch2 = mockListChannel({ url: 'list-channel-2' });
    const store = createCharacterizationListStore({
      groupChannels: [ch1, ch2],
      typingChannelUrls: [],
    });
    const wrapper = createListWrapper(store);

    const TypingIndicatorForCh1: React.FC = () => {
      const { state } = useGroupChannelListStore();
      useRenderCountTracker('TypingIndicatorForCh1', counter);
      const isTyping = state.typingChannelUrls.includes('list-channel-1');
      return <span data-testid="ti1">{isTyping ? 'typing' : '-'}</span>;
    };
    const ChannelPreviewForCh2: React.FC = () => {
      // Does NOT read typingChannelUrls — yet today's whole-context
      // subscription re-renders it too. Phase 1 RV must reduce to 0.
      const { state } = useGroupChannelListStore();
      useRenderCountTracker('ChannelPreviewForCh2', counter);
      const ch = state.groupChannels.find((c: any) => c.url === 'list-channel-2');
      return <span data-testid="ch2">{ch?.name}</span>;
    };
    const CreateChannelButton: React.FC = () => {
      const { state } = useGroupChannelListStore();
      useRenderCountTracker('CreateChannelButton', counter);
      return <span data-testid="cc">{state.allowProfileEdit ? 'edit' : 'view'}</span>;
    };

    render(React.createElement(wrapper, null, (
      <>
        <TypingIndicatorForCh1 />
        <ChannelPreviewForCh2 />
        <CreateChannelButton />
      </>
    )));
    const afterMount = counter.snapshot();

    act(() => {
      store.setState((prev) => ({
        ...prev,
        typingChannelUrls: [...prev.typingChannelUrls, 'list-channel-1'],
      }));
    });

    const delta = counter.deltaSince(afterMount);
    // Baseline: every consumer re-renders once. Phase 1 RV target:
    //   delta('TypingIndicatorForCh1') === 1  (this one legitimately changes)
    //   delta('ChannelPreviewForCh2') === 0   (unrelated, narrow selector)
    //   delta('CreateChannelButton') === 0    (unrelated, narrow selector)
    expect(delta('TypingIndicatorForCh1')).toBe(1);
    expect(delta('ChannelPreviewForCh2')).toBe(1);
    expect(delta('CreateChannelButton')).toBe(1);
  });

  it('typingChannelUrls value updates as expected via setState (sanity)', () => {
    const store = createCharacterizationListStore({ typingChannelUrls: [] });
    const wrapper = createListWrapper(store);

    const Probe: React.FC = () => {
      const { state } = useGroupChannelListStore();
      return <span data-testid="t">{state.typingChannelUrls.join(',')}</span>;
    };
    const { getByTestId } = render(React.createElement(wrapper, null, <Probe />));
    expect(getByTestId('t').textContent).toBe('');

    act(() => {
      store.setState((prev) => ({
        ...prev,
        typingChannelUrls: ['list-channel-1', 'list-channel-3'],
      }));
    });
    expect(getByTestId('t').textContent).toBe('list-channel-1,list-channel-3');
  });
});
