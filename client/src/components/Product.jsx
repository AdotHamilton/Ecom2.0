import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/actions/shopping-actions";
import { Link } from "@reach/router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
const Product = props => {
    const { name } = props.product;
    const formatted_name = name.replace(" ","_");

    const dispatch = useDispatch();
    const onSubmitHandler = () => {
        dispatch(addToCart(props.product._id, 1));
        document.getElementById("add"+ props.product._id).innerHTML = "Added";
    }
    
    return (
        <div id="productTile" className="">
            <Link to={"/products/"+formatted_name}>
            <img src={props.product.imageUrl} alt={props.product.name}/>
            <h4><b>{props.product.name}</b></h4>
            <p>${props.product.price}</p>
            </Link>
        </div>
    )
};
export default Product;