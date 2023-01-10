import {
  Box,
  InputLabel,
  TextField,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const Tag = ({ id, tag, onCloseTag }) => {
  return (
    <Box
      sx={{
        background: "#283240",
        height: "100%",
        display: "flex",
        padding: "0.3rem 0.4rem 0.3rem 0.4rem",
        margin: "0 0.5rem 0 0",
        justifyContent: "center",
        alignContent: "center",
        color: "#ffffff",
        borderRadius: "1rem",
        gap: "1rem",
        maxWidth: "150px",
      }}
    >
      <Stack direction="row" gap={5} sx={{ width: "90%" }}>
        <Typography>
          {tag.slice(0, 15) + (tag.length > 15 ? "..." : "")}
        </Typography>
      </Stack>
      <Button
        id={id}
        sx={{
          color: "inherit",
          minHeight: 0,
          minWidth: 0,
          padding: 0,
          fontSize: "12px",
        }}
        onClick={onCloseTag}
      >
        x
      </Button>
    </Box>
  );
};

const MultiTagInput = ({
  label,
  idx,
  name,
  onArrayInputChange,
  value,
  placeholder = "",
  required = false,
}) => {
  const [fieldInp, setFieldInp] = useState("");

  const handleCloseTag = (e) => {
    let temp = [].concat(
      value.slice(0, e.target.id),
      value.slice(Number(e.target.id) + 1, value.length)
    );
    onArrayInputChange(name, temp);
  };

  const enterInput = (e) => {
    let temp = [];
    switch (e.key) {
      case " ":
        if (e.target.value.trim().length > 1) {
          temp = value.slice();
          temp.push(e.target.value.trim());
          onArrayInputChange(name, temp);
          setFieldInp("");
        }
        break;

      case "Backspace":
      case "Delete":
        if (fieldInp == "") {
          temp = value.slice(0, value.length - 1);
          onArrayInputChange(name, temp);
          setFieldInp("");
        }
        break;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }} key={idx}>
      <InputLabel sx={{ marginBottom: "5px" }}>
        {label + (required ? " *" : "")}
      </InputLabel>
      <TextField
        multiline
        id={idx}
        name={name}
        placeholder={placeholder}
        sx={{ width: "100%" }}
        value={fieldInp}
        InputProps={{
          startAdornment: (
            <Box
              sx={{
                margin: "0 0.2rem 0 0",
                display: "flex",
                maxWidth: "1000px",
                padding: "5px 0 5px 0",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              {value.map((inp, idx) => (
                <Tag id={idx} tag={inp} key={idx} onCloseTag={handleCloseTag} />
              ))}
            </Box>
          ),
        }}
        onKeyDown={enterInput}
        onChange={(e) => setFieldInp(e.target.value)}
      />
    </Box>
  );
};

export default MultiTagInput;
