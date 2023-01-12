import {
  Modal,
  Box,
  Typography,
  TextField,
  InputLabel,
  Card,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { Close, Add, Delete } from "@mui/icons-material";
import { ToastContext } from "../../../context/toastProvider";
import axios from "axios";
import { errorToast, successToast } from "../../../utils/toastHelper";
import { useNavigate } from "react-router-dom";
import AirbyteCredsInput from "./AirbyteCredsInput";

const CreateModal = ({
  open,
  setOpen,
  refresh,
  setRefresh,
  connector_type,
}) => {
  const [_, toastDispatch] = useContext(ToastContext);

  const [connectorDefs, setConnectorDefs] = useState([]);
  const [connectorDefSpecs, setConnectorDefSpecs] = useState([]);
  const navigate = useNavigate();

  const handleModalClose = () => {
    formik.resetForm();
    setConnectorDefs([]);
    setConnectorDefSpecs([]);
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      connector: "",
      definition_id: "",
      creds: {},
    },
    // validationSchema: SigninValidationSchema,
    onSubmit: (values) => {
      onFormSubmit(values);
    },
  });

  const onFormSubmit = (values) => {
    (async () => {
      axios({
        method: "post",
        url: `${process.env.REACT_APP_API_URL}/api/airbyte/connectors/create`,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        data: {
          name: values.connector,
          definition_id: values.definition_id,
          creds: values.creds,
          type: connector_type,
        },
      })
        .then((res) => {
          setOpen(false);
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

  useEffect(() => {
    // Fetch all sources/destination definitions available from airbyte
    if (open) {
      (async () => {
        axios({
          method: "get",
          url: `${process.env.REACT_APP_API_URL}/api/airbyte/connectors/definitions`,
          params: { type: connector_type },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
          .then((res) => {
            setConnectorDefs(res.data.body);
          })
          .catch((err) => {
            errorToast(toastDispatch, err.data.message, err.data.body);
          });
      })();
    }
  }, [open]);

  useEffect(() => {
    // Fetch source/destination definition specs
    if (open && formik.values.definition_id) {
      (async () => {
        axios({
          method: "get",
          url: `${process.env.REACT_APP_API_URL}/api/airbyte/connectors/definitions/${formik.values.definition_id}/specs`,
          params: { type: connector_type },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
          .then((res) => {
            // Prepare the creds
            let temp = {};
            for (const property of res.data.body) {
              switch (property.type) {
                case "string":
                  temp[`${property.field}`] = "";
                  break;
                case "array":
                  temp[`${property.field}`] = [];
                  break;
                case "integer":
                  temp[`${property.field}`] = null;
                  break;
              }
            }
            formik.setFieldValue("creds", temp);
            // Set the def specs
            setConnectorDefSpecs(res.data.body);
          })
          .catch((err) => {
            errorToast(toastDispatch, err.data.message, err.data.body);
          });
      })();
    }
  }, [formik.values.definition_id]);

  return (
    <>
      <Modal open={open} sx={{ overflow: "scroll" }} onClose={handleModalClose}>
        <form onSubmit={formik.handleSubmit}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              margin: "auto",
              minHeight: "100vh",
              alignItems: "center",
            }}
          >
            <Card
              sx={{
                width: "50%",
                padding: "2rem 2rem",
                alignItems: "center",
                border: "0.0625rem solid #EFEFEF",
                boxShadow: "none",
                borderRadius: "0.75rem",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
                <Button
                  sx={{ minHeight: 0, minWidth: 0, padding: 0, color: "black" }}
                  onClick={handleModalClose}
                >
                  <Close />
                </Button>
              </Box>

              <Box sx={{ marginBottom: "16px" }}>
                <InputLabel sx={{ marginBottom: "5px" }}>
                  Connector name
                </InputLabel>
                <TextField
                  fullWidth
                  id="connector"
                  name="connector"
                  placeholder="Please enter the connector name"
                  onChange={formik.handleChange}
                  value={formik.values.connector}
                  error={
                    formik.touched.connector && Boolean(formik.errors.connector)
                  }
                  helperText={
                    formik.touched.connector && formik.errors.connector
                  }
                />
              </Box>
              <Box marginBottom={{ marginBottom: "16px" }}>
                <InputLabel sx={{ marginBottom: "5px" }}>
                  Connector type
                </InputLabel>
                <Select
                  id="definition_id"
                  name="definition_id"
                  sx={{ width: "100%" }}
                  value={formik.values.definition_id}
                  onChange={formik.handleChange}
                  placeholder="Select connector definition"
                >
                  {connectorDefs.map((connectorDef, idx) => (
                    <MenuItem key={idx} value={connectorDef.uuid}>
                      {connectorDef.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Box sx={{ marginBottom: "16px" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <AirbyteCredsInput
                    specs={connectorDefSpecs}
                    setSpecs={setConnectorDefSpecs}
                    formik={formik}
                  />
                </Box>
              </Box>
              <LoadingButton
                sx={{
                  width: "100%",
                  height: "48px",
                  borderRadius: "5px",
                  marginTop: "16px",
                  background: "black",
                  ":hover": {
                    background: "lightgrey",
                    color: "black",
                  },
                }}
                variant="contained"
                loading={false}
                type="submit"
              >
                Creat a New {connector_type}
              </LoadingButton>
            </Card>
          </Box>
        </form>
      </Modal>
    </>
  );
};

export default CreateModal;
