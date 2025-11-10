// src/app/admin/intelligence-officer/layout.tsx
"use client";

import React from "react";
import Topbar from "./components/Topbar";
import { Box } from "@mui/material";

export default function IntelligenceLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ bgcolor: "#F4F7FE", minHeight: "100vh" }}>
      <Topbar />
      <main>{children}</main>
    </Box>
  );
}
