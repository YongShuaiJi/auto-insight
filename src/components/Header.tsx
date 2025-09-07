import React, { useState } from 'react';
import { Typography, Button, Dropdown, Menu, Space, ApiOutlined, LogoutOutlined, MoonOutlined, SunOutlined, LaptopOutlined } from '../ui';
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
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSelect = (pref: 'light' | 'dark' | 'system') => {
    setPreference(pref);
    setMenuOpen(false);
  };

  const currentThemeTooltip =
    preference === 'system'
      ? '主题：跟随系统'
      : mode === 'light'
      ? '主题：明色模式'
      : '主题：暗色模式';

  const currentIcon =
    preference === 'system'
      ? <LaptopOutlined />
      : mode === 'light'
      ? <SunOutlined />
      : <MoonOutlined />;

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 16px' }}>
        <Button type="text" shape="circle" aria-label="test central hub" icon={<ApiOutlined />} />
        <Typography.Title level={5} style={{ margin: '0 8px' }}>
          {title}
        </Typography.Title>

        {/* Product Dropdown */}
        <ProductDropdown 
          selectedProduct={selectedProduct} 
          onProductSelect={onProductSelect} 
        />

        <div style={{ flexGrow: 1 }} />

        {/* 主题模式三态菜单 */}
        <Dropdown
          open={menuOpen}
          onOpenChange={setMenuOpen}
          menu={{
            items: [
              {
                key: 'light',
                label: (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <SunOutlined /> 明色模式
                  </span>
                ),
                onClick: () => handleSelect('light'),
              },
              {
                key: 'dark',
                label: (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MoonOutlined /> 暗色模式
                  </span>
                ),
                onClick: () => handleSelect('dark'),
              },
              {
                key: 'system',
                label: (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <LaptopOutlined /> 跟随系统
                  </span>
                ),
                onClick: () => handleSelect('system'),
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button type="text">
            {currentIcon}
          </Button>
        </Dropdown>

        <Button type="text" aria-label="logout" onClick={onLogout} icon={<LogoutOutlined />} />
      </div>
    </header>
  );
};

export default Header;
