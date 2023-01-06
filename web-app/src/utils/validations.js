import * as Yup from "yup";

export const RegisterValidationSchema = Yup.object({
  first_name: Yup.string()
    .max(50, "First name must be 50 characters or less")
    .required("Please enter the first name"),
  last_name: Yup.string()
    .max(50, "First name must be 50 characters or less")
    .required("Please enter the last name"),
  email: Yup.string()
    .max(50, "First name must be 50 characters or less")
    .required("Please enter the email id"),
  password: Yup.string()
    .min(6, "Password must be atleast 6 characters")
    .required("Please enter the password"),
  organisation_id: Yup.number()
    .integer()
    .min(1, "Invalid organisation selected"),
  organisation_name: Yup.string().max(
    255,
    "Organisation name must be 255 characters or less"
  ),
});

export const SigninValidationSchema = Yup.object({
  email: Yup.string()
    .max(50, "First name must be 50 characters or less")
    .required("Please enter the email id"),
  password: Yup.string()
    .min(6, "Password must be atleast 6 characters")
    .required("Please enter the password"),
});
