import React from 'react'
import { HiChevronLeft, HiChevronRight, HiX } from 'react-icons/hi';

const LightBox = ({ images, activeIndex, onClose, onChangeIndex }) => {
  if (!images || images.length === 0) return null;
  const goPrev = (e) => { e.stopPropagation(); onChangeIndex((i) => (i === 0 ? images.length - 1 : i - 1)); };
  const goNext = (e) => { e.stopPropagation(); onChangeIndex((i) => (i === images.length - 1 ? 0 : i + 1)); };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6">
      <button onClick={onClose} aria-label="Close" className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
        <HiX className="text-xl" />
      </button>

      <div className="relative w-full max-w-6xl aspect-4/3 rounded-2xl overflow-hidden">
        <img src={images[activeIndex]} alt={`gallery ${activeIndex + 1}`} className="w-full h-full object-cover" />
        {images.length > 1 && (
          <>
            <button onClick={goPrev} aria-label="Previous" className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-dwelling-dark flex items-center justify-center hover:bg-white">
              <HiChevronLeft className="text-xl" />
            </button>
            <button onClick={goNext} aria-label="Next" className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-dwelling-dark flex items-center justify-center hover:bg-white">
              <HiChevronRight className="text-xl" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LightBox