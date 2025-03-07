import { Link, useNavigate} from 'react-router-dom';
import { useState, useEffect } from 'react';
import DropDownMenu from './DropDownMenu';
import useClickOutside from '../hooks/useClickOutside';
const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showDropDown, setShowDropDown] = useState(false);
    const token = localStorage.getItem('token');
    const dropdownRef=useClickOutside(()=>setShowDropDown(false));
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
        localStorage.clear();
        setIsLoggedIn(false);
        navigate('/login');
    }
    useEffect(() => {
        if(token) setIsLoggedIn(true);
        else setIsLoggedIn(false);
    }, [token]);
    return (
    <>
        <header>
            <nav>
                <ul>
                    <div className='link-group left'>
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