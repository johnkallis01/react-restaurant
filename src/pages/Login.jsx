import { useState,useEffect } from "react";
import TextField from "../components/ui/TextField";
import { Link} from 'react-router-dom';
const Login = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const handleSetLogin = (data) => {
        setLogin(data);
    }
    const handleSetPassword = (data) => {
        setPassword(data);
    }
    const formData = [
        {name: 'Login', setInput: handleSetLogin, isPassword: false},
        {name: 'Password', setInput: handleSetPassword, isPassword: true}
    ];
    useEffect(() => {
        console.log(login);
        console.log(password);
    });
    return (
    <>
        <div className="form-page login">
            <h3>
                <div>Login</div>
            </h3>
            <form>
                {formData.map((data,i)=>{
                   return <TextField name={data.name} setInput={data.setInput} isPassword={data.isPassword} key={i}/>
                })}  
            </form>
            <div className="form-actions">
                <button>Submit</button>
                <button><Link to="/register">Register</Link></button>
            </div>
        </div>
    </>
    )
}
export default Login;