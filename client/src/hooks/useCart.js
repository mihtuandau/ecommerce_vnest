import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { useAuth } from './useAuth';
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

export const useCart = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const total = useSelector(selectCartTotal);
  const itemsCount = useSelector(selectCartItemsCount);
  
  // Use auth state instead of localStorage
  const isLoggedIn = isAuthenticated && !!user;

  useEffect(() => {
    // Listen for login events
    const handleLoginEvent = () => {
      console.log('🔔 Login event detected, fetching cart...');
      if (isLoggedIn) {
        dispatch(fetchCart());
      }
    };
    
    window.addEventListener('userLoggedIn', handleLoginEvent);
    
    return () => {
      window.removeEventListener('userLoggedIn', handleLoginEvent);
    };
  }, [dispatch, isLoggedIn]);

  // Load cart when user becomes logged in
  useEffect(() => {
    if (isLoggedIn) {
      console.log('✅ User is logged in, loading cart...');
      dispatch(fetchCart());
    }
  }, [isLoggedIn, dispatch]);

  const loadCart = useCallback(() => {
    if (isLoggedIn) {
      dispatch(fetchCart());
    }
  }, [dispatch, isLoggedIn]);

  const addToCart = useCallback((variantId, quantity, productData) => {
    const action = isLoggedIn ? addToCartServer : addToCartGuest;
    console.log('🛒 useCart.addToCart:', { 
      variantId, 
      quantity, 
      isLoggedIn, 
      actionType: isLoggedIn ? 'SERVER' : 'GUEST' 
    });
    dispatch(action({ variantId, quantity, productData }));
  }, [dispatch, isLoggedIn]);

  const updateCartItem = useCallback((variantId, quantity) => {
    const action = isLoggedIn ? updateCartServer : updateCartItemGuest;
    console.log('🔄 useCart.updateCartItem:', { 
      variantId, 
      quantity, 
      isLoggedIn, 
      actionType: isLoggedIn ? 'SERVER' : 'GUEST' 
    });
    dispatch(action({ variantId, quantity }));
  }, [dispatch, isLoggedIn]);

  const removeFromCart = useCallback((variantId) => {
    const action = isLoggedIn ? removeFromCartServer : removeFromCartGuest;
    console.log('🗑️ useCart.removeFromCart:', { 
      variantId, 
      isLoggedIn, 
      actionType: isLoggedIn ? 'SERVER' : 'GUEST' 
    });
    dispatch(action(variantId));
  }, [dispatch, isLoggedIn]);

  const clearCart = useCallback(() => {
    const action = isLoggedIn ? clearCartServer : clearCartGuest;
    console.log('🧹 useCart.clearCart:', { 
      isLoggedIn, 
      actionType: isLoggedIn ? 'SERVER' : 'GUEST' 
    });
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

// Lightweight hooks remain the same
export const useCartCount = () => useSelector(selectCartCount);
export const useCartTotal = () => useSelector(selectCartTotal);
