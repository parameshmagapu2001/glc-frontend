import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";

// Define props interface
type SalesOverviewProps = {
  totalSales: number;
  nriSalesPercentage: number;
  localSalesPercentage: number;
};

const SalesOverview: React.FC<SalesOverviewProps> = ({ totalSales, nriSalesPercentage, localSalesPercentage }) => (
    <Card
      sx={{
        p: 2,
        ml: 0,
        borderRadius: 2,
        height: {sm:"161px",md:"170px",lg:"170px"},
        mr: { xs: 2, sm: 0 },
      }}
    >
      <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="subtitle1" color="text.primary">
              Total Sales
            </Typography>
            <Typography
              variant="h4"
              component="div"
              sx={{ fontWeight: "bold", mt: 1, fontSize: { md: "1.5rem" } }}
            >
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(totalSales)}
            </Typography>
          </Box>

          <Box
            sx={{
              backgroundColor: "primary.light",
              borderRadius: '50%',
              width: { xs: 48, sm: 48, md: 60 },
              height: { xs: 48, sm: 48, md: 60 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src="/assets/images/briefcase.png" alt="img-notfound" />
          </Box>
        </Box>

        {/* Sales Metrics Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* NRI Sales */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              NRI SALES
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <TrendingUp sx={{ color: "success.main", fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: "success.main" }}>
                {nriSalesPercentage}%
              </Typography>
            </Box>
          </Box>

          {/* Local Sales */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              Local Sales
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <TrendingDown sx={{ color: "error.main", fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: "error.main" }}>
                {localSalesPercentage}%
              </Typography>
            </Box>
          </Box>

          {/* Vs Last Month */}
          <Typography variant="body2" color="text.secondary">
            Vs Last Month
          </Typography>
        </Box>
      </CardContent>
    </Card>
);

export default SalesOverview;
