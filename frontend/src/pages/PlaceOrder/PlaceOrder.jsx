import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {

  const { getTotalCartAmount, cartItems, food_list, token, url } = useContext(StoreContext)

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  const placeOrder = async (event) => {
    event.preventDefault();

    let orderItems = []
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item, quantity: cartItems[item._id] }
        orderItems.push(itemInfo)
      }
    })

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2
    }

    try {
      let response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token }
      })

      if (response.data.success) {
        const { session_url } = response.data
        window.location.replace(session_url)
      } else {
        alert("Something went wrong. Please try again.")
      }
    } catch (error) {
      console.error(error)
      alert("An error occurred. Please try again.")
    }
  } 
  const navigate = useNavigate();

  useEffect(()=>{
    if(!token){
      navigate('/cart')
    }
    else if (getTotalCartAmount()===0)
    {
      navigate('/cart')
    }
  },[token])

  const deliveryFee = getTotalCartAmount() === 0 ? 0 : 2
  const totalAmount = getTotalCartAmount() + deliveryFee

  return (
    <form onSubmit={placeOrder} className='place-order'>
      {/* LEFT SIDE */}
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-field">
          <input name='firstName' onChange={onChangeHandler} value={data.firstName} type='text' placeholder='First Name' required />
          <input name='lastName' onChange={onChangeHandler} value={data.lastName} type='text' placeholder='Last Name' required />
        </div>

        <input name='email' onChange={onChangeHandler} value={data.email} type='email' placeholder='Email Address' required />
        <input name='street' onChange={onChangeHandler} value={data.street} type='text' placeholder='Street Address' required />

        <div className="multi-field">
          <input name='city' onChange={onChangeHandler} value={data.city} type='text' placeholder='City' required />
          <input name='state' onChange={onChangeHandler} value={data.state} type='text' placeholder='State' required />
        </div>

        <div className="multi-field">
          <input name='zipcode' onChange={onChangeHandler} value={data.zipcode} type='text' placeholder='Zip Code' required />
          <input name='country' onChange={onChangeHandler} value={data.country} type='text' placeholder='Country' required />
        </div>

        <input name='phone' onChange={onChangeHandler} value={data.phone} type='text' placeholder='Phone Number' required />
      </div>

      {/* RIGHT SIDE */}
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Your Order</h2>

          <div className="cart-items-summary">
            {food_list.map((item) => {
              if (cartItems[item._id] > 0) {
                return (
                  <div key={item._id} className="cart-item-row">
                    <p>{item.name} x {cartItems[item._id]}</p>
                    <p>₱{item.price * cartItems[item._id]}</p>
                  </div>
                )
              }
              return null
            })}
          </div>

          <hr />

          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>₱{getTotalCartAmount()}</p>
          </div>

          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>₱{deliveryFee}</p>
          </div>

          <div className="cart-total-details total">
            <b>Total</b>
            <b>₱{totalAmount}</b>
          </div>

          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder