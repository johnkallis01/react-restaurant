import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice';
import menuReducer from './menuSlice';
import cartReducer from './cartSlice';
// import cartItemReducer from './cartItemSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        menus: menuReducer,
        // cartItem: cartItemReducer,
        cart: cartReducer,
    },
});

export default store;