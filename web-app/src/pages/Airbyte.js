import { Box, Button } from "@mui/material";
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

  useEffect(() => {
    (async () => {
      axios({
        method: "get",
        url: `${process.env.REACT_APP_API_URL}/api/airbyte`,
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
  }, [refresh]);

  const handleDeleteConnection = (connection_uuid) => {
    (async () => {
      axios({
        method: "delete",
        url: `${process.env.REACT_APP_API_URL}/api/airbyte/${connection_uuid}/delete`,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => {
          setRefresh(!refresh);
          successToast(toastDispatch, res.data.message);
        })
        .catch((err) => {
          errorToast(toastDispatch, err.data.message, err.data.body);
        });
    })();
  };

  const handleCreateButtonClick = () => {
    setOpenCreateModal(true);
  };

  const handleUpdateButtonClick = (connection_uuid) => {
    setUuid(connection_uuid);
    setOpenUpdateModal(true);
  };

  const headings = [
    {
      connector: "Source name",
    },
    { creds: "Credentials" },
    { status: "Status" },
    { created_at: "Added on" },
    { action: "Action" },
  ];

  return (
    showComponent && (
      <Box>
        <Menu navItem="airbyte" />
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <DataTable
            rows={rows}
            headings={headings}
            onDeleteConnection={handleDeleteConnection}
            onUpdateConnection={handleUpdateButtonClick}
          />
          <Button
            sx={{ minHeight: 0, minWidth: 0 }}
            onClick={handleCreateButtonClick}
          >
            <Add />
          </Button>
        </Box>
        <CreateModal
          open={openCreateModal}
          setOpen={setOpenCreateModal}
          refresh={refresh}
          setRefresh={setRefresh}
        />
        <UpdateModal
          open={openUpdateModal}
          setOpen={setOpenUpdateModal}
          refresh={refresh}
          setRefresh={setRefresh}
          handleUpdateModalOpen={handleUpdateButtonClick}
          uuid={uuid}
        />
      </Box>
    )
  );
};

export default Airbyte;
