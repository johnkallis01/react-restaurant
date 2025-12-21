import { useState,useEffect, useRef } from 'react';
// import {useDispatch, useSelector } from 'react-redux';
// import {fetchMenus} from './menuSlice';
import { useSelector } from 'react-redux';
import DisplayMenu from '../components/DisplayMenu';
import '../assets/pages/menus.css';
const Menus = () => {
    // const {menus, loading, error} = useSelector((state)=>state.menus);
    const {menus, error} = useSelector((state)=>state.menus);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [index, setIndex] = useState(0);
    const menuTabsRef = useRef(null);
    const handleSetIndex = (index) => {
        setIndex(index);
    }
    useEffect(() => {
        // console.log("innerWidth:", window.innerWidth);
        // console.log("clientWidth (without scrollbar):", document.documentElement.clientWidth);
    },[])
    useEffect(() => {
        const handleUpdateWindowWidth = () => {
            setWindowWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleUpdateWindowWidth);
        window.addEventListener('orientationchange', handleUpdateWindowWidth);
        window.addEventListener('change', handleUpdateWindowWidth);
        return () => {
            window.removeEventListener('resize', handleUpdateWindowWidth);
            window.removeEventListener('orientationchange', handleUpdateWindowWidth);
            window.removeEventListener('change', handleUpdateWindowWidth);
        }
    }, [])
    useEffect(() => {
        // console.log(menuTabsRef.current.clientWidth, windowWidth)
        if(menuTabsRef.current.clientWidth>=parseInt(window.innerWidth)-25) menuTabsRef.current.style.justifyContent='flex-start';
        else menuTabsRef.current.style.justifyContent='center';
    }, [menus])
    // if(loading) return <p>Loading ....</p>;
    if(error) return <p>Error: {error}</p>
    
    return (
        <div className='display-menu'>
            <div className="menu-tabs">
                
                <ul ref={menuTabsRef} style={{}}>
                    {menus.map((menu, i)=>(
                        <li onClick={() => handleSetIndex(i)} key={menu._id} style={{borderBottom: index===i ? '1px solid green' : 'none'}}> {menu.name}</li>
                    ))}
                </ul>
            </div>
            {menus[index] ? <DisplayMenu menu={menus[index]} order={false}/> : <p>menu not found</p>}
        </div>

    )
}
export default Menus;