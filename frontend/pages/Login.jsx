import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const Login = () => {
  const navigate = useNavigate();
  const signinBody = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  });
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { success, error } = signinBody.safeParse(user);

    if (!success) {
      console.log(error.errors[0].message);

      return;
    }
    try {
      const response = await fetch("http://localhost:8000/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const data = await response.json();
        console.log(data.message);
      }
      const data = await response.json();
      console.log(data.message);
      localStorage.setItem('token',data.token)
      localStorage.setItem('id',data.id)
      navigate("/dashboard");
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="container">
      <form className="form">
        <p className="title">Signin </p>
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
        <button onClick={handleSubmit} className="submit">
          Submit
        </button>
        <p className="signin">
          create an acount ? <Link to={"/signup"}>Signup</Link>{" "}
        </p>
      </form>
    </div>
  );
};

export default Login;
