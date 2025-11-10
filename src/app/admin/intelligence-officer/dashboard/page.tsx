// src/app/admin/intelligence-officer/dashboard/page.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Box,
  Grid,
  Card,
  Typography,
  Stack,
  TextField,
  Avatar,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import { useRouter } from "next/navigation";

/* --- sample data --- */
const assignedRows = [
  { agent: "Ram Varma", avatar: "/images/agent1.png", id: "GLCSOS 01", location: "West Godavari, Tanuku", time: "6th Oct - 12:53 PM", area: "100 acres", amount: "25 Lakhs", cost: "10000.00", status: "Completed" },
  { agent: "Krishna", avatar: "/images/agent2.png", id: "GLCSOS 02", location: "West Godavari, Tanuku", time: "5th Oct - 10:53 PM", area: "100 acres", amount: "40 Lakhs", cost: "10000.00", status: "Pending" },
  { agent: "Harish", avatar: "/images/agent3.png", id: "GLCSOS 03", location: "West Godavari, Tanuku", time: "4th Oct - 02:23 PM", area: "100 acres", amount: "34 Lakhs", cost: "10000.00", status: "Pending" },
  { agent: "Mohan", avatar: "/images/agent4.png", id: "GLCSOS 04", location: "West Godavari, Tanuku", time: "3rd Oct - 11:23 PM", area: "100 acres", amount: "14 Lakhs", cost: "10000.00", status: "Completed" },
];

const requestedRows = [
  { requestId: "REQ-1001", farmlandId: "GLCSOS 05", requester: "Office Admin", requestedOn: "10th Oct", status: "Pending", details: "Need owner documents" },
  { requestId: "REQ-1002", farmlandId: "GLCSOS 07", requester: "Field Officer", requestedOn: "11th Oct", status: "Info Sent", details: "Requested GPS coordinates" },
  { requestId: "REQ-1008", farmlandId: "GLCSOS 13", requester: "Office Admin", requestedOn: "15th Oct", status: "Pending", details: "Proof of ownership required" },
  { requestId: "REQ-1010", farmlandId: "GLCSOS 15", requester: "Field Officer", requestedOn: "16th Oct", status: "Info Sent", details: "Photos uploaded" },
];

export default function IntelligenceOfficerDashboard() {
  const router = useRouter();

  const [tab, setTab] = useState<"AssignedFarmlands" | "RequestedInfo" | "FarmlandsList">("AssignedFarmlands");

  // route View More helper
  const goToList = () => {
    if (tab === "AssignedFarmlands") router.push("/admin/intelligence-officer/assigned");
    else if (tab === "RequestedInfo") router.push("/admin/intelligence-officer/requests");
    else router.push("/admin/intelligence-officer/farmland");
  };

  return (
    // IMPORTANT: no top padding here — Topbar is sticky and sits above content

    
    <Box sx={{ bgcolor: "#F4F7FE", minHeight: "100vh", pb: 8 }}>
        
      {/* Welcome + Stat cards: mt: 0 ensures no gap under topbar */}
      <Grid container spacing={2} sx={{ px: { xs: 2, md: 6 }, mt: 0 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, borderRadius: 2.5, boxShadow: "0 6px 20px rgba(2,6,23,0.06)", bgcolor: "white", minHeight: 136, display: "flex", alignItems: "center" }}>
            <Stack direction="row" spacing={2} alignItems="center">
            <Box
  sx={{
    position: "absolute",
    width: 116,
    height: 174,
    top: 110,
    left: 67,
  }}
>
  <Image
    src="/sun.png"
    alt="sun"
    fill
    style={{ objectFit: "contain" }}
  />
</Box>

              <Box>
                <Typography sx={{ fontWeight: 700 }}>Welcome Back!</Typography>
                <Typography sx={{ mt: 1, fontWeight: 700 }}>Hello, <span style={{ color: "#0f5132" }}>Sara</span>!</Typography>
                <Typography sx={{ color: "gray", fontSize: 13 }}>Good Morning!</Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <StatCard title="Total farmlands" value="11,766" icon={<PersonOutlineIcon sx={{ color: "#7C3AED" }} />} accent="lavender" />
        </Grid>

        <Grid item xs={12} md={3}>
          <StatCard title="Approved Farmlands" value="1510" icon={<TrendingUpIcon sx={{ color: "#059669" }} />} accent="mint" />
        </Grid>

        <Grid item xs={12} md={3}>
          <StatCard title="Pending Farmlands" value="340" icon={<HourglassBottomIcon sx={{ color: "#FB923C" }} />} accent="peach" />
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ px: { xs: 2, md: 6 }, mt: 2 }}>
        <Card sx={{ p: 2, borderRadius: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-start", pl: 1 }}>
              <Box onClick={() => setTab("AssignedFarmlands")} sx={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 1, px: 2.5, py: 0.8, borderRadius: 6, transition: "all 0.3s ease", bgcolor: tab === "AssignedFarmlands" ? "#7C5CF6" : "transparent", "&:hover": { bgcolor: "#EDE9FE" } }}>
                <Typography sx={{ fontWeight: 700, color: tab === "AssignedFarmlands" ? "#fff" : "#64748B" }}>Assigned Farmlands</Typography>
                <Box sx={{ bgcolor: tab === "AssignedFarmlands" ? "#fff" : "#8b5cf6", color: tab === "AssignedFarmlands" ? "#7C5CF6" : "#fff", fontSize: 12, px: 1, py: "2px", borderRadius: "50%" }}>10</Box>
              </Box>
            </Box>

            <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <Box onClick={() => setTab("RequestedInfo")} sx={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 1, px: 2.5, py: 0.8, borderRadius: 6, transition: "all 0.3s ease", bgcolor: tab === "RequestedInfo" ? "#7C5CF6" : "transparent", "&:hover": { bgcolor: "#EDE9FE" } }}>
                <Typography sx={{ fontWeight: 700, color: tab === "RequestedInfo" ? "#fff" : "#64748B" }}>Requested Info</Typography>
                <Box sx={{ bgcolor: tab === "RequestedInfo" ? "#fff" : "#8b5cf6", color: tab === "RequestedInfo" ? "#7C5CF6" : "#fff", fontSize: 12, px: 1, py: "2px", borderRadius: "50%" }}>08</Box>
              </Box>
            </Box>

            <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end", pr: 1 }}>
              <Box onClick={() => setTab("FarmlandsList")} sx={{ cursor: "pointer", px: 4, py: 1, borderRadius: 8, bgcolor: tab === "FarmlandsList" ? "#7C5CF6" : "#EDE9FE", color: tab === "FarmlandsList" ? "#fff" : "#7C5CF6", fontWeight: 800, boxShadow: tab === "FarmlandsList" ? "0 8px 24px rgba(124,92,246,0.25)" : "none", transition: "all 0.3s ease", "&:hover": { bgcolor: "#7C5CF6", color: "#fff" } }}>
                <Typography sx={{ fontSize: 15 }}>Farmlands List</Typography>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>

      {/* Table Card */}
      <Box sx={{ px: { xs: 2, md: 6 }, mt: 2 }}>
        <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 10px 30px rgba(2,6,23,0.06)" }}>
          <TextField placeholder="Search" size="small" sx={{ mb: 3, width: 420, bgcolor: "#F9FAFB", borderRadius: 2 }} />

          {/* Assigned Farmlands */}
          {tab === "AssignedFarmlands" && (
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#F1F5F9" }}>
                  <TableCell>Agent Name</TableCell>
                  <TableCell>Farmland ID</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Area</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Cost Per Acre</TableCell>
                  <TableCell align="center">View</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {assignedRows.map((r, i) => (
                  <TableRow key={i} hover>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar src={r.avatar} sx={{ width: 44, height: 44 }} alt={r.agent}>{initials(r.agent)}</Avatar>
                        <Typography>{r.agent}</Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Typography onClick={() => router.push(`/admin/intelligence-officer/farmland/${encodeURIComponent(r.id)}`)} sx={{ color: "#2563EB", textDecoration: "underline", cursor: "pointer" }}>{r.id}</Typography>
                    </TableCell>

                    <TableCell>{r.location}</TableCell>
                    <TableCell>{r.time}</TableCell>
                    <TableCell>{r.area}</TableCell>
                    <TableCell><Typography sx={{ fontWeight: 800 }}>{r.amount}</Typography></TableCell>
                    <TableCell>{r.cost}</TableCell>

                    <TableCell align="center">
                      <Box onClick={() => router.push(`/admin/intelligence-officer/farmland/${encodeURIComponent(r.id)}`)} sx={{ width: 36, height: 28, borderRadius: 1.2, bgcolor: "#2B6CB0", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "white", cursor: "pointer" }}>
                        <VisibilityIcon sx={{ fontSize: 16 }} />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Requested Info */}
          {tab === "RequestedInfo" && (
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#F1F5F9" }}>
                  <TableCell>Request ID</TableCell>
                  <TableCell>Farmland ID</TableCell>
                  <TableCell>Requester</TableCell>
                  <TableCell>Requested On</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Details</TableCell>
                  <TableCell align="center">View</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {requestedRows.length ? (
                  requestedRows.map((req, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell>{req.requestId}</TableCell>
                      <TableCell>
                        <Typography onClick={() => router.push(`/admin/intelligence-officer/farmland/${encodeURIComponent(req.farmlandId)}`)} sx={{ color: "#2563EB", textDecoration: "underline", cursor: "pointer" }}>
                          {req.farmlandId}
                        </Typography>
                      </TableCell>
                      <TableCell>{req.requester}</TableCell>
                      <TableCell>{req.requestedOn}</TableCell>
                      <TableCell>{req.status}</TableCell>
                      <TableCell>{req.details}</TableCell>
                      <TableCell align="center">
                        <Box onClick={() => router.push(`/admin/intelligence-officer/farmland/${encodeURIComponent(req.farmlandId)}`)} sx={{ width: 36, height: 28, borderRadius: 1.2, bgcolor: "#2B6CB0", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "white", cursor: "pointer" }}>
                          <VisibilityIcon sx={{ fontSize: 16 }} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: "center", color: "gray" }}>
                      No requested info available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}

          {/* Farmlands List */}
          {tab === "FarmlandsList" && (
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#F1F5F9" }}>
                  <TableCell>Agent Name</TableCell>
                  <TableCell>Farmland ID</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Land Extend</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {assignedRows.map((r, i) => (
                  <TableRow key={i} hover>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar src={r.avatar} sx={{ width: 44, height: 44 }} alt={r.agent}>
                          {initials(r.agent)}
                        </Avatar>
                        <Typography>{r.agent}</Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Typography onClick={() => router.push(`/admin/intelligence-officer/farmland/${encodeURIComponent(r.id)}`)} sx={{ color: "#2563EB", textDecoration: "underline", cursor: "pointer" }}>{r.id}</Typography>
                    </TableCell>

                    <TableCell>{r.location}</TableCell>
                    <TableCell>{r.time}</TableCell>
                    <TableCell>{r.area}</TableCell>
                    <TableCell><Typography sx={{ fontWeight: 800 }}>{r.amount}</Typography></TableCell>
                    <TableCell>
                      <Box sx={{ display: "inline-block", px: 2, py: 0.5, borderRadius: 6, color: "white", bgcolor: r.status === "Completed" ? "#10B981" : "#F59E0B" }}>
                        {r.status}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button onClick={goToList} sx={{ color: "#2563EB", fontWeight: 600, textTransform: "none" }}>View More</Button>
          </Box>
        </Card>
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 5, px: { xs: 2, md: 6 }, color: "#64748B", fontSize: 13 }}>
        Powered by <b style={{ color: "#EF4444" }}>TechGy Innovations</b> | © 2023 Green Land Capital. All rights reserved.
      </Box>
    </Box>
  );
}

/* ---------------- helpers ---------------- */
function StatCard({
  title,
  value,
  icon,
  accent = "lavender",
}: {
  title: string;
  value: string;
  icon?: React.ReactNode;
  accent?: "lavender" | "mint" | "peach";
}) {
  const cardBg =
    accent === "mint"
      ? "linear-gradient(90deg,#ECFDF5,#F0FFF4)"
      : accent === "peach"
      ? "linear-gradient(90deg,#FFF7ED,#FFFBF0)"
      : "linear-gradient(90deg,#F5F3FF,#FBF8FF)";

  const iconBg =
    accent === "mint"
      ? "linear-gradient(90deg,#059669,#10B981)"
      : accent === "peach"
      ? "linear-gradient(90deg,#F97316,#FB923C)"
      : "linear-gradient(90deg,#7C3AED,#6D28D9)";

  const renderIcon = (ic?: React.ReactNode) => {
    if (!ic) return null;
    if (React.isValidElement(ic)) {
      const existingSx = (ic.props as any).sx || {};
      const mergedSx = {
        ...existingSx,
        fontSize: 28,
        width: 28,
        height: 28,
        color: "#fff",
      };
      return React.cloneElement(ic as React.ReactElement, { sx: mergedSx });
    }
    return ic;
  };

  return (
    <Card
      sx={{
        p: 2.5,
        borderRadius: 2.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between", // pushes icon to the right
        bgcolor: cardBg,
        minHeight: 136,
      }}
    >
      {/* LEFT: Text content */}
      <Box>
        <Typography sx={{ color: "#64748B", fontWeight: 500 }}>{title}</Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>
          {value}
        </Typography>
      </Box>

      {/* RIGHT: Colored icon background */}
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 18px rgba(2,6,23,0.06)",
          background: iconBg,
        }}
      >
        {renderIcon(icon)}
      </Box>
    </Card>
  );
}



function initials(name = "") {
  const parts = name.split(" ").filter(Boolean);
  if (!parts.length) return "U";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}
