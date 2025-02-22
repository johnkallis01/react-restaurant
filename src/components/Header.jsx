import { Link} from 'react-router-dom';
import { useState, useEffect } from 'react';
const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const token = localStorage.getItem('token');
    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
    }
    useEffect(() => {
        if(token) setIsLoggedIn(true);
        else setIsLoggedIn(false)
    }, [token]);
    return (
    <>
        <header>
            <nav>
                <ul>
                    <div className='link-group left'>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                    </div>
                    <div className='link-group right'>
                        {isLoggedIn ? 
                        <li onClick={handleLogout}> logout </li> : 
                        <li> <Link to="/login">Login</Link></li>}
                        <li>
                            <Link to="/register">Register</Link>
                        </li>
                    </div>
                </ul>
            </nav>
        </header>
    </>
    )
}
export default Header;