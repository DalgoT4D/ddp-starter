import React from "react";
import { Box, Snackbar } from "@mui/material";

const ToastMessage = ({ open, seconds, message, messages, handleClose }) => {
  const handleCloseButton = () => {
    handleClose();
  };

  return (
    <Box>
      <Snackbar
        open={open}
        autoHideDuration={seconds * 1000}
        message={message}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={handleCloseButton}
      />
    </Box>
  );
};

export default ToastMessage;
