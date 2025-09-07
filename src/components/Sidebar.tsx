import React, { useState } from 'react';
import { Menu, Button, LeftOutlined, RightOutlined, theme } from '../ui';

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
  const { token } = theme.useToken();
  const zIndexToggle = token.zIndexPopupBase - 1;

  const toggleCollapsed = () => setCollapsed(!collapsed);

  return (
    <aside style={{ width: currentWidth, transition: 'width 0.2s ease-in-out', backgroundColor: token.colorBgContainer, borderRight: `1px solid ${token.colorBorderSecondary}`, minHeight: 'calc(100vh - 56px)' }}>
      <div style={{ position: 'relative', height: '100%' }}>
        <Button
          onClick={toggleCollapsed}
          type="text"
          shape="circle"
          icon={collapsed ? <RightOutlined style={{ color: token.colorTextSecondary }} /> : <LeftOutlined style={{ color: token.colorTextSecondary }} />}
          style={{
            position: 'fixed',
            left: currentWidth - 16,
            top: 56,
            zIndex: zIndexToggle,
            backgroundColor: token.colorBgBase,
            color: token.colorTextLightSolid
          }}
        />

        <Menu
          mode="inline"
          selectedKeys={[selectedItem]}
          style={{ width: currentWidth, borderInlineEnd: 0 }}
          inlineCollapsed={collapsed}
          onClick={(e) => onItemSelect(e.key as string)}
          items={navItems.map((item) => ({
            key: item.id,
            icon: item.icon,
            label: item.label
          }))}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
