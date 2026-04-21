import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { useAuth, useAuthLoading } from './useAuth';
import {
  selectCartItems,
  selectCartCount,
  selectCartTotal,
  selectCartItemsCount,
  addToCartGuest,
  updateCartItemGuest,
  removeFromCartGuest,
  clearCartGuest,
  addToCartServer,
  updateCartServer,
  removeFromCartServer,
  clearCartServer,
  fetchCart,
} from '../store/slices/cartSlice';
import { loadCartFromStorage, clearCartStorage } from '../store/slices/cartHelpers';

export const useCart = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();
  const authLoading = useAuthLoading();
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const total = useSelector(selectCartTotal);
  const itemsCount = useSelector(selectCartItemsCount);

  const isLoggedIn = isAuthenticated && !!user;

  // Merge guest cart with server cart when user logs in
  useEffect(() => {
    if (authLoading || !isLoggedIn) return;

    const mergeGuestCartWithServer = async () => {
      try {
        // Get guest items from localStorage
        const guestItems = loadCartFromStorage();
        
        // Fetch server cart
        await dispatch(fetchCart()).unwrap();
        
        // Add guest items to server cart if there are any
        if (guestItems && guestItems.length > 0) {
          for (const guestItem of guestItems) {
            await dispatch(addToCartServer({
              variantId: guestItem.variantId,
              quantity: guestItem.quantity,
              productData: guestItem.product
            })).unwrap();
          }
          
          // Clear guest cart after merging
          clearCartStorage();
        }
      } catch (error) {
        console.error('Failed to merge guest cart:', error);
        // Still fetch server cart even if merge fails
        dispatch(fetchCart());
      }
    };

    mergeGuestCartWithServer();
  }, [isLoggedIn, dispatch, authLoading]);

  useEffect(() => {
    const handleLoginEvent = () => {
      if (isLoggedIn) {
        // Event is handled by the effect above
      }
    };
    
    window.addEventListener('userLoggedIn', handleLoginEvent);
    
    return () => {
      window.removeEventListener('userLoggedIn', handleLoginEvent);
    };
  }, [isLoggedIn]);

  const loadCart = useCallback(() => {
    if (isLoggedIn) {
      dispatch(fetchCart());
    }
  }, [dispatch, isLoggedIn]);

  const addToCart = useCallback((variantId, quantity, productData) => {
    const action = isLoggedIn ? addToCartServer : addToCartGuest;
    
    dispatch(action({ variantId, quantity, productData }));
  }, [dispatch, isLoggedIn]);

  const updateCartItem = useCallback((variantId, quantity) => {
    const action = isLoggedIn ? updateCartServer : updateCartItemGuest;
    dispatch(action({ variantId, quantity }));
  }, [dispatch, isLoggedIn]);

  const removeFromCart = useCallback((variantId) => {
    const action = isLoggedIn ? removeFromCartServer : removeFromCartGuest;
    dispatch(action(variantId));
  }, [dispatch, isLoggedIn]);

  const clearCart = useCallback(() => {
    const action = isLoggedIn ? clearCartServer : clearCartGuest;
    dispatch(action());
  }, [dispatch, isLoggedIn]);

  return useMemo(() => ({
    items,
    count,
    total,
    itemsCount,
    isLoggedIn,
    loadCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  }), [
    items,
    count,
    total,
    itemsCount,
    isLoggedIn,
    loadCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  ]);
};

export const useCartCount = () => useSelector(selectCartCount);
export const useCartTotal = () => useSelector(selectCartTotal);






