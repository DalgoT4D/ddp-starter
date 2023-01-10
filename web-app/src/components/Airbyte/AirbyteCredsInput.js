import { Box, InputLabel, TextField } from "@mui/material";
import React from "react";
import MultiTagInput from "../../common/input/MultiTagInput";

const AirbyteCredsInput = ({ specs, setSpecs, formik }) => {
  const handleCredsInputChange = (name, value) => {
    let creds = formik.values.creds;
    creds[name] = value;
    formik.setFieldValue("creds", creds);
    console.log(formik.values);
  };

  const handleTextInputChange = (e) => {
    handleCredsInputChange(e.target.name, e.target.value);
  };

  const handleArrayInputChange = (name, arr) => {
    handleCredsInputChange(name, arr);
  };

  return (
    <>
      {specs.map((spec, idx) =>
        spec.type == "string" ? (
          <Box sx={{ display: "flex", flexDirection: "column" }} key={idx}>
            <InputLabel sx={{ marginBottom: "5px" }}>
              {(spec.title ? spec.title : spec.field) +
                (spec.required ? " *" : "")}
            </InputLabel>
            <TextField
              id={idx}
              key={idx}
              name={spec.field}
              value={formik.values.creds[`${spec.field}`]}
              placeholder={spec.description}
              sx={{ width: "100%" }}
              onChange={handleTextInputChange}
            />
          </Box>
        ) : (
          <MultiTagInput
            idx={idx}
            key={idx}
            name={spec.field}
            label={spec.title ? spec.title : spec.field}
            placeholder={spec.description}
            required={spec.required}
            onArrayInputChange={handleArrayInputChange}
            value={formik.values.creds[`${spec.field}`]}
          />
        )
      )}
    </>
  );
};

export default AirbyteCredsInput;
