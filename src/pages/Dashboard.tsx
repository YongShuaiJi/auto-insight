import React from 'react';
import { Grid, Typography } from "@mui/material";
import SummaryCard from '../components/SummaryCard';
import OrdersTable, {type Order} from '../components/OrdersTable';
import {
  MonetizationOn as MonetizationOnIcon,
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
  ShoppingBasket as ShoppingBasketIcon
} from '@mui/icons-material';

interface DashboardProps {
  recentOrders?: Order[];
}

const Dashboard: React.FC<DashboardProps> = ({ recentOrders = [] }) => {
  // Default mock data if no orders are provided
  const defaultOrders: Order[] = [
    { id: 1, customer: 'John Doe', date: '2023-10-15', status: 'Completed', amount: '$120.00' },
    { id: 2, customer: 'Jane Smith', date: '2023-10-14', status: 'Processing', amount: '$85.50' },
    { id: 3, customer: 'Bob Johnson', date: '2023-10-13', status: 'Pending', amount: '$220.75' },
    { id: 4, customer: 'Alice Brown', date: '2023-10-12', status: 'Completed', amount: '$65.25' },
  ];

  const orders = recentOrders.length > 0 ? recentOrders : defaultOrders;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        概览
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid size={{xs:12, sm:6, md:3}}>
          <SummaryCard
            title="Total Sales"
            value="$12,345.67"
            icon={<MonetizationOnIcon />}
          />
        </Grid>

        <Grid size={{xs:12, sm:6, md:3}}>
          <SummaryCard
            title="New Orders"
            value="25"
            icon={<ShoppingCartIcon />}
          />
        </Grid>

        <Grid size={{xs:12, sm:6, md:3}}>
          <SummaryCard
            title="Total Customers"
            value="1,234"
            icon={<PersonIcon />}
          />
        </Grid>

        <Grid size={{xs:12, sm:6, md:3}}>
          <SummaryCard
            title="Products"
            value="567"
            icon={<ShoppingBasketIcon />}
          />
        </Grid>

        {/* Recent Orders Table */}
        <Grid size={{xs:12}}>
          <OrdersTable orders={orders} />
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
