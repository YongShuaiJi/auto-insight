import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from "@mui/material";
// import { SvgIconComponent } from '@mui/icons-material';

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
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
          position: 'static',
          height: '100%'
        },
      }}
    >
      <Box sx={{ overflow: 'auto', height: '100%' }}>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={selectedItem === item.id}
                onClick={() => onItemSelect(item.id)}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;