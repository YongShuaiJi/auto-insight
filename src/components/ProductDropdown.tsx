import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Menu, 
  MenuItem, 
  Typography, 
  Tooltip,
  alpha,
  useTheme
} from '@mui/material';
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import { fetchProducts } from '../services/api.ts';
import type { Product } from "../services/api.ts";
import { useThemeMode } from '../theme/ThemeModeContext';


interface ProductDropdownProps {
  selectedProduct: Product | null;
  onProductSelect: (product: Product) => void;
}

const ProductDropdown: React.FC<ProductDropdownProps> = ({ 
  selectedProduct, 
  onProductSelect 
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const { mode } = useThemeMode();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data as Product[]);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    getProducts();
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProductSelect = (product: Product) => {
    onProductSelect(product);
    handleClose();
  };

  return (
      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
        <Tooltip arrow>
          <Button
              variant="text"
              color="inherit"
              onClick={handleClick}
              endIcon={
                <KeyboardArrowDownIcon
                    sx={{
                      fontSize: '1.1rem',
                      transition: 'transform 0.2s',
                      transform: open ? 'rotate(180deg)' : 'rotate(0)',
                      ml: -0.5,
                    }}
                />
              }
              sx={{
                textTransform: 'none',
                borderRadius: 1,
                px: 2,
                py: 1,
                fontSize: '1.25rem',
                fontWeight: 500,
                minHeight: 40,
                transition: theme.transitions.create(
                    ['background-color', 'box-shadow', 'border-color', 'color'],
                    {
                      duration: theme.transitions.duration.short,
                    }
                ),
                '&:hover': {
                  backgroundColor:
                      mode === 'light'
                          ? 'translucent white (8%)' /* rgba(255, 255, 255, 0.08) */
                          : alpha(theme.palette.primary.main, 0.15),
                },
                '&:focus': {
                    outline: 'none',       // 移除轮廓
                    boxShadow: 'none',     // 移除阴影
                },
                ...(open && {
                  backgroundColor:
                      mode === 'light'
                          ? 'translucent white (16%)'
                          : alpha(theme.palette.primary.main, 0.25),
                }),
              }}
          >
            <Typography
                variant="body1"
                sx={{ fontWeight: 600, letterSpacing: '0.02em', fontSize: '1.15rem' }}
            >
              {selectedProduct ? selectedProduct.name : '选择产品'}
            </Typography>
          </Button>
        </Tooltip>
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            slotProps={{
              paper: {
                elevation: 6,
                'aria-labelledby': 'product-button',
                sx: {
                  mt: 1,
                  py: 0.75,
                  minWidth: 350,
                  overflow: 'visible',
                  borderRadius: 2,
                  backgroundImage: 'none',
                    '&:before': {
                        display: 'none', // Remove the arrow
                    },
                  backgroundColor:
                      mode === 'light' ? 'dodgerblue' /* #0066CC */ : 'very dark gray' /* #1e1e1e */,
                  boxShadow:
                      mode === 'light'
                          ? '0px 4px 20px translucent gray-blue (30%)' /* rgba(170, 180, 190, 0.3) */
                          : '0px 4px 20px translucent black (50%)' /* rgba(0, 0, 0, 0.5) */,
                  color: mode === 'light' ? 'white' /* #FFFFFF */ : undefined,
                },
              },
            }}
        >
          {products.map((product) => (
              <MenuItem
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  selected={selectedProduct?.id === product.id}
                  sx={{
                    borderRadius: 0.5,
                    mx: 0.5,
                    my: 0.25,
                    px: 2,
                    py: 1.25,
                    fontSize: '1rem',
                    fontWeight: selectedProduct?.id === product.id ? 600 : 500,
                    color: mode === 'light' ? 'white' /* #FFFFFF */ : 'text.primary',
                    minHeight: 48,
                    '&.Mui-selected': {
                      backgroundColor:
                          mode === 'light'
                              ? 'translucent white (20%)' /* rgba(255, 255, 255, 0.2) */
                              : alpha(theme.palette.primary.main, 0.16),
                      color:
                          mode === 'light'
                              ? 'white' /* #FFFFFF */
                              : theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor:
                            mode === 'light'
                                ? 'translucent white (30%)' /* rgba(255, 255, 255, 0.3) */
                                : alpha(theme.palette.primary.main, 0.24),
                      },
                    },
                    '&:hover': {
                      backgroundColor:
                          mode === 'light'
                              ? 'translucent white (10%)' /* rgba(255, 255, 255, 0.1) */
                              : 'translucent white (8%)' /* rgba(255, 255, 255, 0.08) */,
                    },
                    transition: theme.transitions.create(
                        ['background-color', 'color'],
                        {
                          duration: theme.transitions.duration.shortest,
                        }
                    ),
                  }}
              >
                {product.name}
              </MenuItem>
          ))}
        </Menu>
      </Box>
  );

};

export default ProductDropdown;
