import React, { useState, useEffect } from 'react';
import { Button, Dropdown, Typography, Tooltip, Space, DownOutlined } from '../ui';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const { mode } = useThemeMode();

  useEffect(() => {
    let isMounted = true; // 标记组件是否还挂载

    (async () => {
      try {
        const data = await fetchProducts();
        if (isMounted) {
          setProducts(data as Product[]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    })();

    // 清理函数：组件卸载时设置 isMounted = false
    return () => {
      isMounted = false;
    };
  }, []);

  const handleClose = () => {
    setMenuOpen(false);
  };

  const handleProductSelect = (product: Product) => {
    onProductSelect(product);
    handleClose();
  };

  return (
      <div style={{ display: 'flex', alignItems: 'center', marginRight: 8 }}>
        <Dropdown
          open={menuOpen}
          onOpenChange={setMenuOpen}
          trigger={["click"]}
          menu={{
            items: products.map((product) => ({
              key: String(product.id),
              label: (
                <span style={{ fontWeight: selectedProduct?.id === product.id ? 600 : 500 }}>
                  {product.name}
                </span>
              ),
              onClick: () => handleProductSelect(product),
            })),
          }}
        >
          <Tooltip title={"选择项目"}>
            <Button
              type="text"
              onClick={() => setMenuOpen((v) => !v)}
              style={{
                textTransform: 'none',
                borderRadius: 6,
                padding: '4px 8px',
                fontSize: '1.15rem',
                fontWeight: 600,
                minHeight: 40,
                color: '#fff',
              }}
              icon={null}
            >
              <span>{selectedProduct ? selectedProduct.name : '选择产品'}</span>
              <DownOutlined
                style={{
                  fontSize: '1.1rem',
                  transition: 'transform 0.2s',
                  transform: menuOpen ? 'rotate(180deg)' : 'rotate(0) scale(1)',
                  marginLeft: 8,
                }}
              />
            </Button>
          </Tooltip>
        </Dropdown>
      </div>
  );

};

export default ProductDropdown;
