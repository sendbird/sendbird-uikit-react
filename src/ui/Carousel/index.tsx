import './index.scss';
import React, { ReactElement, useRef, useState } from 'react';

interface CarouselItemProps {
  key: string;
  item: ReactElement;
  width: string;
}

function CarouselItem({
  key,
  item,
  width,
}: CarouselItemProps): ReactElement {
  return <div key={key} style={{ maxWidth: '100%' }}>
    <div style={{ width: width }}>{
      item
    }</div>
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
