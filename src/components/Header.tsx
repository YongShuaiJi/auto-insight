import React, { useState } from 'react';
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Tooltip,
  alpha,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Hub as HubIcon,
  Logout as LogoutIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  SettingsBrightness as SystemModeIcon,
} from '@mui/icons-material';
import { useThemeMode } from '../theme/ThemeModeContext';
import ProductDropdown from './ProductDropdown';
import type { Product } from '../services/api.ts';

interface HeaderProps {
  title?: string;
  onLogout?: () => void;
  selectedProduct?: Product | null;
  onProductSelect?: (product: Product) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "测试中枢",
  onLogout = () => console.log("Logout clicked"),
  selectedProduct = null,
  onProductSelect = (product) => console.log("Product selected:", product)
}) => {
  // 主题模式（mode 为实际生效的 light/dark；preference 为 light/dark/system）
  const { mode, preference, setPreference } = useThemeMode();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSelect = (pref: 'light' | 'dark' | 'system') => {
    setPreference(pref);
    handleClose();
  };

  const currentThemeTooltip =
    preference === 'system'
      ? '主题：跟随系统'
      : mode === 'light'
      ? '主题：明色模式'
      : '主题：暗色模式';

  const currentIcon =
    preference === 'system'
      ? <SystemModeIcon />
      : mode === 'light'
      ? <LightModeIcon />
      : <DarkModeIcon />;

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="test central hub"
          sx={{
            mr: 2,
            '&:hover': {
              backgroundColor:
                mode === 'light'
                  ? alpha(theme.palette.primary.main, 0.4)
                  : alpha(theme.palette.primary.main, 0.15),
            },
            '&:focus': {
              outline: 'none',       // 移除轮廓
              boxShadow: 'none',     // 移除阴影
            },
          }}
        >
          <HubIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ mr: 2 }}>
          {title}
        </Typography>

        {/* Product Dropdown */}
        <ProductDropdown 
          selectedProduct={selectedProduct} 
          onProductSelect={onProductSelect} 
        />

        <div style={{ flexGrow: 1 }}></div>

        {/* 主题模式三态菜单 */}
        <Tooltip title={currentThemeTooltip}>
          <IconButton
            color="inherit"
            onClick={handleOpen}
            sx={{
              mr: 1,
              '&:hover': {
                backgroundColor:
                  mode === 'light'
                    ? alpha(theme.palette.primary.main, 0.5)
                    : alpha(theme.palette.primary.main, 0.15),
              },
              '&:focus': {
                  outline: 'none',       // 移除轮廓
                  boxShadow: 'none',     // 移除阴影
              },
              ...(open && {
                backgroundColor:
                  mode === 'light'
                    ? alpha(theme.palette.primary.main, 0.16)
                    : alpha(theme.palette.primary.main, 0.25),
                boxShadow:
                  mode === 'light'
                    ? '0px 5px 15px rgba(0, 0, 0, 0.3)'
                    : undefined,
              }),
            }}>
            {currentIcon}
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        >
          <MenuItem
            selected={preference === 'light'}
            onClick={() => handleSelect('light')}
          >
            <ListItemIcon>
              <LightModeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>明色模式</ListItemText>
          </MenuItem>
          <MenuItem
            selected={preference === 'dark'}
            onClick={() => handleSelect('dark')}
          >
            <ListItemIcon>
              <DarkModeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>暗色模式</ListItemText>
          </MenuItem>
          <MenuItem
            selected={preference === 'system'}
            onClick={() => handleSelect('system')}
          >
            <ListItemIcon>
              <SystemModeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>跟随系统</ListItemText>
          </MenuItem>
        </Menu>

        <IconButton color="inherit" aria-label="logout" onClick={onLogout}>
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
