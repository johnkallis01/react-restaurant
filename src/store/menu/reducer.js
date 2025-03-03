import { FETCH_MENUS_REQUEST, FETCH_MENUS_SUCCESS, FETCH_MENUS_FAILURE } from './actionTypes';

// const API_URL = 'http://localhost:8080/api/menus';

// export const fetchMenus = createAsyncThunk('/', async ({rejectWithValue})=>{
//     console.log('fetch menus');
//     try{
//         const response = await fetch(`${API_URL}`,{
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//         });
//         const data = await response.json();
//         console.log(data);
//     }catch(err){
//         return rejectWithValue(err.response.data?.message||'failed to fetch menus');
//     }
// });
const initialState = {
    menus: [],
    loading: false,
    error: null,
};
const menuReducer = (state=initialState, action) => {
    switch(action.type){
        case FETCH_MENUS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case FETCH_MENUS_SUCCESS:
            return {
                ...state,
                loading: false,
                menu: action.payload,
            }
        case FETCH_MENUS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        default:
            return state;
    };

}
export default menuReducer;