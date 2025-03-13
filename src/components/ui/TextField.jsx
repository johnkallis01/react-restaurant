import Icon from '@mdi/react';
import { mdiEyeOutline, mdiEyeOffOutline } from '@mdi/js';
import '../../assets/components/ui/floatingText.css';
import { useState, useRef } from "react";
import PropTypes from 'prop-types';
const TextField = ({ name, setInput, isPassword, placeHolder, rule, bgColor }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const inputRef = useRef(null);
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
    return (
        <div className="floating-text">
            <input
                ref={inputRef}
                placeholder=""
                name={name}
                style={{ paddingRight: isPassword ? '1.4rem' : '0' , border: isValid ? null: '1px solid red'}}
                type={isPassword && !isOpen ? 'password' : 'text'}
                onChange={(e)=>handleInput(e,name)}
                onBlur={handleCheckIsValid}
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
    placeHolder: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    setInput: PropTypes.func.isRequired,
    isPassword: PropTypes.bool,
    rule: PropTypes.object,
    bgColor: PropTypes.string,
}
TextField.defaultProps = {
    bgColor: 'white',
};
export default TextField;
