import React, { useState } from 'react';
import { Menu, Button, LeftOutlined, RightOutlined } from '../ui';

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

  const toggleCollapsed = () => setCollapsed(!collapsed);

  return (
    <aside style={{ width: currentWidth, transition: 'width 0.2s ease-in-out' }}>
      <div style={{ position: 'relative', height: '100%' }}>
        <Button
          onClick={toggleCollapsed}
          type="text"
          shape="circle"
          icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
          style={{
            position: 'fixed',
            left: currentWidth - 16,
            top: 56,
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
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
