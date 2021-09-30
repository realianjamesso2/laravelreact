import React, {useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';


const ViewProduct = () => { 
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        
        document.title = "View Product"; //Site Title

        axios.get(`/api/view-product`).then( res => {
            if(res.data.status === 200)
            {
                setProducts(res.data.products);
                setLoading(false);
            }
        });

    }, [])

    let viewproduct_HTMLTABLE = "";
    if(loading)
    {
        return <h4>View Products Loading...</h4>
    }
    else
    {
        let prodStatus = '';
        viewproduct_HTMLTABLE = products.map( (item) => {
            if(item.status === 0)
            {
                prodStatus = 'Shown';
            }
            else if(item.status === 1)
            {
                prodStatus = 'Hidden';
            }
            

            return (
                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.category.name}</td>
                    <td>{item.name}</td>
                    <td>{item.selling_price}</td>
                    <td><img src={`http://localhost:8000/${item.image}`} width="50px" alt={`${item.category.name}`} /></td>
                    <td>
                        <Link to={`edit-product/${item.id}`} className="btn btn-success btn-sm">Edit</Link>
                    </td>
                    <td>
                        {prodStatus}
                    </td>
                </tr>
            )
        });
    }

    return (
        <div className="container px-4">
             <div className="card mt-4">
                <div className="card-header">
                    <h4>Product List <Link to="/admin/add-product" className="btn btn-primary btn-sm float-end"> Add Product</Link></h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Category Name</th>
                                    <th>Product Name</th>
                                    <th>Selling Price</th>
                                    <th>Image</th>
                                    <th>Edit</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {viewproduct_HTMLTABLE}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
         </div>
    )
}
 
export default ViewProduct
