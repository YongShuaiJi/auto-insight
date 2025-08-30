import React from 'react';
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { Receipt as ReceiptIcon } from '@mui/icons-material';

export interface Order {
  id: number;
  customer: string;
  date: string;
  status: string;
  amount: string;
}

interface OrdersTableProps {
  orders: Order[];
  title?: string;
  className?: string;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  title = "Recent Orders",
  className = "dashboard-card"
}) => {
  return (
    <Card className={className}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <IconButton color="primary" aria-label="recent orders">
            <ReceiptIcon />
          </IconButton>
          <Typography variant="h6" gutterBottom sx={{ ml: 1, mb: 0 }}>
            {title}
          </Typography>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell align="right">{order.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default OrdersTable;