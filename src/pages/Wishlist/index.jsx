import { PropertyCard } from '@/components/PropertyCard';
import { useWishlist } from '@/context/WishlistContext';
import { Link } from 'react-router-dom';

export default function Wishlist() {
  const { wishlist } = useWishlist();

  return (
    <div className="bg-[#fcfaf8] min-h-screen pt-24 lg:pt-32 pb-20">
      <div className="mx-auto px-6 md:px-12">
        
        <div className="mb-12 border-b border-gray-200 pb-8">
          <h1 className="text-4xl font-serif text-dwelling-dark font-bold mb-3">Your Wishlist</h1>
          <p className="text-sm text-dwelling-muted">
            {wishlist.length === 1 ? '1 property saved for later.' : `${wishlist.length} properties saved for later.`}</p>
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((property) => (<PropertyCard key={property.id} property={property} />))}
          </div>) : (<div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-serif font-bold text-dwelling-dark mb-3">No properties saved yet</h3>
            <p className="text-sm text-dwelling-muted mb-8 max-w-sm mx-auto">
              Browse our curated collection of premium homes and save your favorites to view them later.</p>
            <Link to="/properties" className="inline-block px-6 py-3 bg-dwelling-accent text-white rounded-lg text-sm 
              font-semibold hover:bg-opacity-90 transition-colors shadow-sm">Explore Properties</Link>
          </div>)}
      </div>
    </div>
  );
}
