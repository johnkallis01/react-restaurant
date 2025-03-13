import PriceInput from '../../PriceInput';
import PropTypes from 'prop-types';
import {useState, useEffect} from 'react';
import TextField from "../TextField";
import Icon from '@mdi/react';
import { mdiPlus, mdiClose } from '@mdi/js';

const EditOption = ({option, setOption, isNew}) => {
    const [newValue, setNewValue] = useState({name: '', price: '000.00'});
  return (
    <span className='option'>
        <div className='content-row'>             
            <span className='text-field options'>
                {isNew ? 
                    <TextField 
                        name={'option-name'}
                        placeHolder={'option-name'}
                        bgColor={'rgb(254, 254, 254)'}
                    /> : 
                    <span>{option.name}</span>
                
                }
                
            </span>
            <div className='checkbox-button'>
                <div className="checkbox">
                    <label htmlFor="req">Required:</label>
                    <input type="checkbox" name="req" />
                </div>
                <div className='submit-button'>
                    <button>
                        Submit Option
                    </button> 
                </div>
            </div>
        </div>
        <div className="content-row last">
            <span className='text-field options'>
                <TextField
                    name={'value-name'}
                    placeHolder={'value name'}
                />
            </span>
            <div className="checkbox-button">
                <div className="price">
                    <PriceInput price={newValue.price} /> 
                </div>
                <div className='submit-button'>
                    <button>
                        Add Value
                    </button> 
                </div>
            </div>
        </div>
    </span>
  )
}
EditOption.propTypes={
    option: PropTypes.object.isRequired,
    setOption: PropTypes.func.isRequired,
    isNew: PropTypes.bool.isRequired,
}
export default EditOption;