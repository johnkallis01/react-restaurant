import { useState,useEffect } from "react";
import TextField from "../components/ui/TextField";
import { Link} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../store/authSlice';
import {rules} from  '../utils/rules';
const Register = () => {
    const dispatch = useDispatch();
    // const {user} = useSelector((state)=>state.auth);
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const handleChange = (e, name)=>{
        setFormData({
            ...formData,
            [name]: e
        })
    }
    const checkIfFilled = () => {
        return Object.values(formData).every(value=> value !== '');
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if(checkIfFilled()){
            if(formData.password !== formData.confirmPassword){
                alert('passwrods dont match')
                return;
            }
            dispatch(registerUser(formData))
        }
    }
    const registerData = [
        {name: 'email',placeHolder: 'Email', isPassword: false, rule: rules.email},
        {name: 'phone',placeHolder: 'Phone', isPassword: false, rule: rules.phone},
        {name: 'firstName',placeHolder: 'First Name',  isPassword: false, rule: rules.name},
        {name: 'lastName',placeHolder: 'Last Name', isPassword: false, rule: rules.name},
        {name: 'password',placeHolder: 'Password',  isPassword: true, rule: rules.password},
        {name: 'confirmPassword',placeHolder: 'Confirm Password', isPassword: true, rule: rules.password},
    ];
    useEffect(() => {
        console.log(formData);
        console.log(typeof rules.email)
        console.log(checkIfFilled())
    })
    // const handleRegister=(e) => {
    //     e.preventDefault();
    //     dispatch(registerUser({email: formData.email, firstName: formData.firstName, 
    //         lastName: formData.lastName, phone: formData.phone, password: formData.password}))
    //     console.log()
    // }
    return (
    <>
    <div className="page-container">
        <div className="form-page register">
            <h3>
                <div>Register</div>
            </h3>
            <form onSubmit={handleSubmit}>
                {registerData.map((data,i)=>{
                   return <TextField placeHolder={data.placeHolder} name={data.name} setInput={handleChange} isPassword={data.isPassword} rule={data.rule} key={i}/>
                })}  
                <div className="form-actions">
                    <button type="submit" disabled={!checkIfFilled()}>Submit</button>
                    <button><Link to="/">Cancel</Link></button>
                </div>
            </form>
        </div>
    </div>
    </>
    )
}
export default Register;