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
  Avatar,
  Stack,
  Button,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import VisibilityIcon from "@mui/icons-material/Visibility";

/**
 * AssignedPage
 *
 * - Pagination UI: Showing X of Y  + First / Prev / numbered pages / Next / Last
 * - Columns: Avatar + Agent Name, Farmland ID (link), Location, Time, Land Extend, Amount (bold), Value Per Acre, View
 * - Replace sample data with API when ready.
 */

/* ------------------ sample data generator ------------------ */
/* create 29 sample rows for pagination demo */
function makeRows(total = 29) {
  const base = [
    {
      agent: "Ram Varma",
      avatar: "/images/agent1.png",
      id: "GLCSOS 01",
      location: "West Godavari, Tanuku",
      time: "6th Oct - 12:53 PM",
      area: "100 acres",
      amount: "25 Lakhs",
      valuePerAcre: "10000.00",
    },
    {
      agent: "Krishna",
      avatar: "/images/agent2.png",
      id: "GLCSOS 02",
      location: "West Godavari, Tanuku",
      time: "5th Oct - 10:33 PM",
      area: "100 acres",
      amount: "40 Lakhs",
      valuePerAcre: "10000.00",
    },
    {
      agent: "Satish",
      avatar: "/images/agent3.png",
      id: "GLCSOS 03",
      location: "West Godavari, Tanuku",
      time: "4th Oct - 09:53 PM",
      area: "100 acres",
      amount: "34 Lakhs",
      valuePerAcre: "10000.00",
    },
    {
      agent: "Paramesh",
      avatar: "/images/agent4.png",
      id: "GLCSOS 04",
      location: "West Godavari, Tanuku",
      time: "3rd Oct - 04:13 PM",
      area: "100 acres",
      amount: "14 Lakhs",
      valuePerAcre: "10000.00",
    },
  ];

  const rows: typeof base = [];
  for (let i = 0; i < total; i++) {
    const b = base[i % base.length];
    // create unique id suffix to avoid duplicated encoded id collisions
    const suffix = i < 9 ? `0${i + 1}` : `${i + 1}`;
    rows.push({
      ...b,
      id: `GLCSOS ${suffix}`,
      agent: b.agent + (i >= base.length ? ` ${i + 1}` : ""),
    });
  }
  return rows;
}

const ALL_ROWS = makeRows(29);

/* ------------------ component ------------------ */
export default function AssignedPage() {
  const router = useRouter();

  // pagination state
  const [page, setPage] = useState<number>(1); // 1-based
  const [rowsPerPage] = useState<number>(10); // fixed to match screenshot

  const total = ALL_ROWS.length;
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));

  const currentRows = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return ALL_ROWS.slice(start, start + rowsPerPage);
  }, [page, rowsPerPage]);

  const showFrom = (page - 1) * rowsPerPage + 1;
  const showTo = Math.min(page * rowsPerPage, total);

  const gotoPage = (p: number) => {
    if (p < 1) p = 1;
    if (p > totalPages) p = totalPages;
    setPage(p);
    // scroll to top of table for better UX
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      sx={{
        px: { xs: 2, md: 6 },
        pt: 3,
        bgcolor: "#F4F7FE",
        minHeight: "100vh",
      }}
    >
      {/* Header with back arrow */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <IconButton
          onClick={() => router.push("/admin/intelligence-officer/dashboard")}
          sx={{
            bgcolor: "white",
            boxShadow: "0 6px 20px rgba(2,6,23,0.06)",
            width: 44,
            height: 44,
          }}
          size="large"
          aria-label="back to dashboard"
        >
          <ArrowBackIosNewIcon />
        </IconButton>

        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 , color: "chocolate" }}>
           Dashboard / Assigned Farmlands
          </Typography>
        </Box>
      </Stack>

      <Card sx={{ p: 3, borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#F1F5F9" }}>
              <TableCell>Agent Name</TableCell>
              <TableCell>Farmland ID</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Land Extend</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Value Per Acre</TableCell>
              <TableCell align="center">View</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {currentRows.map((r, i) => (
              <TableRow key={i} hover>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      src={r.avatar}
                      sx={{ width: 44, height: 44, boxShadow: "0 4px 12px rgba(2,6,23,0.04)" }}
                      alt={r.agent}
                    >
                      {initials(r.agent)}
                    </Avatar>
                    <Typography sx={{ fontSize: 15 }}>{r.agent}</Typography>
                  </Stack>
                </TableCell>

                <TableCell>
                  <Typography
                    sx={{ color: "#2563EB", textDecoration: "underline", cursor: "pointer" }}
                    onClick={() =>
                      router.push(`/admin/intelligence-officer/farmland/${encodeURIComponent(r.id)}`)
                    }
                  >
                    {r.id}
                  </Typography>
                </TableCell>

                <TableCell sx={{ color: "#374151" }}>{r.location}</TableCell>
                <TableCell sx={{ color: "#374151" }}>{r.time}</TableCell>
                <TableCell sx={{ color: "#374151" }}>{r.area}</TableCell>

                <TableCell>
                  <Typography sx={{ fontWeight: 800 }}>{r.amount}</Typography>
                </TableCell>

                <TableCell sx={{ color: "#374151" }}>{r.valuePerAcre}</TableCell>

                <TableCell align="center">
                  <IconButton
                    onClick={() =>
                      router.push(`/admin/intelligence-officer/farmland/${encodeURIComponent(r.id)}`)
                    }
                    sx={{
                      bgcolor: "#2B6CB0",
                      color: "white",
                      width: 36,
                      height: 36,
                      "&:hover": { bgcolor: "#244f85" },
                    }}
                    aria-label={`view ${r.id}`}
                  >
                    <VisibilityIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {/* if no rows in page (shouldn't happen with generator) */}
            {currentRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} sx={{ textAlign: "center", color: "gray", py: 6 }}>
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Footer: Showing X of Y + pagination controls */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 3 }}>
          <Typography sx={{ color: "#64748B" }}>
            Showing <b>{showTo - showFrom + 1}</b> of <b>{total}</b>
          </Typography>

          {/* pagination controls */}
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              onClick={() => gotoPage(1)}
              disabled={page === 1}
              aria-label="first page"
            >
              <FirstPageIcon />
            </IconButton>

            <IconButton
              onClick={() => gotoPage(page - 1)}
              disabled={page === 1}
              aria-label="previous page"
            >
              <ChevronLeftIcon />
            </IconButton>

            {/* page numbers */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const p = idx + 1;
                return (
                  <Button
                    key={p}
                    onClick={() => gotoPage(p)}
                    variant={p === page ? "contained" : "text"}
                    sx={{
                      minWidth: 36,
                      height: 36,
                      borderRadius: 2,
                      bgcolor: p === page ? "#fff" : "transparent",
                      color: p === page ? "#2563EB" : "#2563EB",
                      boxShadow: p === page ? "0 8px 24px rgba(37,99,235,0.12)" : "none",
                      textTransform: "none",
                    }}
                  >
                    {p}
                  </Button>
                );
              })}
            </Box>

            <IconButton
              onClick={() => gotoPage(page + 1)}
              disabled={page === totalPages}
              aria-label="next page"
            >
              <ChevronRightIcon />
            </IconButton>

            <IconButton
              onClick={() => gotoPage(totalPages)}
              disabled={page === totalPages}
              aria-label="last page"
            >
              <LastPageIcon />
            </IconButton>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
}

/* ---------------- helpers ---------------- */
function initials(name = "") {
  const parts = name.split(" ").filter(Boolean);
  if (!parts.length) return "U";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}
