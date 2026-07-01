import { useState, useMemo, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import {  HiOutlineHeart,  HiHeart,  HiOutlineLocationMarker,  HiChevronLeft, 
  HiChevronRight, HiBadgeCheck,HiOutlineArrowRight } from "react-icons/hi";
import { BiBed, BiBath, BiArea } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/context/WishlistContext";

const BADGE_CLASSES = `px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-md 
  uppercase bg-dwelling-accent text-white shadow-sm border border-white/10`;

export const PropertyCard = memo(({ property, index = 0 }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isSaved = isInWishlist(property.id);

  const [imageIndex, setImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = useMemo(() =>
      property.gallery && property.gallery.length > 0 ? property.gallery : [property.image],
    [property.gallery, property.image]);

  const goToDetails = useCallback(() => {
    navigate(`/property/${property.id}`);
  }, [navigate, property.id]);

  const handleCardKeyDown = useCallback((e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goToDetails();
    }
  }, [goToDetails]);

  const goPrev = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setImageIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const goNext = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setImageIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  const handleWishlistClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(property);
  }, [toggleWishlist, property]);

  return (
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} role="link" tabIndex={0}
      onClick={goToDetails} onKeyDown={handleCardKeyDown} className="bg-white rounded-2xl overflow-hidden border 
        border-gray-100 shadow-sm hover:shadow-sm hover:border-dwelling-accent/30
        transition-[box-shadow,border-color] duration-200 group flex flex-col cursor-pointer outline-none
        focus-visible:ring-2 focus-visible:ring-dwelling-accent focus-visible:ring-offset-2">
      {/* Media Window Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-gray-50">
        {images.map((src, i) => (
          <img key={src} src={src} alt={`${property.title} ${i + 1}`} loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out 
              ${i === imageIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"}`} /> ))}

        {/* Linear Scrim Gradients */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-black/15 to-transparent pointer-events-none" />

        <AnimatePresence>
          {isHovered && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-dwelling-dark/20 flex items-center justify-center z-5 pointer-events-none">
              <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25, delay: 0.05 }} className="inline-flex items-center gap-1.5 bg-white text-gray-900
                 text-xs font-semibold px-4 py-2 rounded-full shadow-md">View Property
                <HiOutlineArrowRight className="text-sm text-dwelling-accent" />
              </motion.span>
            </motion.div>)}
        </AnimatePresence>

        {/* Action Elements Overlays */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex justify-between items-center z-10">
          {property.badge || property.tag ? (
            <span className={BADGE_CLASSES}>{property.badge || property.tag}</span>) : <div />}

          {/* Wishlist Toggle */}
          <button onClick={handleWishlistClick} aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
            className={`p-2 rounded-full shadow-sm transition-colors duration-150 active:scale-95 ${
              isSaved ? "bg-dwelling-accent text-white" : "bg-white/95 backdrop-blur-xs text-gray-700 hover:text-white hover:bg-dwelling-accent"
            }`}>
            {isSaved ? <HiHeart className="text-lg" /> : <HiOutlineHeart className="text-lg" />}
          </button>
        </div>

        {/* Controls: Prev/Next Image Buttons */}
        <AnimatePresence>
          {images.length > 1 && isHovered && (
            <>
              <button onClick={goPrev} aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8
                  flex items-center justify-center rounded-full bg-white/95 backdrop-blur-xs text-gray-800
                  hover:bg-white shadow-md active:scale-95 transition-transform">
                <HiChevronLeft className="text-lg" />
              </button>
              <button onClick={goNext} aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8
                  flex items-center justify-center rounded-full bg-white/95 backdrop-blur-xs text-gray-800
                  hover:bg-white shadow-md active:scale-95 transition-transform">
                <HiChevronRight className="text-lg" />
              </button>
            </>)}
        </AnimatePresence>

        {/* Carousel Progress Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-3.5 right-3.5 z-10 flex items-center gap-1">
            {images.map((_, i) => (
              <span key={i} className={`h-1 rounded-full transition-all duration-300 ${
                  i === imageIndex ? "w-3.5 bg-white" : "w-1 bg-white/50"}`} /> ))}
          </div>)}
      </div>

      {/* Content Meta Wrapper */}
      <div className="p-5 flex flex-col grow justify-between gap-4">
        <div>
          <div className="flex justify-between items-start gap-4 mb-2">
            {/* Left Content Area: Strictly handling long text containment */}
            <div className="min-w-0 flex-1">
              <h3 title={property.title} className="block font-semibold text-gray-900 text-base sm:text-lg leading-snug
               tracking-tight bg-linear-to-r from-dwelling-accent to-dwelling-accent bg-no-repeat bg-size-[0%_1px] 
               bg-position-[0_100%] group-hover:bg-size-[100%_1px] group-hover:text-dwelling-accent 
               transition-[background-size,color] duration-150 truncate w-full">{property.title}</h3>
              <div className="flex items-center text-xs text-gray-500 mt-1.5 truncate w-full">
                <HiOutlineLocationMarker className="mr-1 shrink-0 text-gray-400 text-sm" />
                <span className="truncate">{property.location}</span>
              </div>
            </div>
            
            {/* Right Price Layout Area */}
            <div className="text-right shrink-0 flex flex-col items-end pl-2">
              <p className="font-bold text-dwelling-accent text-base sm:text-lg leading-snug">{property.price}</p>
              {property.pricePerSqft && (
                <p className="text-[10px] sm:text-[11px] text-gray-400 tracking-tight mt-0.5 whitespace-nowrap">
                  {property.pricePerSqft}</p>)}
            </div>
          </div>
        </div>

        {/* Footer Details Row */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-x-4 gap-y-2">
          <div className="flex items-center gap-x-4 gap-y-1.5 flex-wrap text-xs font-medium text-gray-600">
            {property.bhk && (
              <div className="flex items-center gap-1.5">
                <BiBed className="text-base text-gray-400" />
                <span>{property.bhk}</span>
              </div>)}
            {property.bathrooms && (
              <div className="flex items-center gap-1.5">
                <BiBath className="text-base text-gray-400" />
                <span>{property.bathrooms}</span>
              </div>)}
            {property.area && (
              <div className="flex items-center gap-1.5">
                <BiArea className="text-base text-gray-400" />
                <span>{property.area}</span>
              </div>)}
          </div>

          {property.verified && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border
             border-emerald-100 text-[10px] font-bold tracking-wide shrink-0">
              <HiBadgeCheck className="text-xs" />Verified</div>)}
        </div>
      </div>
    </div>
  );
});