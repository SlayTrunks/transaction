import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";  
import axios from 'axios'
const Signup = () => {
  const navigate = useNavigate()
  const signUpBody = z.object({
    firstname: z.string().nonempty({ message: "First name is required" }),
    lastname: z.string().nonempty({ message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  });

  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  
 
  const handleChange = (e)=>{
    setUser({
      ...user,[e.target.name]:e.target.value
    })
  }
  const handleSubmit = async(e)=>{
    e.preventDefault();
    const {success,error} = signUpBody.safeParse(user)
    
    if(!success){
      console.log(error.errors[0].message)

    return;
    }
    try {
      const response = await fetch("http://localhost:8000/user/signup",{
        method:"POST",
        headers:{
          'Content-Type': 'application/json'
        },  
        body: JSON.stringify(user)
      })

      if(!response.ok){
        const data = await response.json()
        console.log(data.message)
        
      }
      const data = await response.json()
      console.log(data)
      navigate("/signin")

    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <div className="container">
      <form className="form">
        <p className="title">Register </p>
        <p className="message">Signup now and get full access to our app. </p>
        <div className="flex">
          <label>
            <input
              className="input"
              value={user.firstname}
              onChange={handleChange}
              name="firstname"
              type="text"
              placeholder=""
              required=""
            />
            <span>Firstname</span>
          </label>

          <label>
            <input
              className="input"
              name="lastname"
              type="text"
              value={user.lastname}
              onChange={handleChange}
              placeholder=""
              required=""
            />
            <span>Lastname</span>
          </label>
        </div>

        <label>
          <input
            className="input"
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder=""
            required=""
          />
          <span>Email</span>
        </label>

        <label>
          <input
            className="input"
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            placeholder=""
            required=""
          />
          <span>Password</span>
        </label>
        <button onClick={handleSubmit} className="submit">Submit</button>
        <p className="signin">
          Already have an acount ? <Link to={"/signin"}>Signin</Link>{" "}
        </p>
      </form>
    </div>
  );
};

export default Signup;
