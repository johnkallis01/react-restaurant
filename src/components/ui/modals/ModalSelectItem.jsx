import { useState, useEffect, useMemo, useRef } from 'react';
import {useDispatch} from 'react-redux';
import usePriceFormatter from '../../../hooks/usePriceFormatter.js';
import {addItem} from '../../../store/cartSlice';
import Icon from '@mdi/react';
import { mdiPlus, mdiMinus } from '@mdi/js';
import PropTypes from 'prop-types';
import '../../../assets/components/ui/modals.css';

const ModalSelectItem = ({item, menu, close }) => {
    const dispatch = useDispatch();
    const {formatPrice} = usePriceFormatter();
    const [isDisabled, setIsDisabled] = useState(true);
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
        // console.log(viewFlags)
        // console.log(tab, viewFlags[tab])
    }
    const [selectedItem, setSelectedItem] = useState({
        name: item.name,
        price: item.price,
        addOns: {options: item.addOns.map(opt => ({ ...opt, checked: false })), choices: []},
        removes: {options:item.removes.map(opt => ({ ...opt, checked: false })), choices: []},
        options: {options: item.options.map(opt => ({ name: opt.name, req: opt.req, _id: opt._id, content: opt.content.map(content=>({
            ...content, checked: false, optionName: opt.name
        })),choice: {}
        }))},
        comments: '', 
        qty: 1,
        menu: {
            name: menu.name,
            _id: menu._id
        }
    });
    const handleAddOnCheckbox = (addOn)=>{
        console.log('checkbox1',selectedItem)
        selectedItem.price = String(Number(selectedItem.price)+Number(addOn.price));
        console.log('checkbox2',selectedItem)
        selectedItem.addOns.choices.push(addOn)
    }
    const handleOnChangeComments = (e) => {
        // console.log(e.target.value)
        setSelectedItem(prev=>({
            ...prev, comments: e.target.value
        }))
    }
    const handleCancel =() => {
        close(false);
    }
    const handleSubmit = () => {
        // console.log('submit', selectedItem)
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
    const handleOptionsCheckbox = (content, index) => {
        console.log('handle options checkbox',content)
        console.log(selectedItem.options.options[index])
        // selectedItem.options.options[index].choice=content;
        setSelectedItem((prev)=>{
            const optionsCopy=[...prev.options.options];
            optionsCopy[index]={
                ...optionsCopy[index],
                choice: optionsCopy[index].choice === content ? null : content,
            }
            return {
                ...prev,
                options: {
                    ...prev.options,
                    options: optionsCopy,
                }
            }
        })
    }
    const OARC = useRef(['options','addOns','removes','comments']);
   //focus the text area on the comments tab
    useEffect(() => {
        // console.log(document.querySelector('textarea'));
        let comment = document.querySelector('textarea')
        if(comment){
           comment.focus();
           comment.setSelectionRange(comment.value.length, comment.value.length);
        }
    },[viewFlags])
    
    //disable scrolling behind modal
    useEffect(() => {
        //need to add back scroll bar
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.documentElement.style.overflow = 'hidden';
        document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
        return () => {
            document.documentElement.style.overflow = 'auto';
            document.documentElement.style.paddingRight = 0;
        } 
    },[]);
    // useEffect(() => {
    //     selectedItem.options.forEach((option) => (
            
    //     ))
    // },[])
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
    useEffect(() => {
        console.log('useEffect for isDisabled')
        const allRequiredFilled = selectedItem.options.options.every((option) =>
            !option.req || (option.choice && Object.keys(option.choice).length > 0)
        );
        setIsDisabled(!allRequiredFilled);
    },[selectedItem.options.options])
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
                            console.log('content', selectedItem)
                            if(oarc==='options'){
                                // let checkboxValue = 
                                content=(
                                    <div className='option select'>
                                    {selectedItem.options.options.map((option, opIndex)=>
                                        <div key={option._id}>
                                            <span className='option-name select'>{option.name}</span>
                                            {option.content?.map((content,i)=>(
                                                <div className="checkbox select" key={i}>
                                                    <input type='checkbox' name={content.name} checked={content===option.choice} onChange={() => handleOptionsCheckbox(content, opIndex)}/>
                                                    <label htmlFor={content.name}>{content.name}</label>
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
                                            <input type='checkbox' name={addOn.name} onChange={(handleAddOnCheckbox(addOn))}/>
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
                    <button className='btn' onClick={handleSubmit} disabled={isDisabled}>Submit</button>
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