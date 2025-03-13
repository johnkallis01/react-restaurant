import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

// const API_URL = process.env.REACT_APP_API_URL;
const apiUrl = import.meta.env.VITE_API_URL;
// const API_URL = 'https://react-restaurant-johnkallis01-johnkallis01s-projects.vercel.app/api/auth'
export const registerUser = createAsyncThunk('auth/register', async (userData, {rejectWithValue})=>{
    console.log(userData)
    try{
        const response = await fetch(`${apiUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        console.log(data)
        if(data?.message) alert(data.message);
        else window.location.href='/';
    }catch(err){
        return rejectWithValue(err.response.data?.message||'registeration failed');
    }
});
export const loginUser = createAsyncThunk('auth/login', async (userData, {rejectWithValue})=>{
    console.log(userData)
    try{
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        if(data.token){
            localStorage.setItem('token', data.token)
            window.location.href='/';
        }
    }catch(err){
        return rejectWithValue(err.response.data?.message||'registeration failed');
    }
});
const authSlice = createSlice({
    name: 'auth',
    initialState: {user: null, token: localStorage.getItem('token')|| null, loading:false, error:  null},
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state) =>{
            state.loading=true;
            state.error=null;
        }).addCase(registerUser.fulfilled, (state,action)=>{
            state.loading=false;
            state.error = action.payload;
        }).addCase(loginUser.pending, (state)=>{
            state.loading=true;
            state.error=null;
        }).addCase(loginUser.rejected, (state,action)=>{
            state.loading=false;
            state.error=action.payload;
        }).addCase(loginUser.fulfilled, (state)=>{
            state.user=null;
            state.token=null;
        })
    }
})
export default authSlice.reducer;