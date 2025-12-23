import PropTypes from 'prop-types';
import {useState, useEffect, useCallback} from 'react';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import EditOption from './EditOption';
// import { Option } from '../../../models/Tabs';

const ModalOptions = ({ item, closeCancel, closeSubmit}) => {
    const title = `Add Options to ${item.name}`;
    const [localItem, setLocalItem] = useState(item);
    const [newOptionFlag, setNewOptionFlag] = useState(true);
    // const [isItem, setIsItem] = useState(false);
    // const [newOption, setNewOption] = useState(new Option());

    const handleUpdateOption = useCallback((option) => {
        console.log(!!localItem.section_id)
        setLocalItem(prev=>({
            ...prev,
            options: prev.options.map(op=>(
                op._id===option._id ? option : op
            ))
        }))
    },[]);

    const handleAddNewOption = useCallback((op) => {
        // console.log(op);
        console.log(!!localItem.section_id)
        setLocalItem(prev=>({
            ...prev,
            options: [...prev.options, op]
        }))
    },[]);
    useEffect(() => {
        console.log(item.section_id)
    },[item.section_id])
    useEffect(() => {
        document.querySelector('input').focus();
    },[newOptionFlag]);
    useEffect(() => {
        document.querySelector('input').focus();
        if(item.options.length>0) setNewOptionFlag(false);
        //stop scrolling behind modal
        document.documentElement.style.overflow = 'hidden';
        return () => {
            document.documentElement.style.overflow = 'auto';
        } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return (
        <div className='modal-wrapper'>
            <div className="modal options">
                <div className='modal-title options'>
                    <span>{title + !!localItem.section_id}</span>
                    <button onClick={()=>setNewOptionFlag(!newOptionFlag)} disabled={localItem.options.length < 1}>
                        <Icon path={mdiPlus} size={1} />
                    </button>
                </div>
                <div className="modal-content options">
                    {newOptionFlag && 
                        <EditOption 
                            addOption={(op)=>handleAddNewOption(op)}
                            isNew={true}
                        />}
                    {(localItem.options.length > 0) && 
                        localItem.options.map((op)=>
                            <span className='option' key={op._id}>
                                <EditOption 
                                    option={op}
                                    isNew={false}
                                    updateOption={handleUpdateOption}/> 
                            </span>
                        )
                    }
                </div>
                
                <div className='modal-actions'>
                    <button className='btn' onClick={()=>closeSubmit(localItem)}>Submit</button>
                    <button className='btn' onClick={closeCancel}>Cancel</button>
                </div>
            </div>
           
        </div>
    )
}
ModalOptions.propTypes={
    item: PropTypes.object.isRequired,
    closeCancel: PropTypes.func.isRequired,
    closeSubmit: PropTypes.func.isRequired
}
export default ModalOptions;