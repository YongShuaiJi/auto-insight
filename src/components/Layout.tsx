import React from 'react';
import { Box, CssBaseline } from "@mui/material";
import Header from './Header';
import Sidebar, {type NavItem} from './Sidebar';
import type { Product } from '../services/api.ts';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  navItems: NavItem[];
  selectedItem: string;
  onItemSelect: (id: string) => void;
  onLogout?: () => void;
  selectedProduct?: Product | null;
  onProductSelect?: (product: Product) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = "测试中枢",
  navItems,
  selectedItem,
  onItemSelect,
  onLogout,
  selectedProduct,
  onProductSelect
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <CssBaseline />

      {/* Header */}
      <Header 
        title={title} 
        onLogout={onLogout} 
        selectedProduct={selectedProduct}
        onProductSelect={onProductSelect}
      />

      {/* Main Content */}
      <Box className="app-container">
        {/* Sidebar */}
        <Sidebar 
          navItems={navItems} 
          selectedItem={selectedItem} 
          onItemSelect={onItemSelect} 
        />

        {/* Main Content Area */}
        <Box className="main-content">
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
