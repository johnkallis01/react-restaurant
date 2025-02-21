import { useState,useEffect } from "react";
import TextField from "../components/ui/TextField";
import { Link} from 'react-router-dom';
const Register = () => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [password, setPassword] = useState('');
    const handleSetEmail =(data) => {
        setEmail(data)
    }
    const handleSetFirstName =(data) => {
        setFirstName(data)
    }
    const handleSetLastName =(data) => {
        setLastName(data)
    }
    const handleSetPhone = (data) => {
        setPhone(data);
    }
    const handleSetPassword = (data) => {
        setPassword(data);
    }
    const handleSetConfirmPassword = (data) => {
        setConfirmPassword(data);
    }
    const formData = [
        {name: 'Email', setInput: handleSetEmail, isPassword: false},
        {name: 'Phone', setInput: handleSetPhone, isPassword: false},
        {name: 'First Name', setInput: handleSetFirstName, isPassword: true},
        {name: 'Last Name', setInput: handleSetLastName, isPassword: true},
        {name: 'Password', setInput: handleSetPassword, isPassword: true},
        {name: 'Confirm Password', setInput: handleSetConfirmPassword, isPassword: true},
    ];
    useEffect(() => {
        console.log(email);
        console.log(phone);
        console.log(firstName);
        console.log(lastName);
        console.log(confirmPassword);
        console.log(password);
    });
    return (
    <>
        <div className="form-page register">
            <h3>
                <div>Register</div>
            </h3>
            <form>
                {formData.map((data,i)=>{
                   return <TextField name={data.name} setInput={data.setInput} isPassword={data.isPassword} key={i}/>
                })}  
            </form>
            <div className="form-actions">
                <button>Submit</button>
                <button><Link to="/">Cancel</Link></button>
            </div>
        </div>
    </>
    )
}
export default Register;