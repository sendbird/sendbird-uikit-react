import './index.scss';
import React, { ReactElement, useRef, useState } from 'react';

const PADDING_WIDTH = 24;
const CONTENT_LEFT_WIDTH = 40;
const SWIPE_THRESHOLD = 30;
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

function shouldRenderAsFixed(item: ReactElement) {
  return item.props.templateItems[0].width?.type === 'fixed';
}

function CarouselItem({
  key,
  item,
  defaultWidth,
}: CarouselItemProps): ReactElement {
  return <div key={key} style={shouldRenderAsFixed(item) ? { width: 'fit-content' } : { minWidth: defaultWidth }}>
    {item}
  </div>;
}

interface CarouselProps {
  id: string;
  items: ReactElement[];
  gap?: number;
}

export function Carousel({
  id,
  items,
  gap = 8,
}: CarouselProps): ReactElement {
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragging, setDragging] = useState<'vertical' | 'horizontal' | null>(null);
  const [startX, setStartX] = useState(0);
  const [offset, setOffset] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging('horizontal');
    setStartX(event.clientX);
  };

  // Belows are for web
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const currentX = event.clientX;
    const newOffset = currentX - startX;
    setOffset(newOffset);
  };

  const handleMouseUp = () => {
    if (!dragging) return;
    setDragging(null);
    handleDragEnd();
  };

  // Belows are for mobile
  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setStartX(event.touches[0].clientX);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!startX) return;
    const touchMoveX = event.touches[0].clientX;
    const deltaX = Math.abs(touchMoveX - startX);
    const deltaY = Math.abs(event.touches[0].clientY - event.touches[event.touches.length - 1].clientY);
    const threshold = 5;

    if (dragging === 'horizontal' || (dragging !== 'vertical' && deltaX > deltaY + threshold)) {
      const parentElement = document.getElementsByClassName('sendbird-conversation__messages-padding');
      (parentElement[0] as HTMLElement).style.overflowY = 'hidden';
      setDragging('horizontal');
    } else {
      setDragging('vertical');
      return;
    }
    const newOffset = event.touches[0].clientX - startX;
    setOffset(newOffset);
  };

  const handleTouchEnd = () => {
    if (dragging !== 'horizontal') return;
    setDragging(null);
    handleDragEnd();
  };

  const handleDragEnd = () => {
    const absOffset = Math.abs(offset);
    if (absOffset >= SWIPE_THRESHOLD) {
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
              setTranslateX(itemPositions[nextIndex].start);
              setCurrentIndex(nextIndex);
            }
          } else if (nextIndex !== items.length - 1) {
            setTranslateX(itemPositions[nextIndex].start);
            setCurrentIndex(nextIndex);
          } else {
            const translateWidth = itemPositions[nextIndex].start - lastItemWidth;
            const rightEmptyWidth = screenWidth - (allItemsWidth + translateWidth + PADDING_WIDTH + CONTENT_LEFT_WIDTH);
            setTranslateX(translateWidth + rightEmptyWidth);
            setCurrentIndex(nextIndex);
          }
        } else {
          setTranslateX(itemPositions[nextIndex].start);
          setCurrentIndex(nextIndex);
        }
      // If dragged to right, next index should be to the left
      } else if (offset > 0 && currentIndex > 0) {
        const nextIndex = currentIndex - 1;
        setTranslateX(itemPositions[nextIndex].start);
        setCurrentIndex(nextIndex);
      }
    }
    setOffset(0);
    const parentElement = document.getElementsByClassName('sendbird-conversation__messages-padding');
    (parentElement[0] as HTMLElement).style.overflowY = 'scroll';
  };

  function getCurrentTranslateX() {
    return translateX + offset;
  }

  function getIsLastTwoItemsFitScreen() {
    const restItemsWidth = itemWidths.slice(-2).reduce((prev, curr) => prev + gap + curr);
    const restTotalWidth = PADDING_WIDTH + CONTENT_LEFT_WIDTH + restItemsWidth;
    return restTotalWidth <= screenWidth;
  }

  const currentTranslateX = getCurrentTranslateX();

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
      style={{
        cursor: dragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className='sendbird-carousel-items-wrapper'
        style={{
          transition: dragging ? 'none' : 'transform 0.3s ease',
          transform: `translateX(${currentTranslateX}px)`,
          gap: gap,
        }}
      >
        {items.map((item, index) => (
          <CarouselItem key={`${id}-${index}`} item={item} defaultWidth={defaultItemWidth + 'px'}/>
        ))}
      </div>
    </div>
  );
}

export default Carousel;
