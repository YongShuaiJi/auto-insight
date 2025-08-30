import React from 'react';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  Settings as SettingsIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import Products from '../pages/Products';
import Orders from '../pages/Orders';
import Settings from '../pages/Settings';

// Define route types
export interface Route {
  id: string;
  path: string;
  label: string;
  icon: React.ReactNode;
  component: React.ComponentType<any>;
}

// Define routes
const routes: Route[] = [
  {
    id: 'dashboard',
    path: '/',
    label: 'Dashboard',
    icon: <DashboardIcon />,
    component: Dashboard
  },
  {
    id: 'users',
    path: '/users',
    label: 'Users',
    icon: <PeopleIcon />,
    component: Users
  },
  {
    id: 'products',
    path: '/products',
    label: 'Products',
    icon: <InventoryIcon />,
    component: Products
  },
  {
    id: 'orders',
    path: '/orders',
    label: 'Orders',
    icon: <ReceiptIcon />,
    component: Orders
  },
  {
    id: 'settings',
    path: '/settings',
    label: 'Settings',
    icon: <SettingsIcon />,
    component: Settings
  }
];

export default routes;

// Helper function to get route by ID
export const getRouteById = (id: string): Route | undefined => {
  return routes.find(route => route.id === id);
};

// Helper function to render component by route ID
export const renderRouteById = (id: string): React.ReactNode => {
  const route = getRouteById(id);
  if (!route) return null;

  const Component = route.component;
  // Pass recentOrders to Dashboard component
  if (id === 'dashboard') {
    return <Component recentOrders={[
      { id: 1, customer: 'John Doe', date: '2023-10-15', status: 'Completed', amount: '$120.00' },
      { id: 2, customer: 'Jane Smith', date: '2023-10-14', status: 'Processing', amount: '$85.50' },
      { id: 3, customer: 'Bob Johnson', date: '2023-10-13', status: 'Pending', amount: '$220.75' },
      { id: 4, customer: 'Alice Brown', date: '2023-10-12', status: 'Completed', amount: '$65.25' },
    ]} />;
  }
  return <Component />;
};
