import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import propertiesData from '../../data/properties.json';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { PropertyCard } from '../PropertyCard';

export default function FeaturedProperties() {

  const featured = useMemo(() => propertiesData.slice(0, 6), []);

  return (
    <section className="py-10 bg-white">
      <div className="mx-auto px-6 md:px-12">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-serif text-dwelling-dark font-semibold mb-1.5">Featured Properties</h2>
            <p className="text-sm text-dwelling-muted">A handpicked edit of our most sought-after homes.</p>
          </div>
          <Link to="/properties" className="hidden sm:flex items-center text-sm font-medium text-dwelling-primary 
          hover:text-dwelling-accent transition-colors group shrink-0">
            View all properties
            <HiOutlineArrowRight className="ml-1.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((property, index) => (
            <PropertyCard key={property.id} property={property} />))}
        </div>

        <div className="flex sm:hidden justify-center mt-8">
          <Link to="/properties" className="flex items-center text-sm font-medium text-dwelling-primary 
          hover:text-dwelling-accent transition-colors group">
            View all properties
            <HiOutlineArrowRight className="ml-1.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}