import { Link, useNavigate} from 'react-router-dom';
import { useState, useEffect } from 'react';
import DropDownMenu from './DropDownMenu';
// import { useSelector } from 'react-redux';
import useClickOutside from '../hooks/useClickOutside';
import { useDispatch } from 'react-redux';
import {verifyToken, logout} from '../store/authSlice';
import Icon from '@mdi/react';
import { mdiCart } from '@mdi/js';
const Header = () => {
    const dispatch= useDispatch();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showDropDown, setShowDropDown] = useState(false);
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
        setIsLoggedIn(false);
        dispatch(logout());
        navigate('/login');
    }
    useEffect(() => {
        const verifyTokenInterval = () => {
            if((Math.floor(Date.now() / 1000) >= localStorage.getItem('token-exp')) && isLoggedIn){
                console.log('past exp')
                try{
                    dispatch(verifyToken(localStorage.getItem('token')));
                }catch(err){
                    console.error('token not verifed', err);
                    // token.Object.assign(null);
                    setIsLoggedIn(false)
                    dispatch(logout())
                }
            }
        }
        const interval = setInterval(verifyTokenInterval, 10000);
        return ()=> clearInterval(interval);
        // console.log(isAuthenticated)
    }, [dispatch, isLoggedIn]);
    //runs once
    useEffect(() => {
        if(localStorage.getItem('token')){
            try{
                dispatch(verifyToken(localStorage.getItem('token')));
                setIsLoggedIn(true);
            }catch(err){
                console.error('token not verifed', err);
                setIsLoggedIn(false);
                dispatch(logout());
            }
        }
        // console.log(user)
    },[])
    return (
    <>
        <header>
            <nav>
                <ul>
                    <div className='link-group left'>
                        <button className='cart-button'>
                           <Icon path={mdiCart} size={1}></Icon> 
                        </button>
                        
                        {leftLinks.map(link=>(
                            <li key={link.name}>
                                <Link to={link.to}>{link.name}</Link>
                            </li>
                        ))}
                    </div>
                    <div className='link-group right'>
                        {isLoggedIn && <li onClick={handleShowDropDown}>Edit Menu</li>}
                        {showDropDown && <DropDownMenu ref={dropdownRef} close={setShowDropDown}/>}
                        {isLoggedIn ? 
                        <li onClick={handleLogout}> logout </li> : 
                        <li> <Link to="/login">Login</Link></li>}
                        {!isLoggedIn && <li><Link to="/register">Register</Link></li>}
                    </div>
                </ul>
            </nav>
        </header>
    </>
    )
}
export default Header;