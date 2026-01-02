import { configureStore, createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, Product, CartItem, Order, Address } from './types';
import api from './api';

// --- AUTH SLICE ---
interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  status: 'idle',
};

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async () => {
  const response = await api.get('/auth/profile');
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: User; token: string; refreshToken: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
    },
    updateUserInState: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'idle';
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.status = 'failed';
        state.user = null;
        state.token = null;
      });
  },
});

// --- UI SLICE ---
interface UIState {
  toast: { message: string; type: 'success' | 'error' | null };
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: { toast: { message: '', type: null } } as UIState,
  reducers: {
    showToast: (state, action: PayloadAction<{ message: string; type: 'success' | 'error' }>) => {
      state.toast = action.payload;
    },
    hideToast: (state) => {
      state.toast = { message: '', type: null };
    }
  }
});

// --- CART SLICE ---
interface CartState {
  items: CartItem[];
  wishlist: Product[];
  addresses: Address[];
  orders: Order[];
}

const initialCartState: CartState = {
  items: JSON.parse(localStorage.getItem('cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('wishlist') || '[]'),
  addresses: JSON.parse(localStorage.getItem('addresses') || '[]'),
  orders: JSON.parse(localStorage.getItem('orders') || '[]'),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: initialCartState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(i => i.id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; delta: number }>) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, item.quantity + action.payload.delta);
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cart');
    },
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const index = state.wishlist.findIndex(i => i.id === action.payload.id);
      if (index >= 0) {
        state.wishlist.splice(index, 1);
      } else {
        state.wishlist.push(action.payload);
      }
      localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
    },
    addAddress: (state, action: PayloadAction<Address>) => {
      if (action.payload.isDefault) {
        state.addresses.forEach(a => a.isDefault = false);
      }
      state.addresses.push(action.payload);
      localStorage.setItem('addresses', JSON.stringify(state.addresses));
    },
    removeAddress: (state, action: PayloadAction<string>) => {
      state.addresses = state.addresses.filter(a => a.id !== action.payload);
      localStorage.setItem('addresses', JSON.stringify(state.addresses));
    },
    setDefaultAddressAction: (state, action: PayloadAction<string>) => {
      state.addresses.forEach(a => a.isDefault = a.id === action.payload);
      localStorage.setItem('addresses', JSON.stringify(state.addresses));
    },
    placeOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
      state.items = [];
      localStorage.setItem('orders', JSON.stringify(state.orders));
      localStorage.removeItem('cart');
    }
  },
});

export const { setAuth, logout, updateUserInState } = authSlice.actions;
export const { showToast, hideToast } = uiSlice.actions;
export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  toggleWishlist, 
  addAddress, 
  removeAddress, 
  setDefaultAddressAction,
  placeOrder 
} = cartSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    cart: cartSlice.reducer,
    ui: uiSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;