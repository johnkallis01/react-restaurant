import Icon from '@mdi/react';
import { mdiEyeOutline, mdiEyeOffOutline } from '@mdi/js';
import '../../assets/components/ui/floatingText.css';
import { useState, useRef } from "react";
import PropTypes from 'prop-types';

const TextField = ({ name, setInput, isPassword }) => {
    const [isOpen, setIsOpen] = useState(false); // Default state to false, meaning the password is hidden initially
    const inputRef = useRef(null)
    const handleIsOpen = () => {
        setIsOpen(!isOpen); // Toggle the visibility of the password
    };
    const handleInput = (e) => {
        console.log(e.target.value);
        setInput(e.target.value); // Update the input value in the parent component
    };
    const handleClick = () => {
        inputRef.current.focus()
    }
    return (
        <div className="floating-text">
            <input
                ref={inputRef}
                placeholder=""
                style={{ paddingRight: isPassword ? '1.4rem' : '0' }}
                type={isPassword && !isOpen ? 'password' : 'text'} // Change input type based on isOpen state
                onChange={handleInput}
            />
            <label onClick={handleClick}>{name}</label>
            {isPassword && (
                <Icon
                    className="eye-button"
                    onClick={handleIsOpen}
                    path={isOpen ? mdiEyeOutline : mdiEyeOffOutline} // Toggle icon based on isOpen state
                    size={0.75}
                />
            )}
        </div>
    );
};
TextField.propTypes = {
    name: PropTypes.string.isRequired,
    setInput: PropTypes.func.isRequired,
    isPassword: PropTypes.bool,
}
export default TextField;
