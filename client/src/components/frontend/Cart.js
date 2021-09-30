import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import axios from 'axios';
import swal from 'sweetalert';

const Cart = () => {

    const history = useHistory();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    let totalCartPrice = 0;

    if(!localStorage.getItem('auth-token'))
    {
        history.push('/');
        swal("Warning", "Login to go to Cart Page", "error");
    }

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

    const handleDecrement = (cart_id) => {
        setCart( cart =>
                cart.map((item) => 
                    cart_id === item.id ? {...item, product_qty: item.product_qty - (item.product_qty > 1 ? 1:0) } : item
                )
            )
        updateCartQuantity(cart_id, "dec");
    }

    const handleIncrement = (cart_id) => {
        setCart( cart =>
            cart.map((item) => 
                cart_id === item.id ? {...item, product_qty: item.product_qty + (item.product_qty < 10 ? 1:0) } : item
            )
        )
        updateCartQuantity(cart_id, "inc");
    }

    function updateCartQuantity(cart_id, scope)
    {
         axios.put(`/api/cart-updatequantity/${cart_id}/${scope}`).then( res => {
            if(res.data.status === 200)
            {
                // swal("Success", res.data.message, "sucess");
            }
         });
    }

    const deleteCartItem = (e, cart_id) => {
        e.preventDefault();

        const thisClicked = e.currentTarget;
        thisClicked.innerText = "Removing";

        axios.delete(`/api/delete-cartitem/${cart_id}`).then( res => {
            if(res.data.status === 200)
            { 
                thisClicked.closest("tr").remove();
                swal("Success", res.data.message, "success");
                history.push('/collections');
            }
            else if(res.data.status === 404)
            {
                swal("Error", res.data.message, "error");   
                thisClicked.innerText = "Remove"; 
            } 


        });
    };


    if(loading)
    {
        return <h4>Loading Cart ...</h4>
    }
    else
    {
         var cart_HTML = '';
         if(cart.length > 0)
         {
            cart_HTML = <div> 
                            <div className="table-responsive">
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Image</th>
                                                    <th>Product</th>
                                                    <th className="text-center">Price</th>
                                                    <th className="text-center">Quantity</th>
                                                    <th className="text-center">Total Price</th>
                                                    <th>Remove</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {
                                                    cart.map( (item, idx) => {
                                                        totalCartPrice += item.product.selling_price * item.product_qty;
                                                        return (
                                                        <tr key={idx}> 
                                                            <td width="10%">
                                                                <img src={`http://localhost:8000/${item.product.image}`} alt={item.product.name} width="50px" height="50px" />
                                                            </td>
                                                            <td>{item.product.name}</td>
                                                            <td width="15%" className="text-center" >Php {item.product.selling_price}</td>
                                                            <td width="15%">
                                                                <div className="input-group">
                                                                    <button  type="button" className="input-group-text" onClick={()=>handleDecrement(item.id)}>-</button>
                                                                    <div className="form-control text-center">{item.product_qty}</div>
                                                                    <button  type="button" className="input-group-text" onClick={()=>handleIncrement(item.id)}>+</button>
                                                                </div>
                                                            </td>
                                                            <td width="15%" className="text-center">Php {item.product.selling_price * item.product_qty}</td>
                                                            <td width="10%">
                                                                <button type="button" className="btn btn-danger btn-sm" onClick={ (e) => deleteCartItem(e, item.id) }>Remove</button>
                                                            </td>
                                                        </tr>

                                                        )
                                                    })   
                                                }

                                            </tbody>
                                        </table>
                                    </div> 
                                    <div className="row">
                                        <div className="col-md-8"></div>
                                        <div className="col-md-4">
                                            <div className="card card-body mt-3">
                                                <h4>Sub Total:
                                                    <small className="float-end">{totalCartPrice}</small> 
                                                </h4>
                                                <h4>Grand Total:
                                                    <small className="float-end">{totalCartPrice}</small> 
                                                </h4>
                                                <hr/>
                                                <Link to="/checkout" className="btn btn-primary">Checkout</Link>
                                            </div>
                                         </div>
                            </div>
                        </div>    
         }
         else
         {
             cart_HTML = <div>
                    <div className="card card-body py-5 text-center shadow-sm">
                        <h4>Your Shopping Cart is Empty</h4>
                    </div>
                 </div>
         }
         
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
                    <div className="row">
                        <div className="col-md-12"> 
                            {cart_HTML} 
                        </div>

                         
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart
