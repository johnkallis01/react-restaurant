import ReactDOM from "react-dom/client";
import {useEffect} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';4
import ProtectRoute from './components/ProtectRoute';
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Menus from "./pages/Menus";
import EditMenu from "./pages/EditMenu";
import NewMenu from "./pages/NewMenu";
import Order from "./pages/Order";
import NoPage from "./pages/NoPage";
import './assets/styles.css';
import { Provider, useDispatch } from 'react-redux';
import {verifyToken} from './store/authSlice';
import store from './store/store';
import Register from "./pages/Register";
export default function App(){
    const dispatch = useDispatch();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token){
            console.log('send verify', token)
            dispatch(verifyToken(token));
        }
    },[dispatch]);
    useEffect(() => {
        sessionStorage.setItem('active', 'true');
        const handleBeforeUnload = () => {
            console.log('handleBeforeUnload')
            if(!sessionStorage.getItem('active')) localStorage.clear();
        }
        const handleUnload = () => {
            console.log('remove session storage')
            sessionStorage.clear()
        }
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('unload', handleUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('unload', handleUnload);
        }
     },[])
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Layout/>}>

                    <Route index element={<Home/>}/>
                    <Route path="login" element={<Login/>}/>
                    <Route path="register" element={<Register/>}/>
                    <Route path="menus" element={<Menus/>}/>
                    <Route path="*" element={<NoPage/>}/>

                    <Route element={<ProtectRoute />}>
                        <Route path="menus/:id" element={<EditMenu/>}/>
                        <Route path="order" element={<Order/>}/>
                        <Route path="menus/new" element={<NewMenu/>}/>
                    </Route>            
                    
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
       <App /> 
    </Provider>
);