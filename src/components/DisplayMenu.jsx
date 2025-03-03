import {useState} from 'react';
import PropTypes from 'prop-types';
import DisplaySchedule from './DisplaySchedule';
import ModalSelectItem from './ui/modals/ModalSelectItem';
import '../assets/components/displaymenu.css';
// import {useEffect} from 'react'
const DisplayMenu = ({menu, order}) => {
    
    const [openModal, setOpenModal] = useState(false);
    const [modalItem, setModalItem] = useState(null);
    const handleChooseItem =(item) => {
        setOpenModal(true);
        setModalItem(item);
        // console.log('click', openModal)
    }
    const handleCloseModal = (data) => {
        // console.log(data)
        setOpenModal(data);
    }
    if(!menu) return <p>No menu data</p>
    return(
        <>
        <div className="menu-page">
            {menu?.days?.length > 0 && <DisplaySchedule days={menu.days} />}
            {menu?.sections?.map(section=>(
                <div className="section" key={section._id}>
                    <p className='section-name'>{section.name}</p>
                    <div className="section-container">
                        {section.items.map(item=>(
                            <div className={`item-container ${order ? '' : 'disabled'}`} 
                                key={item._id} disabled={!order} 
                                onClick={()=>handleChooseItem(item)}
                                >
                                    {/* style={{cursor: order ? 'pointer' : 'default'}} */}
                                <p className='item-name'>
                                    <span>{item.name}</span>
                                    <span>{item.price}</span>
                                </p>
                                <p className='item-description'>
                                    {item.description}
                                </p>
                            </div>
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