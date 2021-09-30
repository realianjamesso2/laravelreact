import React, {useState} from 'react';
import Navbar from '../../../layouts/frontend/Navbar';

import axios from 'axios';

const Register = () => {
    const [registerInput, setRegisterInput] = useState({
        name: '',
        email: '',
        password: '',
        confirm_password: '',
    })

    const handleInput = e => {
        const { name, value } = e.target; 
        console.log(name);
        console.log(value);
        setRegisterInput({
            ...registerInput,
            [name]: value 
        });
    }; 

    const registeSubmit = (e) => {
        e.preventDefault();

        const data = {
            name: registerInput.name,
            email: registerInput.email,
            password: registerInput.password,
        }

      
       

        // axios.get('/sanctum/csrf-cookie').then(response => {
        //     axios.post(`http://localhost:8000/api/register`, data).then(res => {

        //     }) 
        // });
    }

     

    return (
        <div>
             <Navbar />

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
                                     </div>
                                     <div className="form-group mb-3">
                                        <label>Email ID:</label>
                                        <input type="email" className="form-control" name="email" value={registerInput.email} onChange={handleInput} />
                                     </div>
                                     <div className="form-group mb-3">
                                        <label>Password:</label>
                                        <input type="password" className="form-control" name="password" value={registerInput.password} onChange={handleInput} />
                                     </div>
                                     <div className="form-group mb-3">
                                        <label>Confirm Password:</label>
                                        <input type="password" className="form-control" name="confirm_password" value={registerInput.confirm_password} onChange={handleInput} />
                                     </div>
                                     <div className="form-group mb-3">
                                         <button type="submit" className="btn btn-primary" onSubmit={registeSubmit} >Register</button>
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
