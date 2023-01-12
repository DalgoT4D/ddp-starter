import React, { useContext, useEffect, useState } from "react";
import { errorToast, successToast } from "./../../../utils/toastHelper";
import { ToastContext } from "./../../../context/toastProvider";
import axios from "axios";
import { Add } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import DataTable from "./../../../common/Datatable";

const Connection = () => {
  const [_, toastDispatch] = useContext(ToastContext);
  const [rows, setRows] = useState([]);
  const [showComponent, setShowComponent] = useState(false);

  const handleCreateConnectionButtonClick = () => {};

  const handleUpdateButtonClick = (uuid) => {};

  const handleDeleteConnection = (uuid) => {};

  useEffect(() => {
    (async () => {
      axios({
        method: "get",
        url: `${process.env.REACT_APP_API_URL}/api/airbyte/connections`,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => {
          setShowComponent(true);
          setRows(res.data.body);
        })
        .catch((err) => {
          setShowComponent(true);
          errorToast(
            toastDispatch,
            err.response.data.message,
            err.response.data.body
          );
        });
    })();
  }, []);

  const headings = [
    { name: "Source", field: "source" },
    { name: "Destination", field: "destination" },
    { name: "Sync Frequency", field: "sync_frequency" },
    { name: "Status", field: "status" },
    { name: "Added on", field: "created_at" },
    { name: "Action", field: "action" },
  ];

  return (
    <Box>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <DataTable
            rows={[]}
            headings={headings}
            onDeleteRow={handleDeleteConnection}
            onUpdateRow={handleUpdateButtonClick}
          />
          <Button
            sx={{
              minHeight: 0,
              minWidth: 0,
              alignSelf: "flex-start",
              marginTop: "2rem",
            }}
            onClick={handleCreateConnectionButtonClick}
          >
            <Add />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Connection;
