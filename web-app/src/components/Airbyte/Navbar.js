import { Box, Tab, Tabs } from "@mui/material";
import React from "react";

const Navbar = ({ tabVal, setTabVal }) => {
  const handleTabValChange = (e, newVal) => {
    setTabVal(newVal);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Tabs
        value={tabVal}
        onChange={handleTabValChange}
        aria-label="basic tabs example"
      >
        <Tab label="Warehouse" value="destination" />
        <Tab label="Source" value="source" />
        {/* <Tab label="Transformation" value="transformation" />
        <Tab label="Orchestration" value="orchestration" /> */}
      </Tabs>
    </Box>
  );
};

export default Navbar;
