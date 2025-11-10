// src/app/admin/intelligence-officer/components/Topbar.tsx
"use client";

import React from "react";
import { Box, Stack, Avatar, Typography, IconButton } from "@mui/material";
import Image from "next/image";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

export default function Topbar() {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1200,
        bgcolor: "white",
        boxShadow: "0 4px 20px rgba(2,6,23,0.08)",
        py: 1.25,
        px: { xs: 2, md: 6 },
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Left: Logo */}
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box sx={{ width: 101, display: "flex", alignItems: "center" }}>
          {/* Ensure file is at public/images/glc-logo.png */}
          <Image
            src="/glc-logo.png"
            alt="GLC Logo"
            width={101}
            height={49}
            priority
            style={{ objectFit: "contain" }}
          />
        </Box>
      </Stack>

      {/* Right: Notifications + User */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <IconButton
          sx={{
            bgcolor: "#F9FAFB",
            "&:hover": { bgcolor: "#EEF2FF" },
            boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
          }}
          aria-label="notifications"
        >
          <NotificationsNoneOutlinedIcon sx={{ color: "#374151" }} />
        </IconButton>

        <Stack direction="row" alignItems="center" spacing={1.2}>
          <Avatar
            sx={{
              width: 44,
              height: 44,
              bgcolor: "#EF4444",
              color: "white",
              fontWeight: 700,
            }}
          >
            S
          </Avatar>
          <Box sx={{ textAlign: "left" }}>
            <Typography sx={{ fontWeight: 700, color: "#111827" }}>
              Sara
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#6B7280" }}>
              Local Intelligence Officer
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
