import './index.scss';
import React, {ReactElement, useRef, useState} from 'react';

interface CarouselProps {
  items: ReactElement[];
}

interface CarouselItemProps {
  item: ReactElement;
  width: string;
}

function CarouselItem({
  item,
  width
}: CarouselItemProps): ReactElement {
  return <div style={{ width: width }}>{
    item
  }</div>;
}


interface CarouselProps {
  items: ReactElement[];
  gap?: number;
}

export function Carousel({
  items,
  gap = 8,
}: CarouselProps): ReactElement {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offset, setOffset] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const itemWidth = carouselRef.current?.clientWidth ?? 0;

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
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
    setDragging(false);
    handleDragEnd();
  };

  // Belows are for mobile
  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setDragging(true);
    setStartX(event.touches[0].clientX);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const newOffset = event.touches[0].clientX - startX;
    setOffset(newOffset);
  };

  const handleTouchEnd = () => {
    if (!dragging) return;
    setDragging(false);
    handleDragEnd();
  };

  // This is for both web and mobile
  const handleDragEnd = () => {
    const threshold = carouselRef.current.offsetWidth / 2;
    const absOffset = Math.abs(offset);
    if (absOffset >= threshold) {
      // If dragged to left, swipe left
      if (offset < 0 && currentIndex < items.length - 1) {
        setCurrentIndex(currentIndex + 1);
        // If dragged to right, swipe right
      } else if (offset > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
    setOffset(0);
  };

  const translateX = currentIndex * (itemWidth + gap) * -1 + offset;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
        width: '100%',
      }}
    >
      <div
        ref={carouselRef}
        style={{
          width: '100%',
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
          style={{
            display: 'flex',
            transition: dragging ? 'none' : 'transform 0.3s ease',
            transform: `translateX(${translateX}px)`,
            boxSizing: 'border-box',
            width: '100%',
            gap: gap,
          }}
        >
          {items.map((item, index) => (
            <div key={index} style={{ flex: '0 0 100%', maxWidth: '100%' }}>
              <CarouselItem item={item} width={itemWidth + 'px'}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Carousel;
