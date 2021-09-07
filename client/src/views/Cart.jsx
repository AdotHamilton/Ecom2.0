import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import CartItem from "../components/CartItem";
import { clearCart } from "../redux/actions/shopping-actions";
import CardInput from "../components/CardInput";
import NavBar from "../components/NavBar";
// redux
// stripe 
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';


const Cart = props => {
    
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;
    const handleProducts = () => { 
      const products = [];
      cartItems.forEach((item) => {
        products.push(item.product)
      })
      return products;
    };
    
    
    const handleAmount = () => {
        var amount = 0
        cartItems.forEach((item) =>{
            amount += (item.price * item.qty)
        })
        return amount;
    }
    const stripe = useStripe();
    const elements = useElements();
  
    const handleSubmit = async (event) => {
      document.getElementById("submit").style.display = "none";
      document.getElementById("spinner").style.visibility = "visible"
      if (!stripe || !elements) {
        return;
      }
      const res = await axios.post('http://localhost:8000/api/checkout',
       {email: email, amount: handleAmount(), products: handleProducts() ,userID: localStorage.getItem("user")
      }, {withCredentials: true})
      const clientSecret = res.data['client_secret'];
  
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            email: email,
          },
        }})
        
      if (result.error) {
        setMessage("Something went wrong. Please Try again.")
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          clearCart();
          document.getElementById('spinner').style.visibility = "hidden"
          document.getElementById("cart__left").style.display = "none"
          var node = document.createElement("h2");
          var message = document.createTextNode("Chekout Success!")
          node.appendChild(message)
          document.getElementById("checkout").appendChild(node)
        } else {
          document.getElementById("submit").style.display = "block";

        }
      }
    };
  
    return (
      <>
        <NavBar></NavBar>
        <div className="cart__container">
  
          <div id="cart__left" className="cart__left">
            {
              cartItems.length === 0 ? <h2>Your Cart is Empty</h2> :
              cartItems.map((item) => {
                  return <CartItem product={item} key={item.product} />
                  
              })
            }
          </div>
          <div id="checkout" className="cart__right">
            <h2>Checkout</h2>

            <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} /><br />
            <p>Where should we send the recipt?</p>
            <CardInput /><br />
            <p>We will never store your payment information<br /> <i>All purchases are handled through Stripe</i></p>
            <span>
              <h3>Total: ${handleAmount()}</h3>
              <button id="submit" className="" onClick={handleSubmit}>Finish and Pay</button><br/>
              <div className="spinner-border" id="spinner" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </span>
            
            {
              message ? <span id="paymentError">{message}</span> : ""
            }
          </div>
        </div>       
      </> 
    )
}
export default Cart;