import { Box, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useState } from "react";
import axios from "axios";
import { errorToast, successToast } from "../utils/toastHelper";
import { ToastContext } from "../context/toastProvider";

const Menu = ({ navItem }) => {
  const navigate = useNavigate();
  const [_, toastDispatch] = useContext(ToastContext);
  const handleLogOut = () => {
    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/auth/signout`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        localStorage.removeItem("token");
        navigate("/signin");
        successToast(toastDispatch, res.data.message);
      })
      .catch((err) => {
        errorToast(toastDispatch, err.data.message);
      });
  };

  return (
    <Box
      sx={{
        background: "black",
        height: "4rem",
        display: "flex",
        color: "white",
        alignItems: "center",
        padding: "0 2rem 0 2rem",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{}}>
        <Typography variant="p">Dev Data Platform</Typography>
      </Box>
      <Box sx={{ display: "flex", gap: "2rem" }}>
        <Link
          to="/dashboard"
          style={{
            color: "inherit",
            ...(navItem === "dashboard"
              ? { textDecoration: "underline" }
              : { textDecoration: "none" }),
          }}
        >
          Home
        </Link>
        <Link
          to="/airbyte"
          style={{
            color: "inherit",
            textDecoration: "none",
            ...(navItem === "airbyte"
              ? { textDecoration: "underline" }
              : { textDecoration: "none" }),
          }}
        >
          Airbyte
        </Link>
        <Link
          to="/dbt"
          style={{
            color: "inherit",
            textDecoration: "none",
            ...(navItem === "dbt"
              ? { textDecoration: "underline" }
              : { textDecoration: "none" }),
          }}
        >
          Dbt
        </Link>
        <Link
          style={{ color: "inherit", textDecoration: "none" }}
          onClick={handleLogOut}
        >
          Logout
        </Link>
      </Box>
    </Box>
  );
};

export default Menu;
