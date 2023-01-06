import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Card,
  InputLabel,
  TextField,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  Checkbox,
} from "@mui/material";
import { useFormik } from "formik";
import { RegisterValidationSchema } from "../../utils/validations";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { LoadingButton } from "@mui/lab";
import { ToastContext } from "../../context/toastProvider";
import { errorToast, successToast } from "../../utils/toastHelper";

const SignupForm = ({
  onFormSubmit,
  loading,
  showPassword,
  setShowPassword,
}) => {
  const [orgs, setOrgs] = useState([]);
  const [isExistingOrg, setIsExistingOrg] = useState(false);
  const [_, toastDispatch] = useContext(ToastContext);

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      organisation_id: "",
      organisation_name: "",
    },
    validationSchema: RegisterValidationSchema,
    onSubmit: (values) => {
      if (isExistingOrg) {
        delete values["organisation_name"];
      } else {
        delete values["organisation_id"];
      }
      onFormSubmit(values);
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    (async () => {
      axios({
        method: "get",
        url: `${process.env.REACT_APP_API_URL}/api/public/organisations`,
      })
        .then((res) => {
          setOrgs(res.data.body);
        })
        .catch((err) => {
          errorToast(
            toastDispatch,
            err.response.data.message,
            err.response.data.body
          );
        });
    })();
  }, []);

  return (
    <Container>
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
            <Box sx={{ marginBottom: "16px" }}>
              <InputLabel sx={{ marginBottom: "5px" }}>First Name</InputLabel>
              <TextField
                fullWidth
                id="first_name"
                name="first_name"
                placeholder="Please enter your first name"
                onChange={formik.handleChange}
                value={formik.values.first_name}
                error={
                  formik.touched.first_name && Boolean(formik.errors.first_name)
                }
                helperText={
                  formik.touched.first_name && formik.errors.first_name
                }
              />
            </Box>
            <Box sx={{ marginBottom: "16px" }}>
              <InputLabel sx={{ marginBottom: "5px" }}>Last Name</InputLabel>
              <TextField
                fullWidth
                id="last_name"
                name="last_name"
                placeholder="Please enter your last name"
                onChange={formik.handleChange}
                value={formik.values.last_name}
                error={
                  formik.touched.last_name && Boolean(formik.errors.last_name)
                }
                helperText={formik.touched.last_name && formik.errors.last_name}
              />
            </Box>
            <Box sx={{ marginBottom: "16px" }}>
              <InputLabel sx={{ marginBottom: "5px" }}>Email</InputLabel>
              <TextField
                fullWidth
                id="email"
                name="email"
                placeholder="Please enter your email"
                onChange={formik.handleChange}
                value={formik.values.email}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Box>
            <Box sx={{ marginBottom: "16px" }}>
              <InputLabel sx={{ marginBottom: "5px" }}>Password</InputLabel>
              <TextField
                fullWidth
                id="password"
                name="password"
                placeholder="Please enter your password"
                onChange={formik.handleChange}
                value={formik.values.password}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment>
                      <Box>
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOutlinedIcon />
                          ) : (
                            <VisibilityOffOutlinedIcon />
                          )}
                        </IconButton>
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box sx={{ marginBottom: "16px", display: "flex" }}>
              <Box sx={{ width: "100%" }}>
                <InputLabel sx={{ marginBottom: "5px" }}>
                  Existing organisation ?
                </InputLabel>
                <Checkbox
                  checked={isExistingOrg}
                  onClick={() => setIsExistingOrg(!isExistingOrg)}
                />
              </Box>
              {isExistingOrg ? (
                <Box sx={{ width: "100%" }}>
                  <InputLabel sx={{ marginBottom: "5px" }}>
                    Select organisation
                  </InputLabel>
                  <Select
                    id="organisation_id"
                    name="organisation_id"
                    sx={{ width: "100%" }}
                    value={formik.values.organisation_id}
                    onChange={formik.handleChange}
                  >
                    {orgs.map((org, idx) => (
                      <MenuItem value={org.id}>{org.name}</MenuItem>
                    ))}
                  </Select>
                </Box>
              ) : (
                <Box sx={{ width: "100%" }}>
                  <InputLabel sx={{ marginBottom: "5px" }}>
                    Add New Organisation
                  </InputLabel>
                  <TextField
                    fullWidth
                    id="organisation_name"
                    name="organisation_name"
                    placeholder="Please enter organisation name"
                    onChange={formik.handleChange}
                    value={formik.values.organisation_name}
                    error={
                      formik.touched.organisation_name &&
                      Boolean(formik.errors.organisation_name)
                    }
                    helperText={
                      formik.touched.organisation_name &&
                      formik.errors.organisation_name
                    }
                  />
                </Box>
              )}
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
              Register
            </LoadingButton>
          </Card>
        </Box>
      </form>
    </Container>
  );
};

export default SignupForm;
