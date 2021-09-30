import React, {useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import axios from 'axios';
import swal from 'sweetalert';


const EditCategory = (props) => {

    const history = useHistory();
    const [categoryInput, setCategoryInput] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);

    const handleInput = e => {
        const { name, value } = e.target;  
        setCategoryInput({
            ...categoryInput,
            [name]: value 
        });
    }; 

    useEffect(() => {

        const category_id = props.match.params.id;
        axios.get(`/api/edit-category/${category_id}`).then( res => { 
            if(res.data.status === 200)
            {
                setCategoryInput(res.data.category);
            }
            else if(res.data.status === 404)
            {
                swal("Error", res.data.message, "error");
                history.push('/admin/view-category');
            }
            setLoading(false); 
        });
 
    }, [props.match.params.id, history])

    if(loading)
    {
        return <h4>Loading Edit Category...</h4>
    }
   
    const updateCategory = (e) => {
        e.preventDefault();

        const category_id = props.match.params.id;
        const data = categoryInput;
        axios.put(`/api/update-category/${category_id}`, data).then( res => { 
            if(res.data.status === 200)
            {
                swal("Success", res.data.message, "success");
                setErrors([]);
            }
            else if(res.data.status === 422)
            { 
                swal("All fields are mandatory", "", "error");
                setErrors(res.data.errors);
            }  
            else if(res.data.status === 404)
            { 
                swal("Error", res.data.message, "error");
                history.push('admin/view-category');
            } 
        });

    };

    return (
        <div>
           <div className="card mt-4">
                <div className="card-header">
                    <h4>Category List <Link to="/admin/view-category" className="btn btn-primary btn-sm float-end"> Back</Link></h4>
                </div>
                <div className="card-body">

                <form onSubmit={updateCategory}>
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Home</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="seo-tags-tab" data-bs-toggle="tab" data-bs-target="#seo-tags" type="button" role="tab" aria-controls="seo-tags" aria-selected="false">SEO Tags</button>
                        </li>  
                    </ul>
                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane card-body border fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                            
                            <div className="form-group mb-3">
                                <label>Slug:</label>
                                <input type="text" name="slug" className="form-control" onChange={handleInput} value={categoryInput.slug} />
                                <small className="text-danger">{errors.slug}</small>
                            </div>
                            <div className="form-group mb-3">
                                <label>Name:</label>
                                <input type="text" name="name" className="form-control" onChange={handleInput} value={categoryInput.name} />
                                <small className="text-danger">{errors.name}</small>
                            </div>
                            <div className="form-group mb-3">
                                <label>Description:</label>
                                <textarea type="text" name="description" className="form-control" onChange={handleInput} value={categoryInput.description} ></textarea>
                            </div>
                            <div className="form-group mb-3">
                                <label>Status:</label>
                                <input type="checkbox" name="status" onChange={handleInput} value={categoryInput.status} /> Status 0=shown/1=hidden
                            </div>
                            

                        </div>
                        <div className="tab-pane card-body border fade" id="seo-tags" role="tabpanel" aria-labelledby="seo-tags-tab">
                            
                        <div className="form-group mb-3">
                                <label>Meta Title:</label>
                                <input type="text" name="meta_title" className="form-control" onChange={handleInput} value={categoryInput.meta_title} />
                                <small className="text-danger">{errors.meta_title}</small>
                            </div>
                            <div className="form-group mb-3">
                                <label>Meta Keywords:</label>
                                <input type="text" name="meta_keyword" className="form-control" onChange={handleInput} value={categoryInput.meta_keyword} />
                            </div>
                            <div className="form-group mb-3">
                                <label>Meta Description:</label>
                                <input type="text" name="meta_description" className="form-control" onChange={handleInput} value={categoryInput.meta_description} />
                            </div> 

                        </div> 
                    </div>
                    <br/>
                    <button type="submit" className="btn btn-primary px-4 float-end">Update</button>
                
                </form>

                </div>
            </div>
        </div>
    )
}

export default EditCategory
