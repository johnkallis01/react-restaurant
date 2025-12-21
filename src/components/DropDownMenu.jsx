import { useNavigate} from 'react-router-dom';
import { useEffect, forwardRef } from 'react';
import {useDispatch, useSelector } from 'react-redux';
import {fetchMenus} from '../store/menuSlice';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import '../assets/components/dropdown.css';

const DropDownMenu = forwardRef(function DropDownMenu({close}, dropdownRef) {
    const dispatch = useDispatch();
    const navigate=useNavigate();
    const {menus} = useSelector((state)=>state.menus);
    const handleLink = (data) => {
        console.log(data)
        navigate(`/menus/${data}`);
        close(false);
    }

    useEffect(() => {
        dispatch(fetchMenus());
    }, [dispatch]);
    // if(loading) return <p>Loading ....</p>;
    // if(error) return <p>Error: {error}</p>
    return createPortal(
        <ul className="dropdown-menu" ref={dropdownRef}>
            <li onClick={()=>handleLink('new')}>
                New Menu
            </li>
            {menus.map((menu)=>(
                <li key={menu._id} onClick={()=>handleLink(menu._id)}>
                    {menu.name}
                </li>
            ))}
        </ul>,
        document.getElementById('main')
    )
})

DropDownMenu.propTypes = {
    close: PropTypes.func.isRequired
}

export default DropDownMenu;