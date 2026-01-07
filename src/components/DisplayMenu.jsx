// import {useEffect, useState} from 'react';
import {useState} from 'react';
import PropTypes from 'prop-types';
import DisplaySchedule from './DisplaySchedule';
import ModalSelectItem from './ui/modals/ModalSelectItem';
import '../assets/pages/menus.css';
import usePriceFormatter from '../hooks/usePriceFormatter'
// import {useEffect} from 'react'
const DisplayMenu = ({menu, order}) => {
    const {formatPrice} = usePriceFormatter();
    const [openModal, setOpenModal] = useState(false);
    const [modalItem, setModalItem] = useState(null);
    const handleChooseItem =(item, section) => {
        console.log('handle choose item', item, section)
        const newItem = {
            ...item,
            options: section.options?.length & section.options.map(option=>({
                ...option, choice: {}
            }))
        }
        setModalItem(newItem);
        setOpenModal(true);
        
        // console.log('click', openModal)
    }
    const handleCloseModal = (data) => {
        // console.log(data)
        setOpenModal(data);
    }
    // useEffect(() => {
    //     console.log(order)
    // })
    if(!menu) return <p>No menu data</p>
    return(
        <>
        <div className="menu-page">
            {menu?.days?.length > 0 && <DisplaySchedule days={menu.days} />}
            {menu?.sections?.map(section=>(
                <div className="section-container" key={section._id}>
                    <p className='section-name'>{section.name}</p>
                    <div className="section-body">
                        {section.items.map(item=>(
                            <button key={item._id}
                                className={`item-container ${!order ? 'disabled' : ''}`} 
                                disabled={!order} 
                                onClick={order ? () => handleChooseItem(item, section) : null}
                                >
                                <p className='item-name'>
                                    <span>{item.name}</span>
                                    <span>{formatPrice(item.price)}</span>
                                </p>
                                <p className='item-description'>
                                    {item.description}
                                </p>
                            </button>
                        ))}   
                    </div>
                </div>
            ))}
            {openModal && <ModalSelectItem item={modalItem} menu={menu} close={handleCloseModal}/>}
        </div>
           
        </>
    )
}
DisplayMenu.propTypes = {
    menu: PropTypes.object.isRequired,
    order: PropTypes.bool.isRequired,
}
export default DisplayMenu;