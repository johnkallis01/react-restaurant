// import { useState, useEffect } from "react";
import { useState } from "react";
import TextField from "../components/ui/TextField";
import { Link} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/authSlice';
const Login = () => {
    const dispatch = useDispatch();
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    // const { user} = useSelector((state)=>state.auth);

    const handleSetLogin = (data) => {
        setLogin(data);
    }
    const handleSetPassword = (data) => {
        setPassword(data);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({email: login, password}));
    }
    const formData = [
        {placeHolder: 'Login', name: 'login', setInput: handleSetLogin, isPassword: false},
        {placeHolder: 'Password',name: 'password', setInput: handleSetPassword, isPassword: true}
    ];
    // useEffect(() => {
    //     console.log(login);
    //     console.log(password);
    // });
    return (
    <>
    <div className="page-container">
        <div className="form-page login">
            <h3>
                <div>Login</div>
            </h3>
            <form onSubmit={handleSubmit}>
                {formData.map((data,i)=>{
                   return <TextField placeHolder={data.placeHolder} name={data.name} setInput={data.setInput} isPassword={data.isPassword} key={i}/>
                })} 
                <div className="form-actions">
                    <button type="submit">Submit</button>
                    <button><Link to="/register">Register</Link></button>
                </div> 
            </form>

        </div>
    </div>
    </>
    )
}
export default Login;