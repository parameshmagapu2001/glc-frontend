"use client";

import React from "react";
import { Modal, Box, Typography, IconButton, Button, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface MarkAsSoldModalProps {
  open: boolean;
  onClose: () => void;
  options: string[];
}

const MarkAsSoldModal: React.FC<MarkAsSoldModalProps> = ({ open, onClose, options }) => {
  const [reason, setReason] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setReason(event.target.value as string);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 480, 
          bgcolor: "white",
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Title */}
        <Typography variant="h6" fontWeight="bold" textAlign="center" mb={2}>
          Mark as Sold
        </Typography>

        {/* Description */}
        <Typography variant="body1" textAlign="center" color="textSecondary" mb={3}>
          Please select how the farmland has been sold
        </Typography>

        {/* Select Box */}
        <Select
          value={reason}
          onChange={handleChange}
          displayEmpty
          fullWidth
          sx={{
            bgcolor: "rgba(130, 128, 255, 0.09)",
            borderRadius: 0.5,
            height: 40,
            border: "1px solid #E0E0E0",
            "& .MuiSelect-select": {
              padding: "12px 14px",
            },
          }}
        >
          <MenuItem value="">Select Reason</MenuItem>
          {options.map((option, index) => (
            <MenuItem key={index} value={option}>{option}</MenuItem>
          ))}
        </Select>

        {/* Submit Button */}
        <Button
          variant="contained"
          sx={{
            mt: 5, 
            width: 140,
            height: 45, 
            borderRadius: 2,
            backgroundColor: "#906CFF",
            float: "right", 
            "&:hover": {
              backgroundColor: "#906CFF",
            },
          }}
        >
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default MarkAsSoldModal;
