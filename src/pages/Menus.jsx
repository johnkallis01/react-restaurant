import { useState } from 'react';
// import {useDispatch, useSelector } from 'react-redux';
// import {fetchMenus} from './menuSlice';
import { useSelector } from 'react-redux';
import DisplayMenu from '../components/DisplayMenu';
import '../assets/pages/menus.css';
const Menus = () => {
    // const {menus, loading, error} = useSelector((state)=>state.menus);
    const {menus, error} = useSelector((state)=>state.menus);
    const [index, setIndex] = useState(0);
    const handleSetIndex = (index) => {
        setIndex(index);
    }
    // if(loading) return <p>Loading ....</p>;
    if(error) return <p>Error: {error}</p>
    
    return (
        <div className='display-menu'>
            <div className="menu-tabs">
                <ul>
                    {menus.map((menu, i)=>(
                        <li onClick={() => handleSetIndex(i)} key={menu._id} style={{borderBottom: index===i ? '1px solid green' : 'none'}}> {menu.name}</li>
                    ))}
                </ul>
            </div>
            {menus[index] ? <DisplayMenu menu={menus[index]} order={true}/> : <p>menu not found</p>}
        </div>

    )
}
export default Menus;