import { FETCH_MENUS_REQUEST, FETCH_MENUS_SUCCESS, FETCH_MENUS_FAILURE } from './actionTypes';
const API_URL = 'http://localhost:8080/api/menus';
export const fetchMenu=()=> async (dispatch) => {
    dispatch({type: FETCH_MENUS_REQUEST});
    try {
        const response = await fetch(`${API_URL}`);
        const data = await response.json();
        dispatch({type: FETCH_MENUS_SUCCESS, payload: data})
    }catch(err){
        dispatch({type: FETCH_MENUS_FAILURE, payload: err.message});
    }
}