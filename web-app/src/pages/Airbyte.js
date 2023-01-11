import { Box, Button, Dialog, DialogTitle, Tab, Tabs } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "../common/Menu";
import axios from "axios";
import DataTable from "../components/Airbyte/DataTable";
import { errorToast, successToast } from "../utils/toastHelper";
import { ToastContext } from "../context/toastProvider";
import { Add } from "@mui/icons-material";
import CreateModal from "../components/Airbyte/CreateModal";
import UpdateModal from "../components/Airbyte/UpdateModal";

const Airbyte = () => {
  const [showComponent, setShowComponent] = useState(false);
  const [rows, setRows] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  const [_, toastDispatch] = useContext(ToastContext);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [uuid, setUuid] = useState("");
  const [tabVal, setTabVal] = useState("source");
  const [destinationDialogBox, setDestinationDialogBox] = useState(false);

  useEffect(() => {
    (async () => {
      axios({
        method: "get",
        url: `${process.env.REACT_APP_API_URL}/api/airbyte/connectors`,
        params: { type: tabVal },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => {
          setShowComponent(true);
          setRows(res.data.body);
        })
        .catch((err) => {
          localStorage.removeItem("token");
          navigate("/signin");
        });
    })();
  }, [refresh, tabVal]);

  const handleDeleteConnection = (connection_uuid) => {
    (async () => {
      axios({
        method: "delete",
        url: `${process.env.REACT_APP_API_URL}/api/airbyte/connectors/${connection_uuid}/delete`,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => {
          setRefresh(!refresh);
          successToast(toastDispatch, res.data.message);
        })
        .catch((err) => {
          errorToast(
            toastDispatch,
            err.response.data.message,
            err.response.data.body
          );
        });
    })();
  };

  const handleCreateConnectorButtonClick = () => {
    if (tabVal === "source") setOpenCreateModal(true);
    else setDestinationDialogBox(true);
  };

  const handleUpdateButtonClick = (connection_uuid) => {
    setUuid(connection_uuid);
    setOpenUpdateModal(true);
  };

  const handleDestinationDialogureClose = () => {
    setDestinationDialogBox(false);
  };

  const handleDialogButtonClick = (e) => {
    setDestinationDialogBox(false);
    // Set up a default destination
    (async () => {
      axios({
        method: "post",
        url: `${process.env.REACT_APP_API_URL}/api/airbyte/connectors/destinations/default`,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => {
          successToast(toastDispatch, res.data.message);
          setRefresh(!refresh);
          navigate("/airbyte");
        })
        .catch((err) => {
          errorToast(
            toastDispatch,
            err.response.data.message,
            err.response.data.body
          );
        });
    })();
  };

  const headings = {
    source: [
      {
        definition_name: "Source name",
      },
      { creds: "Credentials" },
      { status: "Status" },
      { created_at: "Added on" },
      { action: "Action" },
    ],
    destination: [
      {
        definition_name: "Destination name",
      },
      { creds: "Credentials" },
      { status: "Status" },
      { created_at: "Added on" },
      { action: "Action" },
    ],
  };

  return (
    showComponent && (
      <Box>
        <Menu navItem="airbyte" />
        <Box>
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
              onChange={() =>
                tabVal === "source"
                  ? setTabVal("destination")
                  : setTabVal("source")
              }
              aria-label="basic tabs example"
            >
              <Tab label="Source" value="source" />
              <Tab label="Destination" value="destination" />
            </Tabs>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <DataTable
              rows={rows}
              headings={headings[tabVal]}
              onDeleteConnection={handleDeleteConnection}
              onUpdateConnection={handleUpdateButtonClick}
            />
            <Button
              sx={{
                minHeight: 0,
                minWidth: 0,
                alignSelf: "flex-start",
                marginTop: "2rem",
              }}
              onClick={handleCreateConnectorButtonClick}
            >
              <Add />
            </Button>
          </Box>
        </Box>
        <Dialog
          open={destinationDialogBox}
          onClose={handleDestinationDialogureClose}
        >
          <DialogTitle>Continue with the default destination ?</DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              sx={{
                width: "40%",
                minWidth: 0,
                minHeight: 0,
                color: "white",
                background: "black",
                ":hover": { color: "white", background: "black" },
                margin: "2rem",
              }}
              defaultValue="yes"
              onClick={handleDialogButtonClick}
            >
              Continue
            </Button>
          </Box>
        </Dialog>
        <CreateModal
          open={openCreateModal}
          setOpen={setOpenCreateModal}
          refresh={refresh}
          setRefresh={setRefresh}
          connector_type={tabVal}
        />
        <UpdateModal
          open={openUpdateModal}
          setOpen={setOpenUpdateModal}
          refresh={refresh}
          setRefresh={setRefresh}
          handleUpdateModalOpen={handleUpdateButtonClick}
          uuid={uuid}
          connector_type={tabVal}
        />
      </Box>
    )
  );
};

export default Airbyte;
