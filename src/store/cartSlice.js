import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const initialState = {
    items: [],
    total: 0,
    tax: 0,
    subTotal: 0,
    isCartOpen: false,
}
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers:{
        addItem : (state, action) => {
            const item = action.payload;
            state.items.push(item);
            state.subTotal += item.price;
            state.tax += (item.price * 0.06);
            state.total += (item.price*1.06);
            
        },
        clearCart: (state)=>{
            state.Items=[];
            state.total=0;
            state.tax=0;
            state.subTotal=0;
            state.isCartOpen=false;
        }
    },
});
export default cartSlice.reducers;