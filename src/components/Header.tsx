import React from 'react';
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography
} from "@mui/material";
import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

interface HeaderProps {
  title?: string;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "Admin Dashboard",
  onLogout = () => console.log("Logout clicked") 
}) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="admin dashboard"
          sx={{ mr: 2 }}
        >
          <AdminPanelSettingsIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <IconButton color="inherit" aria-label="logout" onClick={onLogout}>
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;