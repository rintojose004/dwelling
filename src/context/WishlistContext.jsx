import { createContext, useState, useEffect, useContext, useMemo } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('dwelling-wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('dwelling-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (property) => {
    setWishlist(prev => {
      if (prev.find(p => p.id === property.id)) return prev;
      return [...prev, property];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist(prev => prev.filter(p => p.id !== id));
  };
  
  const toggleWishlist = (property) => {
    if (wishlist.find(p => p.id === property.id)) {
      removeFromWishlist(property.id);
    } else {
      addToWishlist(property);
    }
  };

  const isInWishlist = (id) => {
    return wishlist.some(p => p.id === id);
  };

  const contextValue = useMemo(() => ({
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist
  }), [wishlist]);

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
