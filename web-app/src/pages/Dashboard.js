import React, { Component, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      axios({
        method: "get",
        url: `${process.env.REACT_APP_API_URL}/auth/profile`,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => {
          setShowDashboard(true);
        })
        .catch((err) => {
          localStorage.removeItem("token");
          navigate("/signin");
        });
    })();
  }, []);

  return showDashboard && <div>Dashboard</div>;
};

export default Dashboard;
