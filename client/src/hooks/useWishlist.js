import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'wishlist_product_ids';

const getStored = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState(() => getStored());

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        setWishlist(getStored());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const save = (ids) => {
    setWishlist(ids);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  };

  const isWishlisted = useCallback(
    (productId) => wishlist.includes(String(productId)),
    [wishlist]
  );

  const toggleWishlist = useCallback(
    (productId) => {
      const id = String(productId);
      const current = getStored();
      const updated = current.includes(id)
        ? current.filter((i) => i !== id)
        : [...current, id];
      save(updated);
      return !current.includes(id); // true = added, false = removed
    },
    []
  );

  return { wishlist, isWishlisted, toggleWishlist };
};
