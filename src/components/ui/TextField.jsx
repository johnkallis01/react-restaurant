import Icon from '@mdi/react';
import { mdiEyeOutline, mdiEyeOffOutline } from '@mdi/js';
import '../../assets/components/ui/floatingText.css';
import { useState, useRef, useEffect } from "react";
import PropTypes from 'prop-types';
const TextField = ({ name,value, setInput, isPassword, placeHolder, rule, bgColor, handleOnBlurProp }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const inputRef = useRef(null);
    const [localValue, setLocalValue] = useState(value)
    const handleCheckIsValid = (e) => {
        rule ? rule.test(e.target.value) ? setIsValid(true) : setIsValid(false) : null;
    }
    const handleIsOpen = () => {
        setIsOpen(!isOpen);
    };
    const handleInput = (e, name) => {
        rule ? rule.test(e.target.value) ? setInput(e.target.value, name) : null : setInput(e.target.value, name);
    };
    const handleClick = () => {
        inputRef.current.focus()
    }
    const handleOnBlur = () =>{
        // console.log(handleOnBlurProp())
        if(handleOnBlurProp) handleOnBlurProp(false);
        else if (rule) handleCheckIsValid
        // console.log('t')
        // handleOnBlurProp(false);
    }
    useEffect(() => {
        setLocalValue(value)
    },[value])
    return (
        <div className="floating-text">
            <input
                ref={inputRef}
                placeholder=""
                name={name}
                value={localValue}
                style={{ paddingRight: isPassword ? '1.4rem' : '0' , border: isValid ? null: '1px solid red'}}
                type={isPassword && !isOpen ? 'password' : 'text'}
                onChange={(e)=>handleInput(e,name)}
                onBlur={handleOnBlur}
            />
            <label onClick={handleClick} style={{'--label-bg-color': bgColor}}>{placeHolder}</label>
            {isPassword && (
                <Icon
                    className="eye-button"
                    onClick={handleIsOpen}
                    path={isOpen ? mdiEyeOutline : mdiEyeOffOutline}
                    size={0.75}
                />
            )}
        </div>
    );
};
TextField.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    placeHolder: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    setInput: PropTypes.func.isRequired,
    isPassword: PropTypes.bool,
    rule: PropTypes.object,
    bgColor: PropTypes.string,
    handleOnBlurProp: PropTypes.func,
}
TextField.defaultProps = {
    bgColor: 'white',
    value: ''
};
export default TextField;
