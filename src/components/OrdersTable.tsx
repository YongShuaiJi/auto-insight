import React from 'react';
import { Card, Typography, Button, Table, FileTextOutlined } from '../ui';

export interface Order {
  id: number;
  customer: string;
  date: string;
  status: string;
  amount: string;
}

interface OrdersTableProps {
  orders: Order[];
  title?: string;
  className?: string;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  title = "Recent Cases",
  className = "dashboard-card"
}) => {
  const columns = [
    { title: 'Order ID', dataIndex: 'id', key: 'id' },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', align: 'right' as const },
  ];

  return (
    <Card className={className}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <Button type="text" shape="circle" aria-label="recent orders" icon={<FileTextOutlined />} />
        <Typography.Title level={4} style={{ margin: 0, marginLeft: 8 }}>{title}</Typography.Title>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={orders}
        pagination={false}
      />
    </Card>
  );
};

export default OrdersTable;