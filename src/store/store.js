import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice';
import menuReducer from './menuSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        menus: menuReducer,
    },
});

export default store;