import PropTypes from 'prop-types';
import {useState, useEffect} from 'react';
import usePriceFormatter from '../../../hooks/usePriceFormatter';

const ModalDeleteItem = ({ item, closeCancel,closeDelete}) => {
    const {formatPrice} = usePriceFormatter();
    const areYouSure = "Are you sure you want to delete " + item.name + "?";
    const message = "Type '" + item.name + "' to delete";
    const [isDisabled, setIsDisabled] = useState(true);
    const handleOnChange = (e) => {
        if(e.target.value===item.name){
            setIsDisabled(false)
        }else if(!isDisabled){
            setIsDisabled(true);
        }
    }
    const handleEnter=(e)=>{
        if(e.key==='Enter' && !isDisabled){
            closeDelete();
        }
    }
    useEffect(() => {
        document.querySelector('input').focus();
        document.documentElement.style.overflow = 'hidden';
        return () => {
            document.documentElement.style.overflow = 'auto';
        } 
    },[])

    return (
        <div className='modal-wrapper'>
            <div className="modal delete-item">
                <div className='modal-title'>
                    <span>{item.name}</span>
                    <span>{formatPrice(item.price)}</span>
                </div>
                <div className="modal-content delete">
                    <p className='message'>{areYouSure}</p>
                    <p className='message'>{message}</p>
                    <div className='text-field'>
                        <input 
                            onChange={handleOnChange}
                            onKeyUp={handleEnter}
                        />
                    </div>
                    
                </div>
                <div className='modal-actions'>
                    <button className='btn' disabled={isDisabled} onClick={closeDelete}>Submit</button>
                    <button className='btn' onClick={closeCancel}>Cancel</button>
                </div>
            </div>
           
        </div>
    )
}
ModalDeleteItem.propTypes={
    item: PropTypes.object.isRequired,
    closeCancel: PropTypes.func.isRequired,
    closeDelete: PropTypes.func.isRequired
}
export default ModalDeleteItem;