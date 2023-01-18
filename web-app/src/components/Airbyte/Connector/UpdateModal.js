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

const UpdateModal = ({
  open,
  setOpen,
  refresh,
  setRefresh,
  uuid,
  connector_type,
}) => {
  const [_, toastDispatch] = useContext(ToastContext);

  const [connectorDefs, setConnectorDefs] = useState([]);
  const [connectorDefSpecs, setConnectorDefSpecs] = useState([]);
  const [loading, setLoading] = useState(false);
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
    // Fetch the connector
    if (open) {
      (async () => {
        axios({
          method: "get",
          url: `${process.env.REACT_APP_API_URL}/api/airbyte/connectors/${uuid}`,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
          .then((res) => {
            formik.setFieldValue("connector", res.data.body?.name);
            formik.setFieldValue("definition_id", res.data.body?.definition_id);
            formik.setFieldValue("creds", res.data.body?.creds);
          })
          .catch((err) => {
            errorToast(toastDispatch, err.data.message, err.data.body);
          });
      })();
    }
  }, [connectorDefs]);

  useEffect(() => {
    // Fetch source/destination definition specs
    if (open) {
      (async () => {
        axios({
          method: "get",
          url: `${process.env.REACT_APP_API_URL}/api/airbyte/connectors/definitions/${formik.values.definition_id}/specs`,
          params: { type: connector_type },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
          .then((res) => {
            // Set the connector def specs
            setConnectorDefSpecs(res.data.body);
          })
          .catch((err) => {
            errorToast(toastDispatch, err.data.message, err.data.body);
          });
      })();
    }
  }, [formik.values.definition_id]);

  const onFormSubmit = (values) => {
    (async () => {
      setLoading(true);
      axios({
        method: "put",
        url: `${process.env.REACT_APP_API_URL}/api/airbyte/connectors/${uuid}/update`,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        data: {
          name: values.connector,
          definition_id: values.definition_id,
          creds: values.creds,
          type: connector_type,
        },
      })
        .then((res) => {
          setLoading(false);
          setOpen(false);
          successToast(toastDispatch, res.data.message);
          setRefresh(!refresh);
          navigate("/airbyte");
        })
        .catch((err) => {
          setLoading(false);
          errorToast(
            toastDispatch,
            err.response.data.message,
            err.response.data.body
          );
        });
    })();
  };

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
                  Source name
                </InputLabel>
                <TextField
                  fullWidth
                  id="connector"
                  name="connector"
                  placeholder="Please enter the source connector name"
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
                  Source type
                </InputLabel>
                <Select
                  id="definition_id"
                  name="definition_id"
                  sx={{ width: "100%", background: "lightgrey" }}
                  value={formik.values.definition_id}
                  onChange={formik.handleChange}
                  readOnly={true}
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
                loading={loading}
                type="submit"
              >
                Update connector
              </LoadingButton>
            </Card>
          </Box>
        </form>
      </Modal>
    </>
  );
};

export default UpdateModal;
