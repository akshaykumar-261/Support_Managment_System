import { useState } from "react";
//import Register from "./beforeAuth/Login.jsx"
//import Login from "./beforeAuth/Login.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import { Toaster } from "react-hot-toast";
import "./index.css";
function App() {
  return (
    <>
      <AppRoutes />
      <Toaster position="top-left" />
    </>
  );
}

export default App;
