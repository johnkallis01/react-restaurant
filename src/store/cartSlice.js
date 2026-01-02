import { createSlice } from '@reduxjs/toolkit';
// const initialState = {
//     items: [],
//     total: 0,
//     tax: 0,
//     subTotal: 0,
//     isCartOpen: false,
// }
const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        total: 0,
        tax: 0,
        subTotal: 0,
        isCartOpen: false,
        error: null
    },
    reducers:{
        addItem : (state, action) => {
            const item = action.payload;
            state.items.push(item);
            state.subTotal+=Number(item.price);
            console.log('add item')        
        },
        removeItem : (state,action)=>{
            const index = action.payload;
            state.items.splice(index,1);
        },
        closeCart: (state)=>{
            state.isCartOpen = false;
            console.log('close cart')
        },
        openCart: (state)=>{
            state.isCartOpen=true;
            console.log('open cart')
        },
        toggleCart: (state) =>{
            state.isCartOpen = !state.isCartOpen;
            console.log('toggle')
        },
        clearCart: (state)=>{
            state.items=[];
            state.total=0;
            state.tax=0;
            state.subTotal=0;
            state.isCartOpen=false;
        }
    },
});
export const {
  addItem,
  removeItem,
  decreaseQuantity,
  clearCart,
  openCart,
  closeCart,
  toggleCart,
} = cartSlice.actions;

export default cartSlice.reducer;