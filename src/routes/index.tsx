import React from 'react';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
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
    label: '仪表盘',
    icon: <DashboardIcon />,
    component: Dashboard
  },
  {
    id: 'orders',
    path: '/orders',
    label: 'Orders',
    icon: <ReceiptIcon />,
    component: Orders
  },
  {
    id: 'users',
    path: '/users',
    label: 'Users',
    icon: <PeopleIcon />,
    component: Users
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
  try {
    console.log('Rendering route by ID:', id);

    const route = getRouteById(id);
    console.log('Found route:', route);

    if (!route) {
      console.warn('No route found for ID:', id);
      return <div>No route found for ID: {id}</div>;
    }

    const Component = route.component;
    console.log('Component for route:', Component);

    // Pass recentOrders to Dashboard component
    if (id === 'dashboard') {
      const recentOrders = [
        { id: 1, customer: 'John Doe', date: '2023-10-15', status: 'Completed', amount: '$120.00' },
        { id: 2, customer: 'Jane Smith', date: '2023-10-14', status: 'Processing', amount: '$85.50' },
        { id: 3, customer: 'Bob Johnson', date: '2023-10-13', status: 'Pending', amount: '$220.75' },
        { id: 4, customer: 'Alice Brown', date: '2023-10-12', status: 'Completed', amount: '$65.25' },
      ];
      console.log('Rendering dashboard with recentOrders:', recentOrders);
      return <Component recentOrders={recentOrders} />;
    }

    console.log('Rendering component for route:', route.id);
    return <Component />;
  } catch (error) {
    console.error('Error in renderRouteById:', error);
    return <div style={{ color: 'red' }}>Error rendering route: {error.message}</div>;
  }
};
