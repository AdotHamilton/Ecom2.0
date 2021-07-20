import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import NavBar from "../components/NavBar";
import { addToCart } from "../redux/actions/shopping-actions";
const ProductPage = props => {
    const [ product, setProduct ] = useState({
        name: "",
        description: '',
        price: "",
        imageUrl: ""
    });
    const [ qty, setQty ] = useState(1)
    useEffect(() => {
        axios.get(`http://localhost:8000/api/products/findByName/${props.name}`)
        .then(res => setProduct((res.data.product)))
        .catch(err => console.log(err))
    }, [props.name]);
    const dispatch = useDispatch();
    const onSubmitHandler = () => {
        dispatch(addToCart(product._id, qty));
        document.getElementById("add").innerHTML = "Added";
    }
    return (
        <>
            <NavBar />
            <div className="productCard">
                <div className="col1">
                    <img src={product.imageUrl} alt={product.name} />
                </div>
                <div className="col2">
                    <h2>{product.name}</h2>
                    <span className="productInfo">
                        <p><b>${ product.price }</b></p>
                        <p>{product.description}</p>
                    </span>
                    
                    <div className="row1">
                        <span>
                            <label htmlFor="qty">Quantity: </label>
                            <input type="number" onChange={(e) => setQty(parseInt(e.target.value, 10))} placeholder="1" min="0"max="4" name="qty"/>  
                        </span>
                        <button id="add" onClick={onSubmitHandler} className="btn btn-primary">Add to Cart</button>
                    </div>
                </div>
            </div>
        </>
        
    )
};
export default ProductPage;