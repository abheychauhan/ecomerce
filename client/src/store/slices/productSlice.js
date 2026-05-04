import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ✅ GET ALL PRODUCTS
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get('/products', { params });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// ✅ GET SINGLE PRODUCT
export const fetchProduct = createAsyncThunk(
  'products/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/products/${id}`);
      return res.data.product;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    product: null,
    total: 0,
    pages: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch One
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;