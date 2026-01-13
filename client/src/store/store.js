import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['cart.items.*.addedAt'],
        warnAfter: 128,
      },
      immutableCheck: { warnAfter: 128 },
    }),
  devTools: import.meta.env.DEV && {
    name: 'E-Commerce Cart',
    trace: true,
    traceLimit: 25,
    features: {
      pause: true,
      lock: true,
      persist: true,
      export: true,
      import: 'custom',
      jump: true,
      skip: true,
      reorder: true,
      dispatch: true,
      test: true,
    },
  },
});

if (import.meta.env.DEV && import.meta.hot) {
  import.meta.hot.accept('./slices/cartSlice', async () => {
    const { default: newCartReducer } = await import('./slices/cartSlice');
    const { combineReducers } = await import('@reduxjs/toolkit');
    
    store.replaceReducer(
      combineReducers({
        cart: newCartReducer,
      })
    );
  });
}

export default store;
