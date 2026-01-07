import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


// const API_URL = '*/api';
const apiUrl = import.meta.env.VITE_API_URL;
//  const apiUrl = 'http://localhost:5000/api'
// const API_URL = 'https://react-restaurant-johnkallis01-johnkallis01s-projects.vercel.app/api'
// const API_URL = 'http://localhost:5000/api';
// const API_URL = 'https://react-restaurant-virid-nine.vercel.app:5000/api';
export const fetchMenus = createAsyncThunk('menus/fetchMenus', async (_,{rejectWithValue}) => {
    // console.log('fetch menus')
    try{
        // console.log(apiUrl)
        const response = await fetch(`${apiUrl}/menus`);
        // console.log(response.json())
        if(!response.ok) throw new Error('failed to fetch menus');
        // console.log('response');
        const data = await response.json();
        // console.log('data:', data)
        return data;
    }catch(err){
        console.log('error');
        return rejectWithValue(err.response.data?.message||'failed to fetch menus');
    }

});
export const updateMenu = createAsyncThunk('menus/update', async (menu,{rejectWithValue}) => {
    console.log('update menu')
    const token = localStorage.getItem('token');
    console.log(token)
    console.log(menu)
    if(token){
        try{
            const response = await fetch(`${apiUrl}/menus/${menu._id}`,{
                method: 'PUT',
                headers: {
                    authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(menu)
            });
            if(!response.ok){
                const error = await response.json();
                throw new Error(error.message || 'menu failed to update')
            }
            const data = await response.json();
            console.log(data)
            return data;
        }catch(err){
            console.error('error updating menu');
            return rejectWithValue(err.response.data?.messsage||'failed to update menu')

        }
    }
})
// export const fetchMenu = createAsyncThunk('menus/:id', async (id,{rejectWithValue}) => {
//     console.log('fetch menu by id')
//     try{
//         console.log(API_URL)
//         const response = await fetch(`${API_URL}/menus/${id}`);
//         // console.log(response.json())
//         // if(!response.ok) throw new Error('failed to fetch menu by id');
//         console.log('response');
//         const data = await response.json();
//         console.log('data:', data)
//         return data;
//     }catch(err){
//         console.log('error');
//         return rejectWithValue(err.response.data?.message||'failed to fetch menu by id');
//     }

// });
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