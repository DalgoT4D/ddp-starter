import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container } from "@mui/material";
import { ToastContext } from "../context/toastProvider";
import { errorToast, successToast } from "../utils/toastHelper";
import SigninForm from "../components/Auth/SigninForm";

const Signin = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [_, toastDispatch] = useContext(ToastContext);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    await axios
      .post(`${process.env.REACT_APP_API_URL}/auth/signin`, values)
      .then((res) => {
        console.log(res.data.body.token);
        setLoading(false);
        localStorage.setItem("token", res.data.body.token);
        successToast(toastDispatch, res.data.message);
        navigate("/dashboard");
      })
      .catch((err) => {
        setLoading(false);
        errorToast(
          toastDispatch,
          err.response.data.message,
          err.response.data.body
        );
      });
  };

  return (
    <Container>
      <SigninForm
        onFormSubmit={handleSubmit}
        loading={loading}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />
    </Container>
  );
};

export default Signin;
