import React, { useState } from 'react';
import { Card, Typography, Button, Table, Menu, Dropdown, Switch, Spin, Space } from '../ui';
import { BugOutlined, SettingOutlined } from '../ui';
import type { Bug } from '../services/bugsApi';

interface BugsTableProps {
  bugs: Bug[];
  isLoading: boolean;
  visibleColumns: string[];
  onToggleColumn: (columnName: string) => void;
  title?: string;
  className?: string;
}

// Column definitions with display names
const columnDefinitions = [
  { id: 'id', label: '编号' },
  { id: 'title', label: '标题' },
  { id: 'status', label: '状态' },
  { id: 'assignee', label: '负责人' },
  { id: 'creator', label: '创建者' },
  { id: 'createdAt', label: '创建时间' },
  { id: 'type', label: '类型' },
  { id: 'priority', label: '优先级' },
  { id: 'iteration', label: '迭代' },
  { id: 'plannedStartDate', label: '计划开始时间' },
  { id: 'completionDate', label: '完成时间' }
];

const BugsTable: React.FC<BugsTableProps> = ({
  bugs,
  isLoading,
  visibleColumns,
  onToggleColumn,
  title = "缺陷列表",
  className = "bugs-table-card"
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Get visible columns in the order they are defined
  const visibleColumnDefs = columnDefinitions.filter(col => 
    visibleColumns.includes(col.id)
  );

  const items = [
    {
      key: 'header',
      label: (
        <Typography.Text strong>显示/隐藏列</Typography.Text>
      ),
      disabled: true,
    },
    ...columnDefinitions.map((column) => ({
      key: column.id,
      label: (
        <Space align="center" style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <span>{column.label}</span>
          <Switch
            size="small"
            checked={visibleColumns.includes(column.id)}
            onChange={() => onToggleColumn(column.id)}
          />
        </Space>
      ),
    }))
  ];

  const columns = visibleColumnDefs.map((col) => ({
    title: col.label,
    dataIndex: col.id,
    key: col.id,
  }));

  return (
    <Card className={className}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button type="text" shape="circle" aria-label="bugs list" icon={<BugOutlined />} />
          <Typography.Title level={4} style={{ margin: 0, marginLeft: 8 }}>
            {title}
          </Typography.Title>
        </div>
        <Dropdown
          menu={{ items }}
          trigger={["click"]}
          open={menuOpen}
          onOpenChange={setMenuOpen}
        >
          <Button type="text" shape="circle" aria-label="column settings" icon={<SettingOutlined />} />
        </Dropdown>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
          <Spin />
        </div>
      ) : (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={bugs}
          locale={{ emptyText: '暂无数据' }}
          pagination={false}
        />
      )}
    </Card>
  );
};

export default BugsTable;