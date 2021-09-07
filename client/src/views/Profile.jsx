import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Image } from 'react-bootstrap';
import NavBar from '../components/NavBar';
import { Order } from '../components/Order';
import pfp from "../static/pfp.png";
const Profile = (props) => {
    const [ user, setUser ] = useState({
        userName: "",
        email: "",
    });
    
    const initialState = {
        userName:"",
        email:"",
        password:"",
        confirmPassword:"",
    }
    
    const [ userForm, setUserForm ] = useState(initialState);
    const [errors, setErrors] = useState(initialState);
    const [ doneLoading, setDoneLoading ] = useState(false);
    const [ orders, setOrders ] = useState([])
    const handleInputChange = (e) => {
        setUserForm({
            ...userForm,
            [e.target.name]:e.target.value
        })
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post(`http://localhost:8000/api/user/${localStorage.getItem("user")}/update`, userForm,  {withCredentials:true})
            .then(res => setUser(res.data.results))
            .catch(err => {
                console.log(err)
                setErrors(err)
            });
    }
    const fetchProducts = (productArray) => {
        axios.post("http://localhost:8000/api/products/getOrders", productArray, {withCredentials: true})
            .then(res => setOrders(res.data.products))
            .catch(err => console.log(err))
    }
    useEffect(() => {

         if(localStorage.getItem("user")){
          axios.get('http://localhost:8000/api/user/'+ localStorage.getItem("user"), {withCredentials: true})
            .then(res => {
                setUser(res.data.results);
                fetchProducts(res.data.results.orders);
                setDoneLoading(true);
            })
            .catch(err => console.log(err));
         } else {
             return;
         }
            
                
    }, [])
    
    
    
    return (
        <>
            <NavBar />
            { !doneLoading ? <h2>Loading</h2> : 
            <div className="profile__container">
                
                <div className="profile__left">
                    <div className="profile__top">
                        <Image src={pfp} roundedCircle />
                        <h2>{user.userName}</h2> 
                        
                    </div>
                    <div className="profile__bottom">

                            <label htmlFor="email">Email: </label>
                            <input onChange={handleInputChange} type="text" placeholder={user.email} className="form-control" name="email"/><br />
                            {errors.email ? <p className="profile__errors">{errors.email}</p> : ""}
                        
                            <label htmlFor="userName">Username: </label>
                            <input onChange={handleInputChange} type="text" placeholder={user.userName} className="form-control"name="userName" /><br />  
                            {errors.email ? <p className="profile__errors">{errors.email}</p> : ""}


                            <label htmlFor="password">Password: </label>
                            <input onChange={handleInputChange} name="password" type="password" className="form-control" /><br />
                            {errors.email ? <p className="profile__errors">{errors.email}</p> : ""}
                            <label htmlFor="confirmPw"> Confirm Password: </label>
                            <input onChange={handleInputChange} type="password" className="form-control" name="confirmPassword" /><br />
                            {errors.email ? <p className="profile__errors">{errors.email}</p> : ""}
                            <button className="btn btn-success" onClick={handleSubmit} >Submit</button>
                    </div>
                    
                </div>
                <div className="profile__right">
                    <h2>Your Orders:</h2>
                    {
                       orders.map((order) => {
                            return <Order product={order} />
                        }) 
                    } 
                </div>
            </div>
            }
        </>
    )
}

export default Profile
