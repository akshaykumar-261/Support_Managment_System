import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../afterAuth/Home.jsx";
import Login from "../beforeAuth/Login.jsx";
import Register from "../beforeAuth/Register.jsx";
import Forgotpassword from "../beforeAuth/Forgotpassword.jsx";
function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotPassword" element={<Forgotpassword/>}/>
      </Routes>
    </>
  );
}

export default AppRoutes;
