import React from "react";
import { Button, Card } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { loginSchema } from "../validation/loginValidation.js";
import toast from "react-hot-toast";
const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  function loginUser() {
    axios
      .post("http://localhost:8088/api/users/login", form)
      .then((d) => {
        localStorage.setItem("id", d.data.id);
        localStorage.setItem("role", d.data.role);
        localStorage.setItem("username", form.email);
        toast.success("Login successful 🎉");

        navigate("/");
      })
      .catch((error) => {
        console.log(error.response?.data);
        toast.error(error.response?.data?.message || "Something went wrong ❌");
      });
  }
  function onSubmit() {
    const result = loginSchema.safeParse({
      ...form,
    });

    if (!result.success) {
      let fieldErrors = {};

      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setError(fieldErrors);
      return;
    }
    setError({});
    loginUser();
  }
  return (
    <div className="d-flex justify-content-center align-items-center pt-20">
      <Card className="text-center shadow-lg">
        <Card.Header className="bg-warning fs-4 font-bold">Login</Card.Header>
        <Card.Body>
          <div className="form-group row p-2 m-2">
            <label className="col-4" for="username">
              UserName:
            </label>
            <div className="col-8">
              <input
                className="form-control"
                id="username"
                type="email"
                name="email"
                value={form.email}
                onChange={changeHandler}
              />
              <div style={{ minHeight: "20px" }}>
                {error.email && (
                  <small className="text-danger">{error.email}</small>
                )}
              </div>{" "}
            </div>
          </div>
          <div className="form-group row p-2 m-2">
            <label className="col-4" for="pwd">
              Password:
            </label>
            <div className="col-8">
              <input
                className="form-control"
                id="pwd"
                type="password"
                name="password"
                value={form.password}
                onChange={changeHandler}
              />
              <div style={{ minHeight: "20px" }}>
                {error.email && (
                  <small className="text-danger">{error.password}</small>
                )}
              </div>
            </div>
          </div>
        </Card.Body>
        <Card.Footer className="text-muted">
          <Button
            variant="warning"
            onClick={() => {
              onSubmit();
            }}
          >
            Login
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
};
export default Login;
