import React from 'react';
import { Row, Col, Typography, DollarOutlined, ShoppingCartOutlined, UserOutlined, ShoppingOutlined } from '../ui';
import SummaryCard from '../components/SummaryCard';
import OrdersTable, {type Order} from '../components/OrdersTable';

interface DashboardProps {
  recentOrders?: Order[];
}

const Dashboard: React.FC<DashboardProps> = ({ recentOrders = [] }) => {
  // Default mock data if no orders are provided
  const defaultOrders: Order[] = [
    { id: 1, customer: 'John Doe', date: '2023-10-15', status: 'Completed', amount: '$120.00' },
    { id: 2, customer: 'Jane Smith', date: '2023-10-14', status: 'Processing', amount: '$85.50' },
    { id: 3, customer: 'Bob Johnson', date: '2023-10-13', status: 'Pending', amount: '$220.75' },
    { id: 4, customer: 'Alice Brown', date: '2023-10-12', status: 'Completed', amount: '$65.25' },
  ];

  const orders = recentOrders.length > 0 ? recentOrders : defaultOrders;

  return (
    <>
      <Typography.Title level={4} style={{ marginBottom: 16 }}>
        概览
      </Typography.Title>

      <Row gutter={[24, 24]}>
        {/* Summary Cards */}
        <Col xs={24} sm={12} md={6}>
          <SummaryCard
            title="Total Sales"
            value="$12,345.67"
            icon={<DollarOutlined />}
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <SummaryCard
            title="New Cases"
            value="25"
            icon={<ShoppingCartOutlined />}
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <SummaryCard
            title="Total Customers"
            value="1,234"
            icon={<UserOutlined />}
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <SummaryCard
            title="Products"
            value="567"
            icon={<ShoppingOutlined />}
          />
        </Col>

        {/* Recent Cases Table */}
        <Col xs={24}>
          <OrdersTable orders={orders} />
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
