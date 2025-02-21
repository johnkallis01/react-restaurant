import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://localhost:5000/api/auth';

export const registerUser = createAsyncThunk('auth/reigster', async (userData, {rejectWithValue})=>{
    console.log(userData)
    try{
        const {data} = await axios.post(`${API_URL}/register`, userData);
        console.log(data)
        return data;
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
        })
        // .addCase(loginUser.pending, (state)=>{
        //     state.loading=true;
        //     state.error=null;
        // }).addCase(loginUser.rejected, (state,action)=>{
        //     state.loading=false;
        //     state.error=action.payload;
        // }).addCase(loginUser.fulfilled, (state)=>{
        //     state.user=null;
        //     state.token=null;
        // })
    }
})
export default authSlice.reducer;