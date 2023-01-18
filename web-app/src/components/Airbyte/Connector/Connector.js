import { Box, Button, Dialog, DialogTitle, Tab, Tabs } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DataTable from "./../../../common/Datatable";
import { errorToast, successToast } from "./../../../utils/toastHelper";
import { ToastContext } from "./../../../context/toastProvider";
import { Add } from "@mui/icons-material";
import CreateModal from "./CreateModal";
import UpdateModal from "./UpdateModal";

const Connector = ({ connector_type }) => {
  const [showComponent, setShowComponent] = useState(false);
  const [rows, setRows] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  const [_, toastDispatch] = useContext(ToastContext);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [uuid, setUuid] = useState("");
  const [destinationDialogBox, setDestinationDialogBox] = useState(false);
  const [syncButtonLoading, setSyncButtonLoading] = useState(false);

  useEffect(() => {
    (async () => {
      axios({
        method: "get",
        url: `${process.env.REACT_APP_API_URL}/api/airbyte/connectors`,
        params: { type: connector_type },
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
  }, [refresh, connector_type]);

  const handleDeleteConnector = (connection_uuid) => {
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
    if (connector_type === "source") setOpenCreateModal(true);
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

  const handleSyncButtonClick = (connection_uuid) => {
    setSyncButtonLoading(true);
    // Trigger manual data sync
    (async () => {
      axios({
        method: "post",
        url: `${process.env.REACT_APP_API_URL}/api/airbyte/connections/${connection_uuid}/sync`,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => {
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

  const headings = {
    source: [
      { name: "Name", field: "name" },
      {
        name: "Connector",
        field: "definition_name",
      },
      { name: "Credentials", field: "creds", type: "object" },
      { name: "Status", field: "status" },
      { name: "Added On", field: "created_at", type: "date" },
      { name: "Action", field: "action" },
    ],
    destination: [
      { name: "Name", field: "name" },
      {
        name: "Connector",
        field: "definition_name",
      },
      { name: "Credentials", field: "creds", type: "object" },
      { name: "Status", field: "status" },
      { name: "Added On", field: "created_at", type: "date" },
      { name: "Action", field: "action" },
    ],
  };

  return (
    showComponent && (
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
              rows={rows}
              headings={headings[connector_type]}
              onDeleteRow={handleDeleteConnector}
              onUpdateRow={handleUpdateButtonClick}
              customActionButton={{
                label: "Sync Now",
                handler: handleSyncButtonClick,
                loading: syncButtonLoading,
              }}
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
          connector_type={connector_type}
        />
        <UpdateModal
          open={openUpdateModal}
          setOpen={setOpenUpdateModal}
          refresh={refresh}
          setRefresh={setRefresh}
          handleUpdateModalOpen={handleUpdateButtonClick}
          uuid={uuid}
          connector_type={connector_type}
        />
      </Box>
    )
  );
};

export default Connector;
