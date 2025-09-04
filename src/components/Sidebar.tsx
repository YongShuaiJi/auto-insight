import React, { useState } from 'react';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Tooltip, alpha,useTheme
} from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import { SvgIconComponent } from '@mui/icons-material';
import { useThemeMode } from '../theme/ThemeModeContext';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  navItems: NavItem[];
  selectedItem: string;
  onItemSelect: (id: string) => void;
  width?: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  navItems,
  selectedItem,
  onItemSelect,
  width = 240
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const collapsedWidth = 64; // Width when collapsed
  const currentWidth = collapsed ? collapsedWidth : width;
    const theme = useTheme();
    const { mode } = useThemeMode();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: currentWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: currentWidth,
          boxSizing: 'border-box',
          position: 'static',
          height: '100%',
          transition: 'width 0.2s ease-in-out',
          overflowX: 'hidden'
        },
      }}
    >
      <Box sx={{ overflow: 'auto', height: '100%', position: 'relative' }}>
        {/* Collapse/Expand button positioned on the sidebar edge */}
        <IconButton 
          onClick={toggleCollapsed}
          size="small"
          sx={{
            position: 'fixed',
            left: currentWidth - 16,
              // right: '-16px', // Positioned outside the sidebar
            top: '56px', // Positioned between first and second menu items
              // zIndex: (theme) => theme.zIndex.modal + 1,
            zIndex: 9999, // Extremely high z-index to ensure it's above everything
            backgroundColor: (theme) => theme.palette.background.paper,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: '50%',
            width: '32px', // Increased size
            height: '32px', // Increased size
            '& .MuiSvgIcon-root': {
              fontSize: '20px', // Increased icon size
            },
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', // Enhanced shadow for better visibility
            // '&:hover': {
            //   backgroundColor: (theme) => theme.palette.action.hover,
            // }
            //   '&:hover': {
            //       // 保持不透明，并随模式切换
            //       backgroundColor:
            //           theme.palette.mode === 'light'
            //               ? theme.palette.grey[200]
            //               : theme.palette.grey[700],
            //   }
              '&:hover': {
                  backgroundColor:
                      mode === 'light' ? theme.palette.common.white : theme.palette.common.black,
              },
          }}
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <Tooltip title={collapsed ? item.label : ""} placement="right">
                <ListItemButton
                  selected={selectedItem === item.id}
                  onClick={() => onItemSelect(item.id)}
                  sx={{ 
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    px: collapsed ? 1 : 2
                  }}
                >
                  <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, mr: collapsed ? 0 : 2 }}>
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && <ListItemText primary={item.label} />}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
