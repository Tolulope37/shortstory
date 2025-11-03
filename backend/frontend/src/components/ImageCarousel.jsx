import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/ImageCarousel.css';

const ImageCarousel = ({ images = [], aspectRatio = '4/3', height = '100%', className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Minimum distance required for swipe
  const minSwipeDistance = 50;

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToSlide = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
  };

  // Handle transition end
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300); // Match this with transition duration in CSS
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Touch event handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    
    // Reset values
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // If no images, display a placeholder
  if (images.length === 0) {
    return (
      <div 
        className={`image-carousel-placeholder ${className}`} 
        style={{ aspectRatio }}
      >
        <span>No images available</span>
      </div>
    );
  }

  return (
    <div 
      className={`image-carousel-container ${className}`}
      style={{ height }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="carousel-inner" style={{ aspectRatio }}>
        {images.map((image, index) => (
          <div 
            key={index}
            className={`carousel-slide ${index === currentIndex ? 'active' : ''}`} 
            style={{
              backgroundImage: `url(${image})`,
              transform: `translateX(${100 * (index - currentIndex)}%)`
            }}
            aria-hidden={index !== currentIndex}
          />
        ))}
      </div>
      
      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button 
            className="carousel-arrow carousel-arrow-left" 
            onClick={prevSlide} 
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            className="carousel-arrow carousel-arrow-right" 
            onClick={nextSlide} 
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
      
      {/* Indicators */}
      {images.length > 1 && (
        <div className="carousel-indicators">
          {images.map((_, index) => (
            <button
              key={index}
              className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to image ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : 'false'}
            />
          ))}
        </div>
      )}
      
      {/* Image counter */}
      <div className="carousel-counter">
        <span>{currentIndex + 1}/{images.length}</span>
      </div>
    </div>
  );
};

export default ImageCarousel; 