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

export const useCart = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();
  const authLoading = useAuthLoading();
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const total = useSelector(selectCartTotal);
  const itemsCount = useSelector(selectCartItemsCount);

  const isLoggedIn = isAuthenticated && !!user;

  useEffect(() => {
    const handleLoginEvent = () => {
      if (isLoggedIn) {
        dispatch(fetchCart());
      }
    };
    
    window.addEventListener('userLoggedIn', handleLoginEvent);
    
    return () => {
      window.removeEventListener('userLoggedIn', handleLoginEvent);
    };
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (authLoading) return;
    
    if (isLoggedIn) {
      dispatch(fetchCart());
    }
  }, [isLoggedIn, dispatch, authLoading]);

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
