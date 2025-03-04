import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Menus from "./pages/Menus";
import EditMenu from "./pages/EditMenu";
import Order from "./pages/Order";
import NoPage from "./pages/NoPage";
import './assets/styles.css';
import { Provider } from 'react-redux';
import store from './store/store';
import Register from "./pages/Register";
export default function App(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Layout/>}>
                    <Route index element={<Home/>}/>
                    <Route path="login" element={<Login/>}/>
                    <Route path="register" element={<Register/>}/>
                    <Route path="menus" element={<Menus/>}/>
                    <Route path="menus/:id" element={<EditMenu/>}/>
                    <Route path="order" element={<Order/>}/>
                    <Route path="*" element={<NoPage/>}/>
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