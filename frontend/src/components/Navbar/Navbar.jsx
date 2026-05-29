import React, { useContext, useState, useEffect, useRef } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'

const Navbar = ({ setShowLogin }) => {

  const [menu, setMenu] = useState("Home")
  const [showDropdown, setShowDropdown] = useState(false)

  const { getTotalCartItems, token, setToken } = useContext(StoreContext)

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("receipt_bookingId");
    setToken("");
    setShowDropdown(false);
    navigate("/")
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="navbar">
      <Link to={''}>
        <img src={assets.fedlogo} alt="Company Logo" className="navbar-logo" />
      </Link>

      <ul className="navbar-menu">
        <li>
          <NavLink
            to="/"
            onClick={() => setMenu("Home")}
            className={menu === "Home" ? "active" : ""}
          >
            Home
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/cateringbooking"
            onClick={() => setMenu("Catering Booking")}
            className={menu === "Catering Booking" ? "active" : ""}
          >
            Catering Booking
          </NavLink>
        </li>
      </ul>

      <div className="navbar-right">
        <img src={assets.search_icon} alt="search" />

        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="cart" />
          </Link>

          {getTotalCartItems() > 0 && (
            <div className="cart-count">
              {getTotalCartItems()}
            </div>
          )}
        </div>

        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className='navbar-profile' ref={dropdownRef}>
            <img
              src={assets.profile_icon}
              alt="profile"
              onClick={() => setShowDropdown(prev => !prev)}
            />

            {showDropdown && (
              <ul className='navbar-profile-dropdown'>

                <li onClick={() => { navigate('/myorders'); setShowDropdown(false); }}>
                  <img src={assets.bag_icon} alt="" />
                  <p>Orders</p>
                </li>

                <hr />

                {localStorage.getItem('receipt_bookingId') && (
                  <>
                    <li onClick={() => {
                      const bookingId = localStorage.getItem('receipt_bookingId');
                      navigate('/booking-receipt', { state: { bookingId } });
                      setShowDropdown(false);
                    }}>
                      <img src={assets.bag_icon} alt="" />
                      <p>My Receipt</p>
                    </li>
                    <hr />
                  </>
                )}

                <li onClick={logout}>
                  <img src={assets.logout_icon} alt="" />
                  <p>Logout</p>
                </li>

              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar