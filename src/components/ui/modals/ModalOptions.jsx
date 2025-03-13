import PropTypes from 'prop-types';
import {useState, useEffect} from 'react';
import TextField from "../TextField";
import Icon from '@mdi/react';
import { mdiPlus, mdiClose } from '@mdi/js';
import EditOption from './EditOption';
// import usePriceFormatter from '../../../hooks/usePriceFormatter';

const ModalOptions = ({ item, closeCancel,closeDelete}) => {
    const title = `Add Options to ${item.name}`
    // const [isDisabled, setIsDisabled] = useState(true);
    const [newOptionFlag, setNewOptionFlag] = useState(true);
    const [newOption, setNewOption] = useState({
        name: '', req: false, content: []
    })
    // var emptyValue = 
   
    useEffect(() => {
        document.querySelector('input').focus();
    },[newOptionFlag]);
    useEffect(() => {
        // console.log(item)
        document.querySelector('input').focus();
        if(item.options.length>0) setNewOptionFlag(false);
        //stop scrolling behind modal
        document.documentElement.style.overflow = 'hidden';
        return () => {
            document.documentElement.style.overflow = 'auto';
        } 
    },[])

    return (
        <div className='modal-wrapper'>
            <div className="modal options">
                <div className='modal-title options'>
                    <span>{title}</span>
                    <button onClick={()=>setNewOptionFlag(!newOptionFlag)}>
                        <Icon path={mdiPlus} size={1} />
                    </button>
                </div>
                <div className="modal-content options">
                    {newOptionFlag && <EditOption option={newOption} setOption={setNewOption} isNew={true}/>}
                        
                    {(item.options.length > 0) && 
                        item.options.map((op)=>
                            <span className='option' key={op._id}>
                                <EditOption option={op}  isNew={false}/>
                                {/* <div className="content-row">
                                    <span className="text-field options" style={{width: '22.7rem'}}>
                                        <button className='button-close'>
                                            <Icon path={mdiClose} size={0.4} />
                                        </button>
                                        <span>{op.name}</span>
                                    </span>
                                    <div className="checkbox-button">
                                        <div className="checkbox">
                                            <label htmlFor="req">Required:</label>
                                            <input type="checkbox" name="req" />
                                        </div>
                                        <div className='submit-button'>
                                            <button>
                                                <span>{'New Value'}</span>
                                            </button> 
                                        </div>
                                    </div>
                                </div> */}
                                {/* <div className="content-row last value">
                                    {(op.content.length > 0) &&
                                        op.content.map((val)=>
                                            <div key={val.name}>
                                                <span className='option-content'>
                                                    <button className='button-close'>
                                                        <Icon path={mdiClose} size={0.4}/>
                                                    </button>
                                                    {val.name}
                                                </span>
                                                
                                            </div>
                                        )
                                    }
                                </div> */}
                            </span>
                        )
                    }
                </div>
                
                <div className='modal-actions'>
                    <button className='btn' onClick={closeDelete}>Submit</button>
                    <button className='btn' onClick={closeCancel}>Cancel</button>
                </div>
            </div>
           
        </div>
    )
}
ModalOptions.propTypes={
    item: PropTypes.object.isRequired,
    closeCancel: PropTypes.func.isRequired,
    closeDelete: PropTypes.func.isRequired
}
export default ModalOptions;