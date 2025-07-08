import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import { Toaster } from 'react-hot-toast';

const App = () => {

  const token = localStorage.getItem("access_token");

  return (
    <div>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={token ? <Home/> : <Navigate to={'/login'}/>}/>
          {/* <Route path="/" element={<Home/>} /> */}
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Routes>
        <Toaster/>
      </BrowserRouter>
    </div>
  );
};

export default App;
