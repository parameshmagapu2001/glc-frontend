"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { TimelineOppositeContent } from "@mui/lab";

export interface Comment {
  action: string;
  description: string;
  date: string;
  status: "completed" | "pending" | "inactive";
}

export interface UserDetails {
  name: string;
  mobile: string;
  email: string;
  plan: string;
}

export interface CommentDetailsModalProps {
  open: boolean;
  onClose: () => void;
  date: string;
  time: string;
  status: string;
  subscription: string;
  comments: Comment[];
  userDetails: UserDetails;
}

const StyledTable = styled(Table)(({ theme }) => ({
  border: '1px solid #8280FF',
  borderCollapse: 'collapse',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:not(:last-child)': { 
    borderBottom: '1px solid #C6C6C6 !important',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  textAlign: 'right',
  backgroundColor: '#F3F3FF',
  borderRight: '1px solid #8280FF !important',
  fontWeight: 'bold',
  fontSize: '14px',
}));

const HighlightedTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: '#F3F3FF',
  fontSize: '14px',
}));

const CommentDetailsModal: React.FC<CommentDetailsModalProps> = ({
  open,
  onClose,
  date,
  time,
  status,
  subscription,
  comments,
  userDetails,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="md">
    <DialogTitle sx={{ fontWeight: "bold", textAlign: "left", p: 3 }}>
      Comment Details
    </DialogTitle>
    <DialogContent>
      {/* Date, Time, Status, Subscription */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: "#f9f9ff",
          borderRadius: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="body2" gutterBottom>
          <strong>📅 Date:</strong>
          <Typography variant="body2">{date}</Typography>
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>⏰ Time:</strong>
          <Typography variant="body2">{time}</Typography>
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>🟡 Status:</strong>
          <Typography variant="body2">{status}</Typography>
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>🔔 Subscription:</strong>
          <Typography variant="body2">{subscription}</Typography>
        </Typography>
      </Paper>

      {/* Comments Timeline */}
      <Timeline>
        {comments.map((comment, index) => (
          <TimelineItem key={index}>
            <TimelineSeparator>
              <TimelineDot
                variant="outlined"
                color={comment.status === "completed" ? "primary" : "grey"}
                sx={{ borderWidth: 4, width: 22, height: 22 }}
              />
              {index < comments.length - 1 && (
                <TimelineConnector sx={{ backgroundColor: "primary.main" }} />
              )}
            </TimelineSeparator>
            <TimelineContent>
              <Typography fontWeight="bold">{comment.action}</Typography>
              <Typography variant="body2" color="textSecondary">
                {comment.description}
              </Typography>
            </TimelineContent>
            <TimelineOppositeContent color="textSecondary">
              {comment.date}
            </TimelineOppositeContent>
          </TimelineItem>
        ))}
      </Timeline>

      {/* User Details Table */}
      <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
        <strong>User Details:</strong>
      </Typography>
      <TableContainer sx={{ mb: 3, borderRadius: "4px" }}>
        <StyledTable>
          <TableBody>
            <StyledTableRow>
              <StyledTableCell>User Name</StyledTableCell>
              <TableCell sx={{ fontSize: "14px" }}>{userDetails.name}</TableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>Mobile Number</StyledTableCell>
              <HighlightedTableCell>{userDetails.mobile}</HighlightedTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>Email</StyledTableCell>
              <TableCell sx={{ fontSize: "14px" }}>{userDetails.email}</TableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>Subscription Plan</StyledTableCell>
              <HighlightedTableCell>{userDetails.plan}</HighlightedTableCell>
            </StyledTableRow>
          </TableBody>
        </StyledTable>
      </TableContainer>

      {/* Done Button */}
      <Box textAlign="right" mb={2}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            backgroundColor: "#9C89F6",
            color: "#fff",
            textTransform: "none",
            borderRadius: "12px",
            px: 4,
            py: 1,
            "&:hover": { backgroundColor: "#7A6BD9" },
          }}
        >
          Done
        </Button>
      </Box>
    </DialogContent>
  </Dialog>
);

export default CommentDetailsModal;

