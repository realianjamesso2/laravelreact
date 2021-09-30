import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ViewCategory = () => {

    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        let isMounted = true;

        axios.get(`/api/getcategory`).then( res => {
            if(isMounted)
            {
                if(res.data.status === 200)
                {
                    setCategory(res.data.category);
                    setLoading(false);
                }  
            }
             
        }); 

        return () => {
            isMounted = false;
        }

    });

    if(loading)
    {
        return <h4>Loading Categories...</h4>
    }
    else
    {
        var showCategoryList = '';
        showCategoryList = category.map( (item, idx) => {
            return (
                <div className="col-md-4" key={idx}>
                    <div className="card">
                        <Link to="" >
                            {/* <img src=""  className="w-100" alt={item.name} /> */}
                        </Link>
                        <div className="card-body">
                        <Link to={`collections/${item.slug}`}>
                            <h5>{item.name}</h5>
                        </Link> 
                        </div>
                    </div>
                </div>
            )
        });
    }

    return (
        <div> 
            <div className="py-3 bg-warning">
                <div className="contatiner">
                    <h6>Category Page</h6>
                </div>
            </div>
            <div className="py-3">
                <div className="contatiner">
                    <div className="row">
                        {showCategoryList}
                    </div> 
                </div>
            </div>
        </div>
    )
}

export default ViewCategory
