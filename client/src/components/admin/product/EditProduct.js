import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import axios from 'axios';
import swal from 'sweetalert';

const EditProduct = (props) => {

    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [categorylist, setCategorylist] = useState([]);
    const [productInput, setProductInput] = useState([]);
    
    const [picture, setPicture] = useState([]);
    const [errors, setErrors] = useState([]);
    const [allCheckbox, setAllCheckbox] = useState([]);

    const handleInput = e => {
        const { name, value } = e.target;  
        console.log(name);
        console.log(value);
        setProductInput({
            ...productInput,
            [name]: value 
        });
    }; 

    const handleImage = (e) => {
         setPicture({ image: e.target.files[0] });
    }; 

    const handleCheckbox = (e) => {
        console.log(e.target.name);
        console.log(e.target.value);
       setAllCheckbox({...allCheckbox, [e.target.name]:e.target.value});
   }; 
 
    useEffect(() => {
        
        axios.get(`/api/all-category`).then( res => {
            if(res.data.status === 200)
            {
                setCategorylist(res.data.category);
            }
        });

        const product_id = props.match.params.id; 
        
        axios.get(`/api/edit-product/${product_id}`).then( res => {
            if(res.data.status === 200)
            {
                setProductInput(res.data.product);
                setAllCheckbox(res.data.product);
            }
            else if(res.data.status === 404)
            {
                swal("Error", res.data.message, "error");
                history.push('/admin/view-product');
            }

            setLoading(false); 
        });
 
    }, [props.match.params.id, history])

      

    const updateProduct = (e) => {
        e.preventDefault();

        const id = props.match.params.id; 
        
        const formData = new FormData();
        formData.append('image', picture.image);
        formData.append('category_id', productInput.category_id);
        formData.append('slug', productInput.slug);
        formData.append('name', productInput.name);
        formData.append('description', productInput.description);

        formData.append('meta_title', productInput.meta_title);
        formData.append('meta_keyword', productInput.meta_keyword);
        formData.append('meta_description', productInput.meta_description);

        formData.append('selling_price', productInput.selling_price);
        formData.append('original_price', productInput.original_price);
        formData.append('qty', productInput.qty);
        formData.append('brand', productInput.brand);
        formData.append('featured', allCheckbox.featured ? '1':'0');
        formData.append('popular', allCheckbox.popular ? '1':'0');
        formData.append('status', allCheckbox.status ? '1':'0');
 
        axios.post(`/api/update-product/${id}`, formData).then( res => {
            if(res.data.status === 200)
            {
                swal("Success", res.data.message, "success"); 
                console.log(allCheckbox);
                setErrors([]); 
            } 
            else if(res.data.status === 422)
            {
                swal("All fields are mandatory", "", "error"); 
                console.log(allCheckbox);
                setErrors(res.data.errors); 
            } 
            else
            if(res.data.status === 404)
            {
                swal("Error", res.data.message, "error"); 
                history.push('/admin/view-product');
            } 
        }); 
   

    };

    if(loading)
    {
        return <h4>Edit Product Data Loading...</h4>
    }

    return (
        <div className="container-fluid px-4">
            <div className="card mt-4">
                <div className="card-header"> 
                    <h4>Edit Product  <Link to="/admin/view-product" className="btn btn-primary btn-sm float-end"> View Product</Link></h4>
                </div>
                <div className="card-body">

                   <form onSubmit={updateProduct} encType="multipart/form-data"> 

                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Home</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="seotags-tab" data-bs-toggle="tab" data-bs-target="#seotags" type="button" role="tab" aria-controls="seotags" aria-selected="false">SEO Tags</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="otherdetails-tab" data-bs-toggle="tab" data-bs-target="#otherdetails" type="button" role="tab" aria-controls="otherdetails" aria-selected="false">Other Details</button>
                            </li>
                        </ul>
                        <div className="tab-content" id="myTabContent">
                            <div className="tab-pane card-body border fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                
                                <div className="form-group mb-3">
                                    <label>Select Category:</label>
                                    <select name="category_id" className="form-control" onChange={handleInput} value={productInput.category_id}>
                                        <option>Select Category</option>
                                         
                                        {
                                            categorylist.map( (item)=>{
                                                return (
                                                    <option value={item.id} key={item.id}>{item.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                    <small className="text-danger">{errors.category_id}</small>
                                </div>
                                <div className="form-group mb-3">
                                    <label>Slug:</label>
                                    <input type="text" name="slug" className="form-control" onChange={handleInput} value={productInput.slug} />
                                    <small className="text-danger">{errors.slug}</small>
                                </div>
                                <div className="form-group mb-3">
                                    <label>Name:</label>
                                    <input type="text" name="name" className="form-control" onChange={handleInput} value={productInput.name} />
                                    <small className="text-danger">{errors.name}</small>
                                </div>
                                <div className="form-group mb-3">
                                    <label>Description:</label>
                                    <textarea type="text" name="description" className="form-control" onChange={handleInput} value={productInput.description} ></textarea>
                                </div> 

                            </div>
                            <div className="tab-pane card-body border fade" id="seotags" role="tabpanel" aria-labelledby="seotags-tab">
                            
                                <div className="form-group mb-3">
                                    <label>Meta Title:</label>
                                    <input type="text" name="meta_title" className="form-control" onChange={handleInput} value={productInput.meta_title} />
                                    <small className="text-danger">{errors.meta_title}</small>
                                </div>
                                <div className="form-group mb-3">
                                    <label>Meta Keywords:</label>
                                    <input type="text" name="meta_keyword" className="form-control" onChange={handleInput} value={productInput.meta_keyword} />
                                </div>
                                <div className="form-group mb-3">
                                    <label>Meta Description:</label>
                                    <textarea name="meta_description" className="form-control" onChange={handleInput} value={productInput.meta_description}></textarea>
                                </div> 

                            </div>
                            <div className="tab-pane card-body border fade" id="otherdetails" role="tabpanel" aria-labelledby="otherdetails-tab">
                                
                                <div className="row">

                                    <div className="col-md-4 form-group mb-3">
                                        <label>Selling Price:</label>
                                        <input type="text" name="selling_price" className="form-control" onChange={handleInput} value={productInput.selling_price} />
                                        <small className="text-danger">{errors.selling_price}</small>
                                    </div>
                                    <div className="col-md-4 form-group mb-3">
                                        <label>Original Price:</label>
                                        <input type="text" name="original_price" className="form-control" onChange={handleInput} value={productInput.original_price} />
                                        <small className="text-danger">{errors.original_price}</small>
                                    </div>
                                    <div className="col-md-4 form-group mb-3">
                                        <label>Quantity:</label>
                                        <input type="text" name="qty" className="form-control" onChange={handleInput} value={productInput.qty} />
                                        <small className="text-danger">{errors.qty}</small>
                                    </div>
                                    <div className="col-md-4 form-group mb-3">
                                        <label>Brand:</label>
                                        <input type="text" name="brand" className="form-control" onChange={handleInput} value={productInput.brand} />
                                        <small className="text-danger">{errors.brand}</small>
                                    </div>
                                    <div className="col-md-8 form-group mb-3">
                                        <label>Image:</label>
                                        <input type="file" name="image" className="form-control" onChange={handleImage} />
                                        <img src={`http://localhost:8000/${productInput.image}`} width="50px" alt={`${productInput.category.name}`} />
                                        <small className="text-danger">{errors.image}</small>
                                    </div>
                                    <div className="col-md-4 form-group mb-3">
                                        <label>Featured (checked=shown):</label>
                                        <input type="checkbox" name="featured" className="w-50 h-50" onChange={handleCheckbox} defaultChecked={allCheckbox.featured === 1 ? true:false} />
                                    </div>
                                    <div className="col-md-4 form-group mb-3">
                                        <label>Popular (checked=shown):</label>
                                        <input type="checkbox" name="popular" className="w-50 h-50" onChange={handleCheckbox} defaultChecked={allCheckbox.popular === 1 ? true:false} />
                                    </div>
                                    <div className="col-md-4 form-group mb-3">
                                        <label>Status (checked=hidden):</label>
                                        <input type="checkbox" name="status" className="w-50 h-50" onChange={handleCheckbox} defaultChecked={allCheckbox.status === 1 ? true:false} />
                                    </div>
    
                                </div> 
                            </div> 
                        </div> 
                        <button type="submit" className="btn btn-primary px-4 mt-2 float-end">Submit</button>
                    </form>
                </div> 
            </div> 
        </div>
    )
}

export default EditProduct
