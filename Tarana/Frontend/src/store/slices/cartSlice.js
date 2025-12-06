import { createSlice } from '@reduxjs/toolkit';

// Safely parse cart from localStorage
const getCartFromStorage = () => {
  try {
    const cartData = localStorage.getItem('cart');
    if (!cartData) return [];
    const parsed = JSON.parse(cartData);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error parsing cart from localStorage:', error);
    return [];
  }
};

const initialState = {
  items: getCartFromStorage(),
  total: 0,
};

const calculateTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    ...initialState,
    total: calculateTotal(initialState.items),
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const productId = product._id || product.id;
      
      const existingItem = state.items.find(item => {
        const itemProductId = item.product._id || item.product.id;
        return String(itemProductId) === String(productId);
      });

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          product,
          quantity,
          price: product.price,
        });
      }

      state.total = calculateTotal(state.items);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      const productId = String(action.payload);
      state.items = state.items.filter(item => {
        const itemProductId = String(item.product._id || item.product.id);
        return itemProductId !== productId;
      });
      state.total = calculateTotal(state.items);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const productIdStr = String(productId);
      const item = state.items.find(item => {
        const itemProductId = String(item.product._id || item.product.id);
        return itemProductId === productIdStr;
      });
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => {
            const itemProductId = String(item.product._id || item.product.id);
            return itemProductId !== productIdStr;
          });
        } else {
          item.quantity = quantity;
        }
        state.total = calculateTotal(state.items);
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

