import { useEffect, useState, useMemo } from 'react';
// import {useDispatch, useSelector } from 'react-redux';
// import {fetchMenus} from './menuSlice';
import {useDispatch, useSelector } from 'react-redux';
import {fetchMenus} from '../store/menuSlice';
import DisplayMenu from '../components/DisplayMenu';
import '../assets/pages/menus.css';
const Order = () => {

    const dispatch = useDispatch();
    // const {menus, loading, error} = useSelector((state)=>state.menus);
    const {menus, error} = useSelector((state)=>state.menus);
    const [index, setIndex] = useState(0);
    const handleSetIndex = (index) => {
        setIndex(index);
    }
    const now = new Date();
    const today = {
        day: now.getDay(),
        hour: now.getHours(),
        min: now.getMinutes()
    }
    const todayMenus = useMemo(() => {
        return menus.filter(menu=>{
            return menu.days.some(day=> day.day.position === today.day && day.open);
        });
    },[today.day, menus]);
    const nowMenus = useMemo(() => {
        return todayMenus.filter(menu=>{
            return menu.days.some(day=>{
                return (
                    (day.start.hour < today.hour || (day.start.hour === today.hour && day.start.min <= today.min))
                     &&
                     (day.end.hour > today.hour || (day.end.hour === today.hour && day.end.min > today.min))
                )
            })
        })
    },[today.hour, today.min, todayMenus])

    useEffect(() => {
        dispatch(fetchMenus());
    }, [dispatch]);
    // if(loading) return <p>Loading ....</p>;
    if(error) return <p>Error: {error}</p>

    return (
        <div className='display-menu'>
            <ul className="menu-tabs">
                {nowMenus.map((menu, i)=>(
                    <li onClick={() => handleSetIndex(i)} key={menu._id} style={{borderBottom: index===i ? '1px solid green' : 'none'}}> {menu.name}</li>
                ))}
            </ul>
            {nowMenus[index] ? <DisplayMenu menu={nowMenus[index]} order={true}/> : <p>menu not found</p>}
        </div>

    )
}
export default Order;