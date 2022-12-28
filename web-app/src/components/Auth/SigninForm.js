import React from "react";
import {
  Container,
  Box,
  Card,
  InputLabel,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useFormik } from "formik";
import { SigninValidationSchema } from "../../utils/validations";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { LoadingButton } from "@mui/lab";

const SigninForm = ({
  onFormSubmit,
  loading,
  showPassword,
  setShowPassword,
}) => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: SigninValidationSchema,
    onSubmit: (values) => {
      onFormSubmit(values);
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
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
              Sign in
            </LoadingButton>
          </Card>
        </Box>
      </form>
    </Container>
  );
};

export default SigninForm;
