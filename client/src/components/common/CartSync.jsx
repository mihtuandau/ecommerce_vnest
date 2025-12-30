import { useEffect, useRef } from 'react';
import { useCart } from '../../hooks/useCart';
import { useAuth, useAuthLoading } from '../../hooks/useAuth';

export const CartSync = () => {
  const { user } = useAuth();
  const authLoading = useAuthLoading();
  const { loadCart, isLoggedIn } = useCart();
  const previousLoginState = useRef(isLoggedIn);

  useEffect(() => {
    if (authLoading) return;
    
    if (user && isLoggedIn) {
      loadCart();
    }
    previousLoginState.current = isLoggedIn;
  }, [user, isLoggedIn, loadCart, authLoading]);

  return null; 
};

export default CartSync;
