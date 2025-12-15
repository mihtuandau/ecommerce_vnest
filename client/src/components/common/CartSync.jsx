import { useEffect, useRef } from 'react';
import { useCart } from '../../hooks/useCart';
import { useAuth, useAuthLoading } from '../../hooks/useAuth';

/**
 * Component to sync cart when user logs in/out
 * - On mount (if logged in): Load cart from server
 * - On login: Load cart from server
 * - On logout: Keep guest cart in localStorage
 */
export const CartSync = () => {
  const { user } = useAuth();
  const authLoading = useAuthLoading();
  const { loadCart, isLoggedIn } = useCart();
  const previousLoginState = useRef(isLoggedIn);

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return;
    
    // Load cart from server if user is logged in (on mount or after login)
    if (user && isLoggedIn) {
      console.log('🔄 CartSync: Loading cart for authenticated user');
      loadCart();
    }
    
    // Update previous state
    previousLoginState.current = isLoggedIn;
  }, [user, isLoggedIn, loadCart, authLoading]);

  return null; // This component doesn't render anything
};

export default CartSync;
