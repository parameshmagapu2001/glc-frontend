import React from "react";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import { People, Warning, TrendingUp, History, SvgIconComponent } from "@mui/icons-material";

// Define Props Interface
type MetricCardProps = {
  icon: SvgIconComponent;
  path:string;
  title: string;
  value: number;
  bgColor: string;
  iconBgColor: string;
};

const MetricCard: React.FC<MetricCardProps> = ({ icon: Icon,path, title, value, bgColor, iconBgColor }) => (
  <Box
    sx={{
      backgroundColor: bgColor,
      borderRadius: 2,
      py: {sm:2,md:'8px',lg:2},
      px: {sm:2,md:1, lg:2},
      position: "relative",
      width: "100%",
      height: "100%",
    }}
  >
    {/* Icon container */}
    <Box
      sx={{
        position: "absolute",
        top: 16,
        right: {sm:15,md:10, lg:16},
        borderRadius: "50%",
        backgroundColor: iconBgColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width:{sm:'45px',md:'30px', lg:"45px"},
        height:{sm:'45px',md:'30px', lg:'45px'}
      }}
    >
      <img src={path} alt="img-notfound"  />
    </Box>

    {/* Card Content */}
    <Box sx={{ mt: {sm:6, md:6, lg:6}}}>
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", fontSize: "0.7rem", mb: 0.5 }}
      >
        {title}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 600, fontSize: "1.2rem" }}>
        {value.toLocaleString()}
      </Typography>
    </Box>
  </Box>
);

const FarmlandStats: React.FC = () => {
  const metrics: MetricCardProps[] = [
    {
      icon: People,
      path: '/assets/images/farmlands.png',
      title: "Total Farmlands",
      value: 14563,
      bgColor: "#F3F0FF",
      iconBgColor: "#DDD6FE",
    },
    {
      icon: Warning,
      path: '/assets/images/progress.png',
      title: "In Progress",
      value: 2427,
      bgColor: "#F0F7FF",
      iconBgColor: "#ece8c8",
    },
    {
      icon: TrendingUp,
      path: '/assets/images/approved.png',
      title: "Approved",
      value: 1569,
      bgColor: "#F0FFF4",
      iconBgColor: "#A7F3D0",
    },
    {
      icon: History,
      path: '/assets/images/rejected.png',
      title: "Rejected",
      value: 567,
      bgColor: "#FFF5F5",
      iconBgColor: "#FECACA",
    },
  ];

  return (
    <Card
      sx={{
        borderRadius: 2,
        height: {md:"170px",lg:"170px"},
        ml: { xs: 0, sm: 0, md: 0 },
        mr: { xs:2, sm:0}
      }}
    >
      <CardContent>
        <Grid container spacing={2}>
          {metrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <MetricCard {...metric} />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FarmlandStats;


