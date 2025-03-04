import { Outlet} from 'react-router-dom';
import { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {useDispatch } from 'react-redux';
import {fetchMenus} from '../store/menuSlice';
const Layout = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchMenus());
    }, [dispatch]);
    return (
        <div className='app-container'>
            <Header />
            <main id="main">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
export default Layout;