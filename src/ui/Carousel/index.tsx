import './index.scss';
import React, {ReactElement, useEffect, useRef, useState} from 'react';

interface CarouselItemProps {
  key: string;
  item: ReactElement;
  width: string;
}

function shouldRenderAsFixed(item: ReactElement) {
  return item.props.templateItems[0].width?.type === 'fixed';
}

function CarouselItem({
  key,
  item,
  width,
}: CarouselItemProps): ReactElement {
  return <div key={key} style={shouldRenderAsFixed(item) ? { width: 'fit-content' } : { minWidth: width }}>
    {item}
  </div>;
}

interface CarouselProps {
  id: string;
  items: ReactElement[];
  gap?: number;
  onCarouselDraggingChange?: (isDragging: boolean) => void;
}

export function Carousel({
  id,
  items,
  gap = 8,
  onCarouselDraggingChange = () => { /* noop */ }
}: CarouselProps): ReactElement {
  const carouselRef = useRef<HTMLDivElement>(null);
  const itemWidth = carouselRef.current?.clientWidth ?? 0;
  const itemWidths = items.map((item) => {
    if (shouldRenderAsFixed(item)) {
      return item.props.templateItems[0].width?.value;
    }
    return itemWidth;
  });
  // const viewCenterWidth = window.innerWidth / 2;
  // console.log('## viewCenterWidth: ', viewCenterWidth);

  const [currentIndex, setCurrentIndex] = useState(0);
  // const [currX, setCurrX] = useState(0);
  const [dragging, setDragging] = useState<'vertical' | 'horizontal' | null>(null);
  const [startX, setStartX] = useState(0);
  const [offset, setOffset] = useState(0);
  // const [eachItemPositions] = useState(getEachItemPositions());

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


  // useEffect(() => {
  //   const handler = (e) => {
  //     handleTouchMove(e)
  //   }
  //   if (carouselRef && carouselRef.current) {
  //     carouselRef.current.addEventListener('touchmove', handler, {passive: false});
  //     return function cleanup() {
  //       carouselRef.current.removeEventListener("touchmove", handler);
  //     };
  //   }
  // }, []);

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!startX) return;

    const touchMoveX = event.touches[0].clientX;
    const deltaX = touchMoveX - startX;

    const threshold = 5;
    // Check if swipe is more horizontal than vertical
    if (dragging === 'horizontal' || (dragging !== 'vertical' && Math.abs(deltaX) > Math.abs(event.touches[0].clientY - event.touches[event.touches.length-1].clientY) + threshold)) {
        setDragging('horizontal');
        // event.preventDefault();
        // event.stopPropagation();
        const parentElement = document.getElementsByClassName('sendbird-conversation__messages-padding');
        (parentElement[0] as HTMLElement).style.overflowY = 'hidden';
        // onCarouselDraggingChange(true);
    } else {
      setDragging('vertical');
      return;
    }

    const newOffset = event.touches[0].clientX - startX;
    setOffset(newOffset);
  };

  const handleTouchEnd = () => {
    if (!dragging) return;
    setDragging(null);
    handleDragEnd();
  };

  // This is for both web and mobile
  const handleDragEnd = () => {
    // const threshold = carouselRef.current.offsetWidth / 2;
    const threshold = 50; // itemWidths[currentIndex] / 2;
    const absOffset = Math.abs(offset);
    if (absOffset >= threshold) {
      // If dragged to left, swipe left
      if (offset < 0 && currentIndex < items.length - 1) {
        const nextIndex = currentIndex + 1;
        const lastIndex = items.length - 1;
        setCurrentIndex(isAlmostEnd(nextIndex) ? lastIndex : nextIndex);
        // If dragged to right, swipe right
      } else if (offset > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }

    // setCurrX(currX + offset);
    setOffset(0);
    // onCarouselDraggingChange(false);
    const parentElement = document.getElementsByClassName('sendbird-conversation__messages-padding');
    (parentElement[0] as HTMLElement).style.overflowY = 'scroll';
  };

  function getCurrentTranslateX() {
    let sum = 0;
    for (let i = 1; i <= currentIndex; i++) {
      if (i < items.length - 1) {
        sum += itemWidths[i - 1] + gap;
      } else {
        const PADDING_WIDTH = 24;
        const CONTENT_LEFT_WIDTH = 40;
        const currentItemWidth = itemWidths[i - 1];
        const nextItemWidth = itemWidths[i];
        const cutOffWidth = (PADDING_WIDTH + CONTENT_LEFT_WIDTH + currentItemWidth + gap + nextItemWidth) - window.innerWidth;
        sum += (cutOffWidth + PADDING_WIDTH);
      }
    }
    const translateX = sum * -1 + offset;
    return translateX;
  }

  function isAlmostEnd(index: number) {
    const PADDING_WIDTH = 24;
    const CONTENT_LEFT_WIDTH = 40;
    let sum = 0;
    const screenWidth = window.innerWidth;
    const restItemsWidth = itemWidths.slice(index).reduce((prev, curr) => prev + gap + curr);
    const threshold = 50;
    const restTotalWidth = PADDING_WIDTH + CONTENT_LEFT_WIDTH + restItemsWidth;
    return restTotalWidth < screenWidth || restTotalWidth < screenWidth + threshold
  }

  interface ItemPosition {
    start: number;
    end: number;
  }

  function getEachItemPositions(): ItemPosition[] {
    const fullWidth = itemWidths.reduce((prev, curr) => prev + gap + curr) * -1;
    console.log('## fullWidth: ', fullWidth);
    const itemCenterPositions = [];
    let accumulator = 0;
    itemWidths.map((itemWidth, i) => {
      if (i > 0) {
        accumulator -= gap;
      }
      itemCenterPositions[i] = [accumulator, accumulator - itemWidth];
      accumulator -= itemWidth;
    });
    console.log('## itemCenterPositions: ', itemCenterPositions);
    return itemCenterPositions;
  }

  // function getClosestItemIndex() {
  //
  //   const fullWidth = itemWidths.reduce((prev, curr) => prev + gap + curr);
  //   const PADDING_WIDTH = 24;
  //   const CONTENT_LEFT_WIDTH = 40;
  //   const currentItemWidth = itemWidths[i - 1];
  //   const nextItemWidth = itemWidths[i];
  //   const cutOffWidth = (PADDING_WIDTH + CONTENT_LEFT_WIDTH + currentItemWidth + gap + nextItemWidth) - window.innerWidth;
  //
  // }


  // function getSnappingPoint() {
  //   if (eachItemPositions.length < 2) return 0;
  //   for (let i = 0; i < eachItemPositions.length - 1; i++) {
  //     const curr = eachItemPositions[i];
  //     const next = eachItemPositions[i + 1];
  //     const currCenterPosition = translateX - viewCenterWidth;
  //   }
  // }

  // useEffect(() => {
  //   if (offset > 0) {
  //     setCurrX(currX + offset);
  //   }
  // }, [offset])

  const translateX = getCurrentTranslateX();
  // console.log('## translateX: ', translateX);

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
          transform: `translateX(${translateX}px)`,
          gap: gap,
        }}
      >
        {items.map((item, index) => (
          <CarouselItem key={`${id}-${index}`} item={item} width={itemWidth + 'px'}/>
        ))}
      </div>
    </div>
  );
}

export default Carousel;
