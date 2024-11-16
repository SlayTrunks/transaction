import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  
  const [balance,setBalance] = useState(0)

  useEffect(()=>{
  const token = localStorage.getItem("token")
  const fetchData = async()=>{
    const response = await fetch("http://localhost:8000/account/balance",{
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
    })
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    const data = await response.json();
    setBalance(data)
   
  }
  fetchData()
},[])
  
    
   
  

  return (
    <div className="dashboard">
      <div className="profile">
        <h1>Welcome</h1>
        <p>Your balance: ${balance.balance}</p>
      </div>
    </div>
  );
};

export default Dashboard;
