import React, { useState } from 'react';
import './Navbar.css';  // Assuming you have a separate CSS file for styling
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
  const localUser = localStorage.getItem("token");
    
    const handleLogout = ()=>{
        localStorage.removeItem("token")
        navigate(0)
    }


 


  return (
    <nav className="navbar">
    
      <Link to={"/"} className="logo">
        <img src="https://via.placeholder.com/50" alt="Logo" /> {/* Replace with your logo */}
        <span className="logo-text">MyApp</span>
      </Link>

     
      <div className="nav-buttons">
        
          <>
            {
                !localUser && <>
                <Link to={"/signin"} className="nav-button" >
                Login
              </Link>
              <Link to={"/signup"} className='nav-button'>Sign up</Link></>
            }
            {localUser &&
            <>
             <button onClick={handleLogout} className="nav-button" >
              Logout
            </button>
            <Link className='nav-button' to={"/profile"}>profile</Link>
            </>
            }
            <Link to={"/send"} className="nav-button" >
              Send
            </Link>
          </>
        
          
      </div>
    </nav>
  );
};

export default Navbar;
