import { useState } from 'react'
import './App.css'
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Card,
  CardContent,
  GridLegacy,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";

function App() {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');

  // Mock data for the dashboard
  const recentOrders = [
    { id: 1, customer: 'John Doe', date: '2023-10-15', status: 'Completed', amount: '$120.00' },
    { id: 2, customer: 'Jane Smith', date: '2023-10-14', status: 'Processing', amount: '$85.50' },
    { id: 3, customer: 'Bob Johnson', date: '2023-10-13', status: 'Pending', amount: '$220.75' },
    { id: 4, customer: 'Alice Brown', date: '2023-10-12', status: 'Completed', amount: '$65.25' },
  ];

  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'users', label: 'Users' },
    { id: 'products', label: 'Products' },
    { id: 'orders', label: 'Orders' },
    { id: 'settings', label: 'Settings' },
  ];

  // Render content based on selected menu
  const renderContent = () => {
    switch (selectedMenu) {
      case 'dashboard':
        return (
          <>
            <Typography variant="h4" gutterBottom>
              Dashboard
            </Typography>

            <GridLegacy container spacing={3}>
              {/* Summary Cards */}
              <GridLegacy item xs={12} sm={6} md={3}>
                <Card className="dashboard-card">
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total Sales
                    </Typography>
                    <Typography variant="h5">
                      $12,345.67
                    </Typography>
                  </CardContent>
                </Card>
              </GridLegacy>

              <GridLegacy item xs={12} sm={6} md={3}>
                <Card className="dashboard-card">
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      New Orders
                    </Typography>
                    <Typography variant="h5">
                      25
                    </Typography>
                  </CardContent>
                </Card>
              </GridLegacy>

              <GridLegacy item xs={12} sm={6} md={3}>
                <Card className="dashboard-card">
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total Customers
                    </Typography>
                    <Typography variant="h5">
                      1,234
                    </Typography>
                  </CardContent>
                </Card>
              </GridLegacy>

              <GridLegacy item xs={12} sm={6} md={3}>
                <Card className="dashboard-card">
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Products
                    </Typography>
                    <Typography variant="h5">
                      567
                    </Typography>
                  </CardContent>
                </Card>
              </GridLegacy>

              {/* Recent Orders Table */}
              <GridLegacy item xs={12}>
                <Card className="dashboard-card">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Recent Orders
                    </Typography>
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
                          {recentOrders.map((order) => (
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
              </GridLegacy>
            </GridLegacy>
          </>
        );
      case 'users':
        return <Typography variant="h4">Users Management</Typography>;
      case 'products':
        return <Typography variant="h4">Products Management</Typography>;
      case 'orders':
        return <Typography variant="h4">Orders Management</Typography>;
      case 'settings':
        return <Typography variant="h4">Settings</Typography>;
      default:
        return <Typography variant="h4">Dashboard</Typography>;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <CssBaseline />

      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Button color="inherit">Logout</Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box className="app-container">
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
              position: 'static',
              height: '100%'
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              {navItems.map((item) => (
                <ListItem key={item.id} disablePadding>
                  <ListItemButton
                    selected={selectedMenu === item.id}
                    onClick={() => setSelectedMenu(item.id)}
                  >
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
          </Box>
        </Drawer>

        {/* Main Content Area */}
        <Box className="main-content">
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
}

export default App
