import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import axios from 'axios';
import swal from 'sweetalert'; 


const Checkout = () => {

    const history = useHistory();
    if(!localStorage.getItem('auth-token'))
    {
        history.push('/');
        swal("Warning", "Login to go to Cart Page", "error");
    }

    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);
    let totalCartPrice = 0;


    const [checkoutInput, setCheckoutInput] = useState({
        firstname: '',
        lastname: '',
        phonenumber: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipcode: '',  
    });
    

    useEffect(() => {
        
        let isMounted = true;
 
        axios.get(`/api/cart`).then( res => {
            if(isMounted)
            {
                if(res.data.status === 200)
                {
                    setCart(res.data.cart); 
                    setLoading(false);
                } 
                else  if(res.data.status === 400)
                {
                    history.push('/collections');
                    swal("Warning", res.data.message, "error");
                }
                else  if(res.data.status === 401)
                {
                    history.push('/');
                    swal("Warning", res.data.message, "error");
                }

            }
        });

        return () => {
            isMounted = false;
        }
        
    }, [history]);

    const handleInput = e => {
        const { name, value } = e.target;   
        console.log(name);
        console.log(value);
        setCheckoutInput({
            ...checkoutInput,
            [name]: value 
        });
    }; 

    const submitOrder = (e) => {
        e.preventDefault();

        const data =  {
            firstname: checkoutInput.firstname,
            lastname: checkoutInput.lastname,
            phonenumber: checkoutInput.phonenumber,
            email: checkoutInput.email,
            address: checkoutInput.address,
            city: checkoutInput.city,
            state: checkoutInput.state,
            zipcode: checkoutInput.zipcode, 
        }

        axios.post(`/api/place-order`, data).then( res => {
            if(res.data.status === 200)
            {
                swal("Order Placed Successfully", res.data.message, "success");
                setErrors([]);
                history.push('/thank-you');
            }
            else if(res.data.status === 422)
            {
                swal("All fields are mandatory", "", "error");
                setErrors(res.data.errors); 
            }

        });


    };

    if(loading)
    {
        return <h4>Loading Checkout ...</h4>
    }


    var checkout_HTML = '';
    if(cart.length > 0)
    {
        checkout_HTML = <div> 

            <div className="row">

                <div className="col-md-7">
                    <div className="card">
                        <div className="card-header">
                            <h4>Basic Information</h4>
                        </div>
                        <div className="card-body">

                            <div className="row"> 

                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label>First Name</label>
                                        <input type="text" name="firstname" className="form-control" onChange={handleInput} value={checkoutInput.firstname} />
                                        <small className="text-danger">{errors.firstname}</small>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label>Last Name</label>
                                        <input type="text" name="lastname" className="form-control" onChange={handleInput} value={checkoutInput.lastname} />
                                        <small className="text-danger">{errors.lastname}</small>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label>Phone Number</label>
                                        <input type="text" name="phonenumber" className="form-control" onChange={handleInput} value={checkoutInput.phonenumber} />
                                        <small className="text-danger">{errors.phonenumber}</small>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label>Email Address</label>
                                        <input type="email" name="email" className="form-control" onChange={handleInput} value={checkoutInput.email} />
                                        <small className="text-danger">{errors.email}</small>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group mb-3">
                                        <label>Full Address</label>
                                        <textarea rows="3" name="address" className="form-control" onChange={handleInput} value={checkoutInput.address}></textarea>
                                        <small className="text-danger">{errors.address}</small>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group mb-3">
                                        <label>City</label>
                                        <input type="text" name="city" className="form-control" onChange={handleInput} value={checkoutInput.city}/>
                                        <small className="text-danger">{errors.city}</small>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group mb-3">
                                        <label>State</label>
                                        <input type="text" name="state" className="form-control" onChange={handleInput} value={checkoutInput.state} />
                                        <small className="text-danger">{errors.state}</small>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group mb-3">
                                        <label>Zip Code</label>
                                        <input type="text" name="zipcode" className="form-control" onChange={handleInput} value={checkoutInput.zipcode}/>
                                        <small className="text-danger">{errors.zipcode}</small>
                                    </div>
                                </div> 
                                <div className="col-md-12">
                                    <div className="form-group text-end"> 
                                        <button type="button" className="btn btn-primary" onClick={submitOrder}>Place Order</button>
                                    </div>
                                </div>
                            </div>
                        
                        </div>
                    </div> 
                </div>

                <div className="col-md-5">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th width="50%">Product</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                cart.map( (item, idx) => {
                                    totalCartPrice += item.product.selling_price * item.product_qty;
                                    return (
                                    <tr key={idx}> 
                                        <td>{item.product.name}</td>
                                        <td>Php {item.product.selling_price}</td>
                                        <td>{item.product_qty}</td>
                                        <td>Php {item.product.selling_price * item.product_qty}</td>
                                    </tr>
                                        )
                                })  
                            }
                            <tr>
                                <td colSpan="2" className="text-end fw-bold">Grand Total</td>
                                <td colSpan="2" className="text-end fw-bold">{totalCartPrice}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>


        </div> 
    }
    else
    {
        checkout_HTML = <div>
               <div className="card card-body py-5 text-center shadow-sm">
                   <h4>Your Shopping Cart is Empty. You are in Checkout Page</h4>
               </div>
            </div>
    }

    return (
        <div>
            <div className="py-3 bg-warning">
                <div className="contatiner">
                    <h6>Home / Cart</h6>
                </div>
            </div>
            <div className="py-4">
                <div className="contatiner"> 
                      {checkout_HTML}
                </div>
            </div>
        </div>
    )
}

export default Checkout
