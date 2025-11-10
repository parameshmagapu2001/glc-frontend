"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
  Stack,
} from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const ALL_REQUESTS = [
  {
    requestId: "REQ-1001",
    farmlandId: "GLCSOS 05",
    requester: "Office Admin",
    requestedOn: "10th Oct",
    status: "Pending",
    details: "Need owner documents",
  },
  {
    requestId: "REQ-1002",
    farmlandId: "GLCSOS 07",
    requester: "Field Officer",
    requestedOn: "11th Oct",
    status: "Info Sent",
    details: "Requested GPS coordinates",
  },
  // ... add more to test pagination
];

export default function RequestsPage() {
  const router = useRouter();

  // pagination
  const [page, setPage] = useState<number>(1);
  const rowsPerPage = 10;
  const total = ALL_REQUESTS.length;
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));

  const currentRows = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return ALL_REQUESTS.slice(start, start + rowsPerPage);
  }, [page]);

  const gotoPage = (p: number) => {
    if (p < 1) p = 1;
    if (p > totalPages) p = totalPages;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, pt: 3, bgcolor: "#F4F7FE", minHeight: "100vh" }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <IconButton
          onClick={() => router.push("/admin/intelligence-officer/dashboard")}
          sx={{ bgcolor: "white", boxShadow: "0 6px 20px rgba(2,6,23,0.06)", width: 44, height: 44 }}
          size="large"
          aria-label="back to dashboard"
        >
          <ArrowBackIosNewIcon />
        </IconButton>

        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 , color:"chocolate" }}>
            Dashboard / Requested Info
          </Typography>
        </Box>
      </Stack>

      <Card sx={{ p: 3, borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#F1F5F9" }}>
              <TableCell>Request ID</TableCell>
              <TableCell>Farmland ID</TableCell>
              <TableCell>Requester</TableCell>
              <TableCell>Requested On</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {currentRows.map((r, idx) => (
              <TableRow key={idx} hover>
                <TableCell>{r.requestId}</TableCell>

                <TableCell>
                  <Typography
                    sx={{ color: "#2563EB", cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => router.push(`/admin/intelligence-officer/farmland/${encodeURIComponent(r.farmlandId)}`)}
                  >
                    {r.farmlandId}
                  </Typography>
                </TableCell>

                <TableCell>{r.requester}</TableCell>
                <TableCell>{r.requestedOn}</TableCell>

                <TableCell>
                  <Box
                    sx={{
                      display: "inline-block",
                      px: 2,
                      py: "4px",
                      borderRadius: 6,
                      color: "white",
                      bgcolor: r.status === "Pending" ? "#F59E0B" : "#10B981",
                    }}
                  >
                    {r.status}
                  </Box>
                </TableCell>

                <TableCell>{r.details}</TableCell>

                <TableCell>
                  <Button onClick={() => router.push(`/admin/intelligence-officer/farmland/${encodeURIComponent(r.farmlandId)}`)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {currentRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: "center", color: "gray", py: 6 }}>
                  No requests found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* pagination footer */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 3 }}>
          <Typography sx={{ color: "#64748B" }}>
            Showing <b>{Math.min(page * rowsPerPage, total) - (page - 1) * rowsPerPage}</b> of <b>{total}</b>
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton onClick={() => gotoPage(1)} disabled={page === 1}><FirstPageIcon /></IconButton>
            <IconButton onClick={() => gotoPage(page - 1)} disabled={page === 1}><ChevronLeftIcon /></IconButton>

            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              return (
                <Button
                  key={p}
                  onClick={() => gotoPage(p)}
                  variant={p === page ? "contained" : "text"}
                  sx={{
                    minWidth: 36,
                    height: 36,
                    borderRadius: 2,
                    textTransform: "none",
                    boxShadow: p === page ? "0 8px 24px rgba(37,99,235,0.12)" : "none",
                    color: "#2563EB",
                  }}
                >
                  {p}
                </Button>
              );
            })}

            <IconButton onClick={() => gotoPage(page + 1)} disabled={page === totalPages}><ChevronRightIcon /></IconButton>
            <IconButton onClick={() => gotoPage(totalPages)} disabled={page === totalPages}><LastPageIcon /></IconButton>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
}
