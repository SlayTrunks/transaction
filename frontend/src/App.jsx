import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Send from "../pages/Send";
import Home from "../pages/Home";
import Navbar from "../components/Navbar";
import Profile from "../pages/Profile";
function App() {
  const token = localStorage.getItem("token")

  return (
    
    <BrowserRouter>
    <Navbar/>
    <Routes>
      {/* <Route path="/" element={<Home/>}/> */}
      {
        token && <>
        <Route path="/profile" element={<Profile/>}></Route>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/send" element={<Send/>} /></>
      }
      {!token && <>
        <Route path="/signup" element={<Signup/>} />
        <Route path="/" element={<Login/>} />
        <Route path="/signin" element={<Login/>} /></>}
    </Routes>
    </BrowserRouter>
  )
}

export default App
