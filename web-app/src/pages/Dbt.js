import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "../common/Menu";
import axios from "axios";

const Dbt = () => {
  const [showComponent, setShowComponent] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      axios({
        method: "get",
        url: `${process.env.REACT_APP_API_URL}/auth/profile`,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => {
          setShowComponent(true);
        })
        .catch((err) => {
          localStorage.removeItem("token");
          navigate("/signin");
        });
    })();
  }, []);

  return (
    showComponent && (
      <Box>
        <Menu navItem="dbt" />
        dbt
      </Box>
    )
  );
};

export default Dbt;
