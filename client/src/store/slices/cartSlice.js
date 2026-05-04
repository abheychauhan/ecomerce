import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/cart');
    return res.data.cart;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

export const addToCart = createAsyncThunk('cart/add', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/cart/add', data);
    return res.data.cart;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

export const increaseQuantity = createAsyncThunk('cart/increase', async (data, { rejectWithValue }) => {
  try {
    const res = await api.put('/cart/increase', data);
    return res.data.cart;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

export const decreaseQuantity = createAsyncThunk('cart/decrease', async (data, { rejectWithValue }) => {
  try {
    const res = await api.put('/cart/decrease', data);
    return res.data.cart;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

export const removeFromCart = createAsyncThunk('cart/remove', async (productId, { rejectWithValue }) => {
  try {
    console.log('Remove from Cart - Product ID:', productId);
    const res = await api.delete(`/cart/remove/${productId}`);
    console.log('Remove from Cart - Response:', res.data);
    return res.data.cart;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalPrice: 0,
    loading: false,
    error: null,
    msg: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    const handleCart = (state, action) => {
      state.loading = false;
      state.items = action.payload?.items || [];
      state.totalPrice = action.payload?.totalPrice || 0;
    };

    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; })
      .addCase(fetchCart.fulfilled, handleCart)
      .addCase(addToCart.fulfilled, handleCart)
      .addCase(increaseQuantity.fulfilled, handleCart)
      .addCase(increaseQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(decreaseQuantity.fulfilled, handleCart)
      .addCase(decreaseQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromCart.fulfilled, handleCart)
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;