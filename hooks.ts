import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { 
  addToCart, 
  toggleWishlist, 
  showToast as showToastAction, 
  hideToast as hideToastAction 
} from './store';
import { Product } from './types';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAuth = () => {
  const { user, token, status } = useAppSelector((state) => state.auth);
  const isAuthenticated = !!token && !!user;
  return { user, token, isAuthenticated, isLoading: status === 'loading' };
};

export const useToast = () => {
  const dispatch = useAppDispatch();
  const toast = useAppSelector(state => state.ui.toast);
  
  const showToast = (message: string, type: 'success' | 'error') => {
    dispatch(showToastAction({ message, type }));
    setTimeout(() => {
      dispatch(hideToastAction());
    }, 3000);
  };

  return { toast, showToast };
};

export const useCartActions = () => {
  const dispatch = useAppDispatch();
  const wishlist = useAppSelector(state => state.cart.wishlist);
  const cartItems = useAppSelector(state => state.cart.items);

  return {
    cartItems,
    wishlist,
    addItem: (p: Product) => {
      dispatch(addToCart(p));
    },
    toggleFav: (p: Product) => {
      dispatch(toggleWishlist(p));
    },
    isInWishlist: (id: number) => wishlist.some(i => i.id === id),
  };
};