import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
const Footer = () => {
  return (
    <div className='footer'id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            
            <p>DishDash FoodHaus & Catering  Savor the perfect blend of taste and tradition. From daily favorites to unforgettable celebrations, we craft every dish with care, quality ingredients, and a dash of love. Let us cater your events or bring a flavorful experience straight to your table.</p>
            <div className='footer-social-icons'>
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <dev className="footer-content-center">
        <h2>COMPANY</h2>
        <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
        </ul>
        </dev>
        <div className='footer-content-right'>
            <h2>GET IN TOUCH</h2>
            <li>+9924923836</li>
            <li>DishDash@gmail.com</li>
        </div> 
      </div>
      <hr/>
      <p className='footer-copyright'>DishDash.com - All Rights Reserved 2026.</p>
    </div>
  )
}

export default Footer
