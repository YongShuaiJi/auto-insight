import React from 'react';
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Typography
} from "@mui/material";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  icon,
  className = "dashboard-card"
}) => {
  return (
    <Card className={className}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <IconButton color="primary" aria-label={title.toLowerCase()}>
            {icon}
          </IconButton>
          <Typography color="textSecondary" gutterBottom sx={{ ml: 1, mb: 0 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h5">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;