import axios from 'axios';
import React, { useState, useEffect } from 'react'
import Product from './Product';

const ProductRow = (props) => {
    const { category } = props;
    const [ products, setProducts ] = useState({})
    const [ loading, setLoading ] = useState(false)
    useEffect(() => {
        axios.get("http://localhost:8000/api/products/getByCategory/" + category)
            .then(res => {
                setProducts(res.data.products);
                setLoading(true);
            })
            .catch(err => console.log(err));
    }, [])
    return (
        <div className="category__container">
            <h1>Shop {category} &raquo;</h1><br />
            <div className="productRow">
            
            
            {
                loading ? products.map((product) => {
                   return <Product product={product} />
                }) : ""
            }
            </div>
        </div>
    )
}

export default ProductRow
