import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

//  const apiUrl = 'http://localhost:5000/api'
const apiUrl = import.meta.env.VITE_API_URL;
// const API_URL = 'https://react-restaurant-johnkallis01-johnkallis01s-projects.vercel.app/api/auth'
export const registerUser = createAsyncThunk('auth/register', async (userData, {rejectWithValue})=>{
    // console.log(userData)
    try{
        const response = await fetch(`${apiUrl}/auth/register`, {
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
    console.log(apiUrl)
    try{
        const response = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        console.log('x')
        const data = await response.json();
        console.log('login data')
        console.log(data)
        if(data.token){
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-exp', Math.floor(Date.now() / 1000)+3600)
            window.location.href='/';
            console.log('token found')
        }
        return data;
    }catch(err){
        return rejectWithValue(err.response.data?.message||'registeration failed');
    }
});
// export const verifyToken = createAsyncThunk('auth/verify', async (token, thunkAPI)=>{
//     console.log('authslice verify')
//     const {dispatch, rejectWithValue} = thunkAPI;
//     if(token){
//         console.log('if token',token)
//         try{
//             const response = await fetch(`${apiUrl}/auth/verify`,{
//                 method: 'POST',
//                 headers:{
//                     'Content-type': 'application/json',
//                     Authorization: `Bearer ${token}`
//                 }
//             })
//             console.log('y')
//             const data = await response.json();
//             // console.log(state.user)
//             console.log(data)
//             if(data.error){
//                 console.log(' throw error')
//                 throw new Error(data.error)
//             }
//             return data;
//         }catch(err){
//             // console.log('token err')
//             dispatch(logout());
//             return rejectWithValue(err.response.data?.message||'invalid token');
//         }
//     }
    
// })
export const verifyToken = createAsyncThunk(
  "auth/verify",
  async (token, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;

    if (!token) return rejectWithValue("No token provided");

    try {
      const response = await fetch(`${apiUrl}/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    const data = await response.json();
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Token verification failed");
      }

      
      return data;
    } catch (err) {
        console.log('authslice logout')
      dispatch(logout());
      return rejectWithValue(err.message || "Invalid token");
    }
  }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {user: null, token: localStorage.getItem('token')|| null,isAuthenticated: false, loading:false, error:  null},
    reducers: {
        logout: (state)=>{
            state.user = null;
            state.token = null;
            localStorage.clear();
        }
    },
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
        }).addCase(loginUser.fulfilled, (state,action)=>{
            state.user=action.payload;
            state.token=localStorage.getItem('token');
            state.isAuthenticated=true;
        }).addCase(verifyToken.fulfilled, (state, action)=>{
            state.user=action.payload;
            state.token=localStorage.getItem('token');
            state.isAuthenticated=true;
        }).addCase(verifyToken.rejected, (state)=>{
            state.user=null;
            state.token=null;
            state.isAuthenticated=false;
        })
    }
})
export const {logout} = authSlice.actions;
export default authSlice.reducer;