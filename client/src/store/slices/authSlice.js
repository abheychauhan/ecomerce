import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import toast from 'react-hot-toast';

// ✅ REGISTER
export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const res = await api.post('/auth/register', userData);
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            return res.data.user;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// ✅ LOGIN
export const login = createAsyncThunk(
    'auth/login',
    async (userData, { rejectWithValue }) => {
        try {
            const res = await api.post('/auth/login', userData);
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('user', JSON.stringify(res.data.user)); 
            const user = JSON.parse(localStorage.getItem('user')); // ← yeh add karo
            console.log('Login - Stored User Data:', user); // Debugging log
            return res.data.user;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// ✅ LOGOUT
export const logout = createAsyncThunk('auth/logout', async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        restoreUser: (state) => {
            const user = localStorage.getItem('user');
            if (user) {
                state.user = JSON.parse(user); // ← refresh pe user wapas aayega
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                 toast.success(`Welcome back, ${action.payload.name}! 👋`);

            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                 toast.success(`Welcome back, ${action.payload.name}! 👋`);

            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                 toast.success('Logout ho gaye! 👋');

            });


    },
});

export const { clearError ,  restoreUser } = authSlice.actions;
export default authSlice.reducer;