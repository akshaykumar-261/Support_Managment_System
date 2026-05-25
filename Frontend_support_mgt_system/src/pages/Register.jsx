import React from "react";
import { Button, Card } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Routes from "../routes/AppRoutes.jsx";
import { registerSchema } from "../validation/registerValidation.js";
const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    address: "",
    phoneNo: "",
    email: "",
    profile_Img: null,
    password: "",
    role_Id: 3,
  });
  const [error, setError] = useState({
    name: "",
    address: "",
    phoneNo: "",
    email: "",
    profile_Img: null,
    password: "",
  });
  const changeHandler = (e) => {
    if (e.target.name === "profile_Img") {
      setForm({ ...form, profile_Img: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };
  function onSubmit() {
    const result = registerSchema.safeParse({
      ...form,
      role_Id: Number(form.role_Id),
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
    save();
  }
  function save() {
    const data = new FormData();
    data.append("name", form.name);
    data.append("address", form.address);
    data.append("phoneNo", form.phoneNo);
    data.append("email", form.email);
    data.append("password", form.password);
    data.append("profile_Img", form.profile_Img);
    data.append("role_Id", form.role_Id);
    axios
      .post("http://localhost:8088/api/users/create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((d) => {
        console.log(d.data);
        alert(d.data.message);
        navigate("/");
      })
      .catch((error) => {
        console.log(error.response?.data);
        alert(error.response?.data?.message);
      });
  }
  return (
    <div className="d-flex justify-content-center align-items-center pt-7">
      <Card className="text-center shadow-lg">
        <Card.Header className="bg-warning fs-4 font-bold">
          Register
        </Card.Header>
        <Card.Body>
          <div className="form-group row p-2 m-2">
            <label className="col-4" for="name">
              Name:
            </label>
            <div className="col-8">
              <input
                className="form-control"
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={changeHandler}
              />
              {error.name && <p className="text-danger">{error.name}</p>}{" "}
            </div>
          </div>
          <div className="form-group row p-2 m-2">
            <label className="col-4" for="address">
              Address:
            </label>
            <div className="col-8">
              <input
                className="form-control"
                id="address"
                type="text"
                name="address"
                value={form.address}
                onChange={changeHandler}
              />
              {error.address && (
                <p className="text-danger">{error.address}</p>
              )}{" "}
            </div>
          </div>
          <div className="form-group row p-2 m-2">
            <label className="col-4" for="phoneNo">
              PhoneNo:
            </label>
            <div className="col-8">
              <input
                className="form-control"
                id="phoneNo"
                type="phoneNo"
                name="phoneNo"
                value={form.phoneNo}
                onChange={changeHandler}
              />
              {error.phoneNo && <p className="text-danger">{error.phoneNo}</p>}
            </div>
          </div>
          <div className="form-group row p-2 m-2">
            <label className="col-4" for="email">
              Email:
            </label>
            <div className="col-8">
              <input
                className="form-control"
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={changeHandler}
              />
              {error.email && <p className="text-danger">{error.email}</p>}{" "}
            </div>
          </div>
          <div className="form-group row p-2 m-2">
            <label className="col-4" for="profile_Img">
              Image:
            </label>
            <div className="col-8">
              <input
                className="form-control"
                id="profile_Img"
                type="file"
                name="profile_Img"
                onChange={changeHandler}
              />
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
              {error.password && (
                <p className="text-danger">{error.password}</p>
              )}{" "}
            </div>
          </div>
        </Card.Body>
        <Card.Footer className="text-muted">
          <Button
            variant="warning"
            onClick={() => {
              //debugger;
              onSubmit();
            }}
          >
            Submit
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
};
export default Register;
