import React from 'react';
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Tooltip
} from "@mui/material";
import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  Logout as LogoutIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon
} from '@mui/icons-material';
import { useThemeMode } from '../theme/ThemeModeContext';

interface HeaderProps {
  title?: string;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "Admin Dashboard",
  onLogout = () => console.log("Logout clicked") 
}) => {
  // Get theme mode and toggle function
  const { mode, toggleColorMode } = useThemeMode();

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
        <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
          <IconButton color="inherit" onClick={toggleColorMode} sx={{ mr: 1 }}>
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Tooltip>
        <IconButton color="inherit" aria-label="logout" onClick={onLogout}>
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
