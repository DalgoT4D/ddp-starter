import { Box } from "@mui/material";
import React, { useState } from "react";
import Menu from "../common/Menu";
import Navbar from "../components/Airbyte/Navbar";
import Connector from "../components/Airbyte/Connector/Connector";
import Transformer from "../components/Dbt/Transformer";

const Airbyte = () => {
  const [tabVal, setTabVal] = useState("source");

  return (
    <Box>
      <Menu navItem="airbyte" />
      <Navbar tabVal={tabVal} setTabVal={setTabVal} />
      {(tabVal === "source" || tabVal === "destination") && (
        <Connector connector_type={tabVal} />
      )}
      {tabVal === "transformation" && <Transformer />}
      {tabVal === "orchestration" && <div>orchestration</div>}
    </Box>
  );
};

export default Airbyte;
