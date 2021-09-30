import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; 

import axios from 'axios';
import swal from 'sweetalert';

const Login = () => { 
        const history = useHistory(); 
        const [loginInput, setLoginInput] = useState({ 
            email: '',
            password: '', 
            error_list: [],
        })


    const handleInput = e => {
        const { name, value } = e.target; 
        console.log(name);
        console.log(value);
        setLoginInput({
            ...loginInput,
            [name]: value 
        });
    }; 

    const loginSubmit = (e) => {
        e.preventDefault();

        const data = { 
            email: loginInput.email,
            password: loginInput.password,
        }
 
 
        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post(`/api/login`, data).then(res => {
                if(res.data.status === 200)
                {
                    localStorage.setItem('auth-token', res.data.token);
                    localStorage.setItem('auth-name', res.data.name);
                    swal("success", res.data.message, "success"); 
                    if(res.data.role === 'admin')
                    {
                        history.push('/admin/dashboard');
                    }
                    else
                    {
                        history.push('/');
                    }
                }
                else if(res.data.status === 401)
                {
                    swal("warning", res.data.message, "warning");
                }
                else
                {
                    setLoginInput({...loginInput, error_list: res.data.validation_errors})
                }
            }) 
        });
    }


    return (
        <div>
         

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                <h4>Login</h4>
                            </div>
                            <div className="card-body">
                                <form> 
                                     <div className="form-group mb-3">
                                        <label>Email ID:</label>
                                        <input type="email" className="form-control" name="email" value={loginInput.email} onChange={handleInput} />
                                     </div>
                                     <div className="form-group mb-3">
                                        <label>Password:</label>
                                        <input type="password" className="form-control" name="password" value={loginInput.password} onChange={handleInput} />
                                     </div> 
                                     <div className="form-group mb-3">
                                         <button type="submit" className="btn btn-primary" onClick={loginSubmit}>Login</button>
                                     </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        </div>
    )
}

export default Login
