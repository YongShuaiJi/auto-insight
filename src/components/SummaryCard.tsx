import React from 'react';
import { Card, Typography, Button } from '../ui';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  icon,
  className = "dashboard-card"
}) => {
  return (
    <Card className={className}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <Button type="text" shape="circle" aria-label={title.toLowerCase()} icon={icon} />
        <Typography.Text type="secondary" style={{ marginLeft: 8, marginBottom: 0 }}>
          {title}
        </Typography.Text>
      </div>
      <Typography.Title level={5} style={{ margin: 0 }}>
        {value}
      </Typography.Title>
    </Card>
  );
};

export default SummaryCard;