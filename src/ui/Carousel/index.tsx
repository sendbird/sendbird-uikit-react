import './index.scss';
import React, { ReactElement, useEffect, useRef, useState } from 'react';

const PADDING_WIDTH = 24;
const CONTENT_LEFT_WIDTH = 40;
const SWIPE_THRESHOLD = 15;
const LAST_ITEM_RIGHT_SNAP_THRESHOLD = 100;

interface ItemPosition {
  start: number;
  end: number;
}

interface CarouselItemProps {
  key: string;
  item: ReactElement;
  defaultWidth: string;
}

/**
 * fixed sized template items should use its child width.
 * Whereas flex sized template items should use its parent's width.
 * @param item
 */
function shouldRenderAsFixed(item: ReactElement) {
  return item.props.templateItems[0].width?.type === 'fixed';
}

function CarouselItem({
  item,
  defaultWidth,
}: CarouselItemProps): ReactElement {
  return <div style={shouldRenderAsFixed(item) ? { width: 'fit-content' } : { minWidth: defaultWidth }}>
    {item}
  </div>;
}

interface CarouselProps {
  id: string;
  items: ReactElement[];
  gap?: number;
}

interface Position {
  x: number;
  y: number;
}

interface DraggingInfo {
  scrolling: boolean;
  dragging: boolean;
  startPos: Position | null;
  offset: number;
  translateX: number;
  currentIndex: number;
}

export const Carousel = React.memo(({
  id,
  items,
  gap = 8,
}: CarouselProps): ReactElement => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const screenWidth = window.innerWidth;
  const defaultItemWidth = carouselRef.current?.clientWidth ?? 0;
  const itemWidths = items.map((item) => {
    if (shouldRenderAsFixed(item)) {
      return item.props.templateItems[0].width?.value;
    }
    return defaultItemWidth;
  });
  const allItemsWidth = itemWidths.reduce((prev, curr) => prev + gap + curr);
  const lastItemWidth = itemWidths[itemWidths.length - 1];
  const isLastItemNarrow = lastItemWidth <= LAST_ITEM_RIGHT_SNAP_THRESHOLD;
  const isLastTwoItemsFitScreen = getIsLastTwoItemsFitScreen();
  const itemPositions: ItemPosition[] = getEachItemPositions();
  const [draggingInfo, setDraggingInfo] = useState<DraggingInfo>({
    scrolling: false,
    dragging: false,
    startPos: null,
    offset: 0,
    translateX: 0,
    currentIndex: 0,
  });

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setDraggingInfo({
      ...draggingInfo,
      scrolling: false,
      dragging: true,
      startPos: {
        x: event.clientX,
        y: event.clientY,
      },
      offset: 0,
    });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingInfo.dragging || !draggingInfo.startPos) return;
    const currentX = event.clientX;
    const newOffset = currentX - draggingInfo.startPos.x;
    setDraggingInfo({
      ...draggingInfo,
      offset: newOffset,
    });
  };

  const handleMouseUp = () => {
    if (!draggingInfo.dragging) return;
    handleDragEnd();
  };

  const blockScroll = () => {
    if (carouselRef.current) {
      carouselRef.current.style.touchAction = 'pan-x';
    }
  };

  const unblockScroll = () => {
    if (carouselRef.current) {
      carouselRef.current.style.touchAction = 'pan-y';
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setDraggingInfo({
      ...draggingInfo,
      scrolling: false,
      dragging: false,
      startPos: {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      },
      offset: 0,
    });
  };

  useEffect(() => {
    if (draggingInfo.scrolling) {
      unblockScroll();
    }

  }, [draggingInfo.scrolling]);

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!draggingInfo.startPos || draggingInfo.scrolling) return;

    const startPos = draggingInfo.startPos;
    const touchMoveX = event.touches[0].clientX;
    const touchMoveY = event.touches[0].clientY;
    const deltaX = Math.abs(touchMoveX - startPos.x);
    const deltaY = Math.abs(touchMoveY - startPos.y);
    const newOffset = touchMoveX - startPos.x;

    if (newOffset === draggingInfo.offset) return;
    if (draggingInfo.dragging) {
      setDraggingInfo({
        ...draggingInfo,
        offset: newOffset,
      });
      return;
    }
    if (deltaY > deltaX) {
      setDraggingInfo({
        ...draggingInfo,
        scrolling: true,
      });
    } else {
      blockScroll();
      setDraggingInfo({
        ...draggingInfo,
        dragging: true,
        offset: newOffset,
      });
    }
  };

  const getNewDraggingInfo = (props: { newTranslateX?: number, nextIndex?: number } = {}): DraggingInfo => {
    const { newTranslateX, nextIndex } = props;
    const { translateX, currentIndex } = draggingInfo;
    return {
      scrolling: false,
      dragging: false,
      startPos: null,
      offset: 0,
      translateX: newTranslateX ?? translateX,
      currentIndex: nextIndex ?? currentIndex,
    };
  };

  const handleDragEnd = () => {
    const offset = draggingInfo.offset;
    const absOffset = Math.abs(offset);
    if (absOffset < SWIPE_THRESHOLD) {
      setDraggingInfo(getNewDraggingInfo());
      return;
    }
    // If dragged to left, next index should be to the right
    const currentIndex = draggingInfo.currentIndex;
    if (offset < 0 && currentIndex < items.length - 1) {
      const nextIndex = currentIndex + 1;
      setDraggingInfo(getNewDraggingInfo({
        newTranslateX: itemPositions[nextIndex].start,
        nextIndex,
      }));
      // If dragged to right, next index should be to the left
    } else if (offset > 0 && currentIndex > 0) {
      const nextIndex = currentIndex - 1;
      setDraggingInfo(getNewDraggingInfo({
        newTranslateX: itemPositions[nextIndex].start,
        nextIndex,
      }));
    } else {
      setDraggingInfo(getNewDraggingInfo());
    }
  };
  const handleTouchEnd = () => {
    const { offset, currentIndex } = draggingInfo;
    const absOffset = Math.abs(offset);
    if (absOffset < SWIPE_THRESHOLD) {
      setDraggingInfo(getNewDraggingInfo());
      return;
    }
    // If dragged to left, next index should be to the right
    if (offset < 0 && currentIndex < items.length - 1) {
      const nextIndex = currentIndex + 1;
      /**
       * This is special logic for "더 보기" button for Socar use-case.
       * The button will have a small width (less than 50px).
       * We want to include this button in the view and snap to right padding wall IFF !isLastTwoItemsFitScreen.
       */
      if (isLastItemNarrow) {
        if (isLastTwoItemsFitScreen) {
          if (nextIndex !== items.length - 1) {
            setDraggingInfo(getNewDraggingInfo({
              newTranslateX: itemPositions[nextIndex].start,
              nextIndex,
            }));
          } else {
            setDraggingInfo(getNewDraggingInfo());
          }
        } else if (nextIndex !== items.length - 1) {
          setDraggingInfo(getNewDraggingInfo({
            newTranslateX: itemPositions[nextIndex].start,
            nextIndex,
          }));
        } else {
          const translateWidth = itemPositions[nextIndex].start - lastItemWidth;
          const rightEmptyWidth = screenWidth - (allItemsWidth + translateWidth + PADDING_WIDTH + CONTENT_LEFT_WIDTH);
          setDraggingInfo(getNewDraggingInfo({
            newTranslateX: translateWidth + rightEmptyWidth,
            nextIndex,
          }));
        }
      } else {
        setDraggingInfo(getNewDraggingInfo({
          newTranslateX: itemPositions[nextIndex].start,
          nextIndex,
        }));
      }
      // If dragged to right, next index should be to the left
    } else if (offset > 0 && currentIndex > 0) {
      const nextIndex = currentIndex - 1;
      setDraggingInfo(getNewDraggingInfo({
        newTranslateX: itemPositions[nextIndex].start,
        nextIndex,
      }));
    } else {
      setDraggingInfo(getNewDraggingInfo());
    }
    if (draggingInfo.dragging) {
      unblockScroll();
    }
  };

  function getCurrentTranslateX() {
    return draggingInfo.translateX + draggingInfo.offset;
  }

  function getIsLastTwoItemsFitScreen() {
    const restItemsWidth = itemWidths.slice(-2).reduce((prev, curr) => prev + gap + curr);
    const restTotalWidth = PADDING_WIDTH + CONTENT_LEFT_WIDTH + restItemsWidth;
    return restTotalWidth <= screenWidth;
  }

  function getEachItemPositions(): ItemPosition[] {
    let accumulator = 0;
    return itemWidths.map((itemWidth, i): ItemPosition => {
      if (i > 0) {
        accumulator -= gap;
      }
      const itemPosition = {
        start: accumulator,
        end: accumulator - itemWidth,
      };
      accumulator -= itemWidth;
      return itemPosition;
    });
  }

  return (
    <div
      id={id}
      ref={carouselRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className='sendbird-carousel-items-wrapper'
      style={{
        touchAction: 'pan-y',
        cursor: draggingInfo.dragging ? 'grabbing' : 'grab',
        transition: draggingInfo.dragging ? 'none' : 'transform 0.5s ease',
        transform: `translateX(${getCurrentTranslateX()}px)`,
        gap: gap,
      }}
    >
      {items.map((item, index) => (
        <CarouselItem key={`${id}-${index}`} item={item} defaultWidth={defaultItemWidth + 'px'}/>
      ))}
    </div>
  );
});

export default Carousel;
