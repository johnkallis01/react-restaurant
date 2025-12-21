import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: '',
    id: null,
    price: 0,
    options: {},
    addOns:[],
    removes:[],
    comments:'',
}

const cartItemSlice = createSlice({
    name: 'cartItem',
    initialState,
    reducers: {
        setCartItem : ( state, action) => {
            const { name, _id, price, options, addOns, removes, comments }= action.payload;
            state.name = name;
            state._id = _id;
            state.price=price;
            state.options=options;
            state.addOns=addOns;
            state.removes=removes;
            state.comments=comments;
        },
        updateCartItemField: (state, action) => {
        const { field, value } = action.payload
        state[field] = value
        },
        resetCartItem: () => ({ ...initialState }),
    },
});

export const { setCartItem,updateCartItemField, resetCartItem } = cartItemSlice.actions;
export default cartItemSlice.reducer;