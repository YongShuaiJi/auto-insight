import React from 'react';
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Tooltip,
  alpha,
  useTheme
} from "@mui/material";
import {
  Hub as HubIcon,
  Logout as LogoutIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon
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
  // Get theme mode and toggle function
  const { mode, toggleColorMode } = useThemeMode();
  const theme = useTheme();

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
