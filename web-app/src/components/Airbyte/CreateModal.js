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
import { ToastContext } from "../../context/toastProvider";
import axios from "axios";
import { errorToast, successToast } from "../../utils/toastHelper";
import { useNavigate } from "react-router-dom";
import AirbyteCredsInput from "./AirbyteCredsInput";

const CreateModal = ({ open, setOpen, refresh, setRefresh }) => {
  const [_, toastDispatch] = useContext(ToastContext);

  const [sourceDefs, setSourceDefs] = useState([]);
  const [sourceDefSpecs, setSourceDefSpecs] = useState([]);
  const navigate = useNavigate();

  const handleModalClose = () => {
    formik.resetForm();
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      connector: "",
      source_definition_id: "",
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
        url: `${process.env.REACT_APP_API_URL}/api/airbyte/create`,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        data: {
          connector: values.connector,
          source_definition_id: values.source_definition_id,
          creds: values.creds,
        },
      })
        .then((res) => {
          setOpen(false);
          successToast(toastDispatch, res.data.message);
          setRefresh(!refresh);
          navigate("/airbyte");
        })
        .catch((err) => {
          errorToast(toastDispatch, err.data.message, err.data.body);
        });
    })();
  };

  useEffect(() => {
    // Fetch all source available from airbyte
    if (open) {
      (async () => {
        axios({
          method: "get",
          url: `${process.env.REACT_APP_API_URL}/api/airbyte/source_definitions`,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
          .then((res) => {
            setSourceDefs(res.data.body);
          })
          .catch((err) => {
            errorToast(toastDispatch, err.data.message, err.data.body);
          });
      })();
    }
  }, [open]);

  useEffect(() => {
    // Fetch source definition specs
    if (formik.values.source_definition_id) {
      (async () => {
        axios({
          method: "get",
          url: `${process.env.REACT_APP_API_URL}/api/airbyte/source_definitions/${formik.values.source_definition_id}/specs`,
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
              }
            }
            formik.setFieldValue("creds", temp);
            // Set the source def specs
            setSourceDefSpecs(res.data.body);
          })
          .catch((err) => {
            errorToast(toastDispatch, err.data.message, err.data.body);
          });
      })();
    }
  }, [formik.values.source_definition_id]);

  return (
    <>
      <Modal open={open} sx={{ overflow: "scroll" }}>
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
                  id="source_definition_id"
                  name="source_definition_id"
                  sx={{ width: "100%" }}
                  value={formik.values.source_definition_id}
                  onChange={formik.handleChange}
                >
                  {sourceDefs.map((sourceDef, idx) => (
                    <MenuItem key={idx} value={sourceDef.sourceDefinitionId}>
                      {sourceDef.name}
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
                    specs={sourceDefSpecs}
                    setSpecs={setSourceDefSpecs}
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
                Add Connection
              </LoadingButton>
            </Card>
          </Box>
        </form>
      </Modal>
    </>
  );
};

export default CreateModal;
