import React, { useEffect, useState } from "react";
import { z } from "zod";
const send = () => {
  const [to, setTo] = useState({
    to: "",
    amount: 0,
  });

  const handleChange = (e) => {
    setTo({...to, 
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();
   
    if (!to) {
      console.error('Receiver email is required');
      return;
    }
  
    const token = localStorage.getItem("token");
  
  
  
    try {
      const response = await fetch("http://localhost:8000/account/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          to:to.to,
          amount:parseInt(to.amount)
        }), // Sending the data as JSON string
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        console.error(data.message || 'Something went wrong');
        return;
      }
  
      console.log(data.message); // Successful transfer message
    } catch (error) {
      console.error('Error:', error.message);
    }
    console.log(to)
  };  
  return (
    <div className="container">
      <form className="subscribe-form">
        <input
          type="email"
          onChange={handleChange}
          value={to.to}
          name="to"
          placeholder="example@mail.com"
          className="subscribe-input"
        />
        <input
          type="number"
          onChange={handleChange}
          value={to.amount}
          name="amount"
          placeholder="example@mail.com"
          className="subscribe-input"
        />
        <button onClick={handleClick} className="subscribe-btn">
          Send
        </button>
      </form>
    </div>
  );
};

export default send;
