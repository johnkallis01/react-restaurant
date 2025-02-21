import { Link} from 'react-router-dom';
const Header = () => {
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
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
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