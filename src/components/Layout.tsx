import React from 'react';
import { Box, CssBaseline } from "@mui/material";
import Header from './Header';
import Sidebar, {type NavItem} from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  navItems: NavItem[];
  selectedItem: string;
  onItemSelect: (id: string) => void;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = "测试中枢",
  navItems,
  selectedItem,
  onItemSelect,
  onLogout
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <CssBaseline />
      
      {/* Header */}
      <Header title={title} onLogout={onLogout} />
      
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