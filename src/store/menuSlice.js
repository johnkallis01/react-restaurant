import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


// const API_URL = '*/api';

// const API_URL = 'https://react-restaurant-johnkallis01-johnkallis01s-projects.vercel.app/api'
const API_URL = 'http://localhost:5000/api';
export const fetchMenus = createAsyncThunk('menus/fetchMenus', async (_,{rejectWithValue}) => {
    console.log('fetch menus')
    try{
        console.log(API_URL)
        const response = await fetch(`${API_URL}/menus`);
        // console.log(response.json())
        // if(!response.ok) throw new Error('failed to fetch menus');
        console.log('response');
        const data = await response.json();
        console.log('data:', data)
        return data;
    }catch(err){
        console.log('error');
        return rejectWithValue(err.response.data?.message||'failed to fetch menus');
    }

});
const menuSlice = createSlice({
    name: 'menus',
    initialState: {
        menus: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchMenus.pending, (state)=>{
            state.loading = true;
        })
        .addCase(fetchMenus.fulfilled, (state, action)=>{
            state.loading=false;
            state.menus=action.payload;
        })
        .addCase(fetchMenus.rejected, (state,action)=>{
            state.error = action.payload;
            state.loading = false;
        });
    }
});
export default menuSlice.reducer; 