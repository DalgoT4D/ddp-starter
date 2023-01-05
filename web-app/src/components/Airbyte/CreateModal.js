import {
  Modal,
  Box,
  Typography,
  TextField,
  InputLabel,
  Card,
  Button,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { Close, Add, Delete } from "@mui/icons-material";
import { ToastContext } from "../../context/toastProvider";
import axios from "axios";
import { errorToast, successToast } from "../../utils/toastHelper";
import { useNavigate } from "react-router-dom";

const CreateModal = ({ open, setOpen, refresh, setRefresh }) => {
  const [_, toastDispatch] = useContext(ToastContext);

  const [creds, setCreds] = useState([{ key: "", value: "" }]);
  const navigate = useNavigate();

  const handleModalClose = () => {
    formik.resetForm();
    setCreds([{ key: "", value: "" }]);
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      connector: "",
      creds: "",
    },
    // validationSchema: SigninValidationSchema,
    onSubmit: (values) => {
      onFormSubmit(values);
    },
  });

  const onCredsChange = (event) => {
    let id = event.target.id;
    let type = event.target.name;
    let temp = creds.slice();

    temp[id] = {
      key: type === "key" ? event.target.value : creds[id].key,
      value: type === "value" ? event.target.value : creds[id].value,
    };
    setCreds(temp);
  };

  const addCredFields = (e) => {
    setCreds([...creds, { key: "", value: "" }]);
  };

  const deleteCredFields = (idx) => {
    setCreds(creds.filter((val, i) => i !== idx));
  };

  const onFormSubmit = (values) => {
    let credentials = {};
    creds.map((obj, idx) => {
      credentials[obj.key] = obj.value;
    });
    (async () => {
      axios({
        method: "post",
        url: `${process.env.REACT_APP_API_URL}/api/airbyte/create`,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        data: {
          connector: values.connector,
          creds: credentials,
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

  return (
    <>
      <Modal open={open}>
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
              <Box sx={{ marginBottom: "16px" }}>
                <InputLabel sx={{ marginBottom: "5px" }}>
                  Credentials
                </InputLabel>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
                >
                  {creds.map((cred, idx) => (
                    <Box sx={{ display: "flex", gap: "2rem" }} key={idx}>
                      <TextField
                        id={idx}
                        name="key"
                        placeholder="Please enter the key"
                        onChange={onCredsChange}
                        value={cred.key}
                      />
                      <TextField
                        id={idx}
                        name="value"
                        placeholder="Please enter the value"
                        onChange={onCredsChange}
                        value={cred.value}
                      />
                      {idx === creds.length - 1 ? (
                        <Button
                          sx={{
                            color: "black",
                          }}
                          onClick={addCredFields}
                        >
                          <Add />
                        </Button>
                      ) : (
                        <Button
                          id={idx}
                          sx={{
                            color: "black",
                          }}
                          onClick={() => deleteCredFields(idx)}
                        >
                          <Delete />
                        </Button>
                      )}
                    </Box>
                  ))}
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
