import PropTypes from 'prop-types';
import {useState, useEffect, useCallback} from 'react';

import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
// import {useDispatch } from 'react-redux';
import '../../../assets/components/ui/modals.css';
import usePriceFormatter from '../../../hooks/usePriceFormatter';
import TextField from "../TextField";
import PriceInput from '../PriceInput';
import { Option, OptionValue } from '../../../models/Tabs';

const EditOption = ({option=new Option(), addOption, updateOption, isNew=false}) => {
    // let initialState = {name: '', price: '000.00'}
    const [newValue, setNewValue] = useState(new OptionValue());
    const [localOption, setLocalOption] = useState({...option})
    const {formatPrice} = usePriceFormatter();
    const [ editOptionName, setEditOptionName] = useState(false);
    const [showValue, setShowValue] = useState(false);
    // const [isItem, setIsItem] = useState(false)
    /**
     * updates the local Item/Section in the parent &
     * creates a new option object
     */
    const handleAddOption = () => {
        addOption(localOption);
        if(isNew) setLocalOption(new Option());
    }
    const handleSetEditOptionName = useCallback((flag) => {
        setEditOptionName(flag)
    },[])
    const handleValueInput = useCallback((str, field) => {
        // console.log(str, field)
        setNewValue((prev) => ({
            ...prev, [field]: str
        }))
    },[])
    const handleAddValue = () => {
        // console.log(localOption)
        // console.log(newValue)
        if(newValue.name.length){
            let value = {
                name: newValue.name,
                price: newValue.price
            }
            setLocalOption((prev)=>({
                ...prev,
                content: [...prev.content, {
                    name: value.name,
                    price: value.price
                }]
            }));
        }
        setNewValue(new OptionValue());
        
    }
    const handleCheckbox = () => {
        // console.log(localOption.req)
        setLocalOption((prev)=>({
            ...prev,
            req: !localOption.req
        }));
        
    }
    /**
     * 
     * @param {string} str input
     * passed callback to TextField component
     */
    const handleSetInput = useCallback((str) => {
        // console.log(str)
        setLocalOption((prev)=>({
            ...prev,
            name: str
        }));
        // option.name=str;
    },[])
    useEffect(() => {
        if(updateOption) updateOption(localOption);
        // console.log(localOption)
    }, [localOption]);
    useEffect(() => {
        document.querySelector('input[type=text]')?.focus();
        // console.log(document.querySelector('input'))
    },[editOptionName, showValue]);
    return (
        <span className='option'>
            <div className='content-row'>             
                <span className='text-field options'>
                    {isNew ? 
                        <TextField 
                            name={'option-name'}
                            placeHolder={'option-name'}
                            setInput={(str)=>handleSetInput(str)}
                            value={localOption.name}
                            bgColor={'rgb(254, 254, 254)'}
                        /> : !editOptionName ? 
                        <span onClick={()=>handleSetEditOptionName(!editOptionName)}>{localOption.name}</span> :
                        <TextField 
                            name={'option-name'}
                            placeHolder={localOption.name}
                            bgColor={'rgb(254, 254, 254)'}
                            handleOnBlurProp={handleSetEditOptionName}
                            value={localOption.name}
                            setInput={(str)=>handleSetInput(str)}
                         />
                    }
                    
                </span>
                <div className='checkbox-button'>
                    <div className="checkbox">
                        <label htmlFor="req">Required:</label>
                        <input type="checkbox" name="req" checked={localOption.req} onChange={handleCheckbox}/>
                    </div>
                    <div className='submit-button'>
                        {!isNew ?
                            <button onClick={()=>setShowValue(!showValue)}>
                                {showValue ? 'close' : 'add Value'}
                            </button> :
                            <button onClick={()=>handleAddOption()}>add option</button>
                        }
                    </div>
                </div>
            </div>
            {(isNew || showValue) &&
                <div className="content-row last">
                    <span className='text-field options'>
                        <TextField
                            name={'value-name'}
                            placeHolder={'value name'}
                            setInput={(str)=>handleValueInput(str, 'name')}
                            value={newValue.name}
                        />
                    </span>
                    <div className="checkbox-button">
                        <div className="price">
                            <PriceInput
                                price={newValue.price}
                                setPriceOnChange={(p)=>handleValueInput(p,'price')}
                            /> 
                        </div>
                        <div className='submit-button'>
                            <button onClick={handleAddValue}>
                                Add Value
                            </button> 
                        </div>
                    </div>
                </div>}
                <p className='option-content-group'>
                    {localOption.content?.length > 0 && localOption.content.map((val, i)=>(
                        <span key={val.name} className='option-content'>
                            <button className="button-close">
                                <Icon path={mdiClose} size={0.4} />
                            </button>
                            {val.name}
                            {val.price > 0 && ' - '+formatPrice(val.price)}
                            {i!==localOption.content.length-1 && ','}
                        </span>
                    ))}
                </p>
            
        </span>
    )
}
EditOption.propTypes={
    option: PropTypes.object,
    updateOption: PropTypes.func,
    isNew: PropTypes.bool,
    addOption: PropTypes.func,
    isItem: PropTypes.bool,
}
export default EditOption;