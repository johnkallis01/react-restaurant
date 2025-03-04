import { useNavigate} from 'react-router-dom';
import { useEffect } from 'react';
import {useDispatch, useSelector } from 'react-redux';
import {fetchMenus} from '../store/menuSlice';
import { createPortal } from 'react-dom';
import '../assets/components/dropdown.css';

const DropDownMenu = ({close}) => {
    const dispatch = useDispatch();
    const navigate=useNavigate();
    const {menus} = useSelector((state)=>state.menus);
    const handleLink = (data) => {
        navigate(`/menus/${data}`);
        close(false);
    }

    useEffect(() => {
        dispatch(fetchMenus());
    }, [dispatch]);
    // if(loading) return <p>Loading ....</p>;
    // if(error) return <p>Error: {error}</p>
    return createPortal(
        <ul className="dropdown-menu">
            <li className='edit-menu'>
                <div>new menu</div>
            </li>
            {menus.map((menu)=>(
                <li className='edit-menu' key={menu._id} onClick={()=>handleLink(menu._id)}>
                    {menu.name}
                </li>
            ))}
        </ul>,
        document.getElementById('main')
    )
}



export default DropDownMenu;