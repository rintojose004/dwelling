import React, { useState, useMemo, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { HiOutlineArrowLeft, HiOutlineShare, HiOutlineHeart, HiHeart, HiOutlineLocationMarker } from "react-icons/hi";
import propertiesData from "../../data/properties.json";
import { useWishlist } from "@/context/WishlistContext";
import AgentCard from "@/components/AgentCard";
import BookVisitDialog from "@/components/Dialog";
import LightBox from "@/components/LightBox";
import NearbyList from "@/components/NearbyList";
import SpecsGrid from "@/components/SpecsGrid";

const badgeStyle= `px-2 py-1 rounded-md text-xs font-semibold bg-dwelling-accent text-white`

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const property = useMemo(() => propertiesData.find((p) => p.id === id), [id]);
  const images = useMemo(() => (property?.gallery?.length ? property.gallery : [property?.image]).filter(Boolean), [property]);

  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [visitDialogOpen, setVisitDialogOpen] = useState(false);

  const handleBack = useCallback(() => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/properties");
  }, [navigate]);

  const handleSave = useCallback(() => {
    if (property) toggleWishlist(property);
  }, [toggleWishlist, property]);

  const handleShare = useCallback(() => {
    if (!property) return;
    if (navigator.share) navigator.share({ title: property.title, url: window.location.href }).catch(() => {});
    else if (navigator.clipboard) navigator.clipboard.writeText(window.location.href).catch(() => {});
  }, [property]);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-dwelling-dark font-semibold mb-4">Property not found</p>
          <Link to="/properties" className="px-6 py-2 rounded-lg bg-dwelling-accent text-white">Back to listings</Link>
        </div>
      </div>
    );
  }

  const isSaved = isInWishlist(property.id);
  const mapSrc = useMemo(() => {
    if (Array.isArray(property.coordinates) && property.coordinates.length === 2) {
      return `https://www.google.com/maps?q=${property.coordinates[0]},${property.coordinates[1]}&z=14&output=embed`;
    }
    if (property.location) return `https://www.google.com/maps?q=${encodeURIComponent(property.location)}&z=13&output=embed`;
    return null;
  }, [property]);

  const THUMB_COUNT = 6;
  const thumbItems = images.slice(0, THUMB_COUNT);

  return (
    <div className="bg-white min-h-screen pt-24 lg:pt-32 pb-20">
    <BookVisitDialog open={visitDialogOpen} onClose={() => setVisitDialogOpen(false)} />
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={handleBack} className="flex items-center gap-2 text-sm font-semibold text-dwelling-primary 
          hover:text-dwelling-accent">
            <HiOutlineArrowLeft className="text-lg" /> Back
          </button>
          <div className="flex items-center gap-3">
            <button onClick={handleShare} className="flex items-center gap-2 text-sm text-dwelling-primary 
            hover:text-dwelling-accent">
              <HiOutlineShare className="text-lg" /> Share
            </button>
            <button onClick={handleSave} className="flex items-center gap-2 text-sm">
              {isSaved ? <HiHeart className="text-dwelling-accent text-lg" /> : <HiOutlineHeart className="text-lg" />}
              <span className="text-dwelling-primary font-semibold">{isSaved ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>

        {/* Layout: left gallery + right sticky card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Gallery column */}
          <div className="lg:col-span-7">
            <div className="flex gap-4">
              {/* vertical thumbnails (hidden on small screens) */}
              <div className="hidden md:flex flex-col gap-3 w-20">
                {thumbItems.map((img, idx) => {
                  const isLastThumbWithMore = idx === THUMB_COUNT - 1 && images.length > THUMB_COUNT;
                  return (
                    <button key={img} onClick={() => {
                        if (isLastThumbWithMore) setLightboxOpen(true);
                        else setActiveImage(idx);
                      }}
                      className={`relative aspect-4/3 rounded-lg overflow-hidden border transition-shadow ${activeImage === idx ?
                        "ring-2 ring-dwelling-accent" : "border-gray-100"}`}
                      aria-label={isLastThumbWithMore ? `View all ${images.length} images` : `Thumbnail ${idx + 1}`}>
                      <img src={img} alt={`thumb ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
                      {isLastThumbWithMore && (
                        <div className="absolute inset-0 bg-black/45 flex items-center justify-center text-white text-sm 
                        font-semibold">+{images.length - THUMB_COUNT}</div>)}
                    </button>
                  );
                })}
              </div>

              {/* main image */}
              <div className="flex-1 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                <button onClick={() => setLightboxOpen(true)} className="w-full h-full block">
                  <img src={images[activeImage]} alt={`${property.title} image ${activeImage + 1}`}
                   className="w-full h-[min(60vh,560px)] object-cover" /></button>
              </div>
            </div>

            {/* Thumbnails grid for small screens: show up to 6 with +N overlay */}
            <div className="mt-4 md:hidden grid grid-cols-4 gap-3">
              {thumbItems.map((img, idx) => {
                const isLastThumbWithMore = idx === THUMB_COUNT - 1 && images.length > THUMB_COUNT;
                return (
                  <button key={img} onClick={() => {
                      if (isLastThumbWithMore) setLightboxOpen(true);
                      else setActiveImage(idx);
                    }}
                    className={`aspect-4/3 rounded-lg overflow-hidden border ${activeImage === idx ?
                      "ring-2 ring-dwelling-accent" : "border-gray-100"}`}>
                    <img src={img} alt={`thumb ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
                    {isLastThumbWithMore && (
                      <div className="absolute inset-0 bg-black/45 flex items-center justify-center text-white 
                        text-sm font-semibold">+{images.length - THUMB_COUNT}
                      </div>)}
                  </button>
                );
              })}
            </div>

            {/* Title + meta (badges moved into content) */}
            <div className="mt-6">
              <h1 className="text-3xl font-serif font-bold text-dwelling-dark leading-tight">{property.title}</h1>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-dwelling-muted">
                  <HiOutlineLocationMarker /> {property.address || property.location}
                </div>

                {/* badges as pills in content */}
                <div className="flex flex-wrap items-center gap-2 ml-2">
                  {property.badge && <span className={badgeStyle}>{property.badge}</span>}
                  {property.tag && <span className={badgeStyle}>{property.tag}</span>}
                  {property.verified && <span className={badgeStyle}>Verified</span>}
                </div>
              </div>
            </div>

            {/* content sections */}
            <div className="mt-8 space-y-6">
              <section className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-semibold text-dwelling-dark mb-2">Overview</h3>
                <p className="text-sm text-dwelling-primary leading-relaxed">{property.description}</p>
              </section>

              <section>
                <SpecsGrid specs={property.specifications} />
              </section>

              {property.amenities?.length > 0 && (
                <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                    <h3 className="text-lg font-semibold text-dwelling-dark">Amenities</h3>
                    <span className="text-sm text-dwelling-muted">{property.amenities.length} Amenities</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {property.amenities.map((amenity) => (
                      <div key={amenity} title={amenity} className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 
                        text-sm font-medium text-dwelling-dark transition-all duration-300 hover:border-dwelling-accent 
                        hover:bg-dwelling-accent hover:text-white">{amenity}</div>))}
                  </div>
                </section>)}

              <section>
                <NearbyList nearby={property.nearby} />
              </section>

              {mapSrc && (
                <section className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                  <h3 className="p-4 text-sm font-semibold text-dwelling-dark">Location</h3>
                  <div className="h-56">
                    <iframe title={`Map - ${property.title}`} src={mapSrc} width="100%" height="100%" style={{ border: 0 }} 
                    loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                  </div>
                </section>)}
            </div>
          </div>

          {/* Right sticky card */}
          <aside className="lg:col-span-5">
            <div className="sticky top-28 space-y-5">
              <div className="bg-linear-to-br from-white/60 to-white/30 border border-gray-100 rounded-2xl p-5 shadow-lg 
              backdrop-blur-sm">
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <div className="text-3xl font-bold text-dwelling-dark">{property.price}</div>
                    <div className="text-sm text-dwelling-muted mt-1">{property.pricePerSqft ?? "Contact for per sqft"}</div>
                  </div>
                  <div className="text-right text-sm text-dwelling-muted">
                    <div className="font-semibold">{property.bedrooms ?? "-" } BR</div>
                    <div className="text-xs"> {property.bathrooms ?? "-"} Baths</div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <a href={`tel:${property.agent?.phone ?? ''}`} className="block px-3 py-2 rounded-lg text-center text-sm 
                    font-semibold bg-emerald-300 text-emerald-800 border border-emerald-200 hover:bg-emerald-200">Call</a>

                  <button onClick={() => setVisitDialogOpen(true)} className="block px-3 py-2 rounded-lg text-center 
                    bg-dwelling-accent text-white text-sm font-semibold">Schedule a Visit</button>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <button onClick={handleShare} className="flex-1 px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm 
                  font-semibold">Share</button>
                  <button onClick={handleSave} className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm 
                  font-semibold">{isInWishlist(property.id) ? "Saved" : "Save"}</button>
                </div>
              </div>

              {property.agent && (<div>
                  <h4 className="text-sm font-semibold text-dwelling-dark mb-3">Agent</h4>
                  <AgentCard agent={property.agent} />
                </div>)}

              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h4 className="text-lg font-semibold text-dwelling-dark">Quick Facts</h4>
                  <p className="mt-1 text-sm text-dwelling-muted">Everything you need to know at a glance.</p>
                </div>
                            
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  {[{ label: "Area", value: property.area },
                    { label: "Parking", value: property.parking },
                    { label: "Furnishing", value: property.furnishing },
                    { label: "Property Age", value: property.propertyAge }
                  ].map(({ label, value }, index) => (
                    <div key={label} className={`p-5 transition-colors hover:bg-gray-50 ${
                        index % 2 === 0 ? "sm:border-r border-gray-100" : ""} 
                      ${index < 2 ? "border-b border-gray-100" : ""}`}>
                      <p className="text-xs uppercase tracking-widest text-dwelling-muted">{label}</p>
                      <p title={value ?? "-"} className="mt-2 text-lg font-semibold text-dwelling-dark wrap-break-word">
                        {value ?? "-"}</p>
                    </div>))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <LightBox images={images} activeIndex={activeImage} onClose={() => setLightboxOpen(false)} onChangeIndex={setActiveImage} />)}
    </div>
  );
};


export default PropertyDetails;