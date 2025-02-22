import { useState,useEffect } from "react";
import TextField from "../components/ui/TextField";
import { Link} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../store/authSlice';
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
    const handleSubmit = (e) => {
        e.preventDefault();
        if(formData.password !== formData.confirmPassword){
            alert('passwrods dont match')
            return;
        }
        dispatch(registerUser(formData))
    }
    const registerData = [
        {name: 'email',placeHolder: 'Email', isPassword: false},
        {name: 'phone',placeHolder: 'Phone', isPassword: false},
        {name: 'firstName',placeHolder: 'First Name',  isPassword: false},
        {name: 'lastName',placeHolder: 'Last Name', isPassword: false},
        {name: 'password',placeHolder: 'Password',  isPassword: true},
        {name: 'confirmPassword',placeHolder: 'Confirm Password', isPassword: true},
    ];
    useEffect(() => {
        console.log(formData)
    })
    // const handleRegister=(e) => {
    //     e.preventDefault();
    //     dispatch(registerUser({email: formData.email, firstName: formData.firstName, 
    //         lastName: formData.lastName, phone: formData.phone, password: formData.password}))
    //     console.log()
    // }
    return (
    <>
        <div className="form-page register">
            <h3>
                <div>Register</div>
            </h3>
            <form onSubmit={handleSubmit}>
                {registerData.map((data,i)=>{
                   return <TextField placeHolder={data.placeHolder} name={data.name} setInput={handleChange} isPassword={data.isPassword} key={i}/>
                })}  
                <div className="form-actions">
                    <button type="submit">Submit</button>
                    <button><Link to="/">Cancel</Link></button>
                </div>
            </form>
        </div>
    </>
    )
}
export default Register;