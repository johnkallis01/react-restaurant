import { useState, useEffect, useMemo } from 'react';
import Icon from '@mdi/react';
import { mdiPlus, mdiMinus } from '@mdi/js';

import PropTypes from 'prop-types';
import '../../../assets/components/ui/modals.css';

const ModalSelectItem = ({item, menu, close }) => {
    
    const [viewFlags, setViewFlags] = useState({
        options: false,
        addOns: false,
        removes: false,
        comments: false,
    })
    const handleViewOptions = () => {
        setViewFlags({
            options: true,
            addOns: false,
            removes: false,
            comments: false,
        })
    }
    const handleViewAddOns = () => {
        setViewFlags({
            options: false,
            addOns: true,
            removes: false,
            comments: false,
        })
    }
    const handleViewRemoves = () => {
        setViewFlags({
            options: false,
            addOns: false,
            removes: true,
            comments: false,
        })
    }
    const handleViewComments = () => {
        setViewFlags({
            options: false,
            addOns: false,
            removes: false,
            comments: true,
        })
    }
    const [selectedItem, setSelectedItem] = useState({
        name: item.name,
        price: item.price,
        addOns: [],
        removes: [],
        options: item.options,
        comments: '',
        qty: 1,
        menu: {
            name: menu.name,
            _id: menu._id
        }
    });
    const handleCancel =() => {
        close(false);
    }
    const handleSubmit = () => {
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
    // const OARC = useMemo(() => {   
    //     return(
    // [
    //     {name: 'options', setFlag: handleView('options'), flag: viewFlags.options},
    //     {name: 'addOns', setFlag: handleView('addOns'), flag: viewFlags.addOns},
    //     {name: 'removes', setFlag: handleView('removes'), flag: viewFlags.removes},
    //     {name: 'comments', setFlag: handleView('comments'), flag: viewFlags.comments, hasValue: true},
    // ])},[viewFlags])
    const OARC = useMemo(() => {   
        return(
    [
        {name: 'options', setFlag: handleViewOptions, flag: viewFlags.options},
        {name: 'addOns', setFlag: handleViewAddOns, flag: viewFlags.addOns},
        {name: 'removes', setFlag: handleViewRemoves, flag: viewFlags.removes},
        {name: 'comments', setFlag: handleViewComments, flag: viewFlags.comments, hasValue: true},
    ])},[viewFlags])
    useEffect(() => {
        document.documentElement.style.overflow = 'hidden';
        return () => {
            document.documentElement.style.overflow = 'auto';
        } 
    },[])
    useMemo(() => {
        OARC.forEach(oarc=>{
            (item[oarc.name]?.length > 0 || oarc.hasValue) ? oarc.hasValue = true : oarc.hasValue = false
        })
        console.log(OARC)
    }, [item, OARC]);
    useEffect(() => {
            if(OARC?.length > 0){
                setViewFlags((prev) => ({
                    ...prev,
                    [OARC[0].name]: true,
                }))
            }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return (
        <>
         <div className='modal-wrapper'>
            <div className='modal select-item'>
                <div className='modal-title'>
                    <span>{selectedItem.name}</span>
                    <span>{selectedItem.price}</span>
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
                <div className='modal-content'>
                    <div className='tabs'>
                        <div className='tab-titles'>
                            {OARC.map((oarc, i)=>(
                                (oarc.hasValue ?
                                <button key={i}
                                    style={{borderBottom: oarc.flag ? '0.0625rem solid' : 'none'}}
                                    onClick={oarc.setFlag}>{oarc.name}</button> : null
                            )))}
                        </div>
                        <div className="tab-container">
                            {OARC.map((oarc,i)=>(
                                (oarc.hasValue && oarc.flag) && (
                                     <div key={i}>
                                        {(oarc.name === 'options') && (
                                            <div> options</div>
                                        )}
                                        {(oarc.name === 'comments') && (
                                            <input type="text-area" />
                                        )}
                                        {(oarc.name !== 'comments' && oarc.name !== 'options') && (
                                            <div>
                                                addons or removes
                                            </div>
                                        )}
                                    </div>
                                ) 
                            ))}

                        </div>
                        
                                
                        
                        

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