import { Link, useNavigate} from 'react-router-dom';
import { useState, useEffect } from 'react';
import DropDownMenu from './DropDownMenu';
// import { useSelector } from 'react-redux';
import Cart from './ui/Cart'
import useClickOutside from '../hooks/useClickOutside';
import { useDispatch, useSelector } from 'react-redux';
import {logout, verifyToken} from '../store/authSlice';
import {openCart, closeCart} from '../store/cartSlice';
import Icon from '@mdi/react';
import { mdiCart } from '@mdi/js';
const Header = () => {
    const dispatch= useDispatch();
    const [showDropDown, setShowDropDown] = useState(false);

    const {isCartOpen, error} = useSelector((state)=>state.cart);
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    // const {user} = useSelector((state)=>state.auth);
    // const token = localStorage.getItem('token');
    const dropdownRef=useClickOutside(()=>setShowDropDown(false));
    
    // const token = localStorage.getItem('token');
    const navigate=useNavigate();
    const leftLinks = [
        {to: '/', name: "Home"},
        {to: '/menus', name: "Menus"},
        {to: '/order', name: "Order"},
    ]
    const handleShowDropDown = () => {
        setShowDropDown(!showDropDown)
    }
    const handleLogout = () => {
        // localStorage.clear();
        dispatch(logout());
        navigate('/login');
    }
    const handleCartToggle = () => {
        console.log('cart button',isCartOpen)
        if(!isCartOpen){
            dispatch(openCart())
        }else{
            dispatch(closeCart());
           
        }
        
    }
    useEffect(() => {
        const verifyTokenInterval = () => {
            const tokenExp = Number(localStorage.getItem('token-exp'));
            if(Date.now() / 1000 >= tokenExp && isAuthenticated){
                console.log('past exp')
                dispatch(verifyToken(tokenExp))
                    .unwrap()
                    .catch(() => {
                        dispatch(logout());
                    });
            }
        }
        const interval = setInterval(verifyTokenInterval, 10000);
        return ()=> clearInterval(interval);
        // console.log(isAuthenticated)
    }, [dispatch]);
    //runs once
    // useEffect(() => {
    //     if(localStorage.getItem('token')){
    //         console.log('token check')
    //         try{
    //             dispatch(verifyToken(localStorage.getItem('token')));

    //         }catch(err){
    //             console.error('token not verifed', err);

    //             dispatch(logout());
    //         }
    //          console.log('end')
    //     }
       
    // },[])
    return (
    <>
        <header>
            <nav>
                <ul>
                    <div className='link-group left'>
                        <button className='cart-button' disabled={isCartOpen} onClick={() => handleCartToggle()}>
                           <Icon path={mdiCart} size={1}></Icon> 
                        </button>
                        {isCartOpen && <Cart/>}
                        {leftLinks.map(link=>(
                            <li key={link.name}>
                                <Link to={link.to}>{link.name}</Link>
                            </li>
                        ))}
                    </div>
                    <div className='link-group right'>
                        {isAuthenticated  && <li onClick={handleShowDropDown}>Edit Menu</li>}
                        {showDropDown && <DropDownMenu ref={dropdownRef} close={setShowDropDown}/>}
                        {isAuthenticated  ? 
                        <li onClick={handleLogout}> logout </li> : 
                        <li> <Link to="/login">Login</Link></li>}
                        {!isAuthenticated  && <li><Link to="/register">Register</Link></li>}
                    </div>
                </ul>
            </nav>
        </header>
    </>
    )
}
export default Header;