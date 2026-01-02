import { useState, useEffect, useMemo, useRef } from 'react';
import Icon from '@mdi/react';
import { mdiPlus, mdiMinus } from '@mdi/js';
import PropTypes from 'prop-types';
import '../../../assets/components/ui/modals.css';
import usePriceFormatter from '../../../hooks/usePriceFormatter.js';
import {addItem} from '../../../store/cartSlice';
import {useDispatch} from 'react-redux';


const ModalSelectItem = ({item, menu, close }) => {
    const dispatch = useDispatch();
    const {formatPrice} = usePriceFormatter();
    const [viewFlags, setViewFlags] = useState({
        options: false,
        addOns: false,
        removes: false,
        comments: false,
    })
    const handleTabFlags = (tab) => {
        setViewFlags({
            options: false,
            addOns: false,
            removes: false,
            comments: false,
            [tab]: true
        });
        console.log(viewFlags)
        console.log(tab, viewFlags[tab])
    }
    const [selectedItem, setSelectedItem] = useState({
        name: item.name,
        price: item.price,
        addOns: {options: item.addOns.map(opt => ({ ...opt, checked: false })), choices: []},
        removes: {options:item.removes.map(opt => ({ ...opt, checked: false })), choices: []},
        options: {options: item.options.map(opt => ({ ...opt,
             
            checked: false })), choices: []},
        comments: '', 
        qty: 1,
        menu: {
            name: menu.name,
            _id: menu._id
        }
    });
    const handleAddOnCheckbox = ()=>{

    }
    const handleOptionsCheckbox = (foo, i) => {
        console.log('handleOpChecks', i , foo)
        console.log(selectedItem.options.options[i])
        console.log(selectedItem.options.choices)
        selectedItem.options.choices.push({...foo, option_id: selectedItem.options.options[i]._id })
        selectedItem.options.choices.filter(choice=>choice._id===foo._id);
        console.log('updated',selectedItem)
        
        console.log(selectedItem.options.choices)

        // selectedItem.options.options[i]._id===
        //add to choices and check for choice of same option

    }
    const handleOnChangeComments = (e) => {
        console.log(e.target.value)
        setSelectedItem(prev=>({
            ...prev, comments: e.target.value
        }))
    }
    const handleCancel =() => {
        close(false);
    }
    const handleSubmit = () => {
        console.log('submit', selectedItem)
        dispatch(addItem(selectedItem))
        close(false)
    }
    const handleIncQty = () => {
        setSelectedItem((prev)=>({
            ...prev,
            qty: prev.qty < 9 ? prev.qty+1 : prev.qty,
        }))
    }
    const handleDecQty = () => {
        setSelectedItem((prev) => ({
            ...prev,
            qty: prev.qty > 1 ? prev.qty-1 : prev.qty,
        }))
    }
    const OARC = useRef(['options','addOns','removes','comments']);
    //disable scrolling behind modal
    useEffect(() => {
        // console.log(document.querySelector('textarea'));
        let comment = document.querySelector('textarea')
        if(comment){
           comment.focus();
           comment.setSelectionRange(comment.value.length, comment.value.length);
        }
    },[viewFlags])
    useEffect(() => {
        document.documentElement.style.overflow = 'hidden';
        return () => {
            document.documentElement.style.overflow = 'auto';
        } 
    },[])
    // useEffect(() => {
    //     dispatch(setCartItem({
    //         _id: item._id,
    //         name: item.name,
    //         price: item.price,
    //     }))
    // })
    useMemo(() => {
        // console.log('useeffect')
        OARC.current=OARC.current.filter(oarc=>(item[oarc]?.length > 0 || oarc==='comments'))
        // console.log(OARC.current)
        handleTabFlags(OARC.current[0])
        // console.log(viewFlags)
    }, []);
    return (
        <>
         <div className='modal-wrapper'>
            <div className='modal select-item'>
                <div className='modal-title'>
                    <span>{selectedItem.name}</span>
                    <span>{formatPrice(selectedItem.price)}</span>
                </div>
                <div className='qty'>
                    <span className='qty-title'>Quantity:</span>
                    <button className='btn qty' onClick={handleDecQty}>
                        <Icon path={mdiMinus} size={0.4}/>
                    </button>
                    <span className='btn qty'>{selectedItem.qty}</span>
                    <button className='btn qty' onClick={handleIncQty}>
                        <Icon path={mdiPlus} size={0.4}/>
                    </button>
                </div>
                <div className='modal-content select'>
                    <div className='tab-titles select'>
                        {OARC.current.map((oarc, i)=>(
                            // (oarc.hasValue &&
                            <button key={i}
                                style={{borderBottom: viewFlags[oarc] ? '0.0625rem solid' : 'none'}}
                                onClick={()=>handleTabFlags(oarc)}>{oarc}</button>
                        // )
                        ))}
                    </div>
                    <div className="tab-container select">
                        {OARC.current.map((oarc,i)=>{
                            if(!viewFlags[oarc]){ return null; }
                            let content;
                            console.log('content', selectedItem.options)
                            if(oarc==='options'){
                                content=(
                                    <div className='option select'>
                                    {selectedItem.options.options.map((option, opIndex)=>
                                        <div key={option._id}>
                                            <span className='option-name select'>{option.name}</span>
                                            {option.content?.map((value,i)=>(
                                                <div className="checkbox select" key={i}>
                                                    <input type='checkbox' value={selectedItem.options} name={value.name} onChange={(e) => handleOptionsCheckbox(value,opIndex, e)}/>
                                                    <label htmlFor={value.name}>{value.name}</label>
                                                </div>
                                                
                                            ))}
                                        </div> 
                                    )}
                                    </div>
                                )
                            }
                            else if (oarc==='comments'){
                                content= (
                                    <div className="comment-text">
                                        <textarea onChange={(e)=>handleOnChangeComments(e)} value={selectedItem.comments}/>
                                    </div>
                            )
                            }
                            else if (oarc==='addOns'){
                                content=(
                                    <div className='option select'>
                                    {selectedItem.addOns.options.map(addOn=>
                                        <div className="checkbox select" key={addOn._id}>
                                            <input type='checkbox' name={addOn.name} onChange={handleAddOnCheckbox}/>
                                            <label htmlFor={addOn.name}>{addOn.name + (addOn.price>0 ? ' - '+formatPrice(addOn.price) : '')}</label>
                                        </div>
                                    )}
                                    </div>
                                )
                            }
                            else if (oarc==='removes'){
                                content=<div>removes</div>
                            }
                            else{
                                content=<div>error</div>
                            }
                            return (
                                <div key={i}>{content}</div>
                            )
                        })}
                    </div>
                </div>
                <div className='modal-actions'>
                    <button className='btn' onClick={handleSubmit}>Submit</button>
                    <button className='btn' onClick={handleCancel}>Cancel</button>
                </div>
            </div>
         </div>
        </>
    )
}
ModalSelectItem.propTypes = {
    menu: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired,
}
export default ModalSelectItem