import React, {useState} from 'react';
import { useHistory } from 'react-router-dom'; 

import axios from 'axios';
import swal from 'sweetalert';


const Register = () => {
    const history = useHistory(); 
    const [registerInput, setRegisterInput] = useState({
        name: '',
        email: '',
        password: '',
        confirm_password: '', 
        error_list: [],
    })
 

    const handleInput = e => {
        const { name, value } = e.target;  
        setRegisterInput({
            ...registerInput,
            [name]: value 
        });
    }; 

 

    const registerSubmit = (e) => {
        e.preventDefault();

        const data = {
            name: registerInput.name,
            email: registerInput.email,
            password: registerInput.password,
        }

        
 
        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post(`/api/register`, data).then(res => {
                if(res.data.status === 200)
                {
                    localStorage.setItem('auth-token', res.data.token);
                    localStorage.setItem('auth-name', res.data.name);   
                    swal("success", res.data.message, "success");
                    history.push('/');
                }
                else
                {
                    setRegisterInput({...registerInput, error_list: res.data.validation_errors})
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
                                <h4>Register</h4>
                            </div>
                            <div className="card-body">
                                <form>
                                    <div className="form-group mb-3">
                                        <label>Full Name:</label>
                                        <input type="text" className="form-control" name="name" value={registerInput.name} onChange={handleInput}  />
                                        <small className="text-danger">{registerInput.error_list.name}</small>
                                     </div>
                                     <div className="form-group mb-3">
                                        <label>Email ID:</label>
                                        <input type="email" className="form-control" name="email" value={registerInput.email} onChange={handleInput} />
                                        <small className="text-danger">{registerInput.error_list.email}</small>
                                     </div>
                                     <div className="form-group mb-3">
                                        <label>Password:</label>
                                        <input type="password" className="form-control" name="password" value={registerInput.password} onChange={handleInput} />
                                        <small className="text-danger">{registerInput.error_list.password}</small>
                                     </div>
                                     <div className="form-group mb-3">
                                        <label>Confirm Password:</label>
                                        <input type="password" className="form-control" name="confirm_password" value={registerInput.confirm_password} onChange={handleInput} />
                                        <small className="text-danger">{registerInput.error_list.confirm_password}</small>
                                     </div>
                                     <div className="form-group mb-3">
                                         <button type="submit" className="btn btn-primary" onClick={registerSubmit} >Register</button>
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

export default Register
