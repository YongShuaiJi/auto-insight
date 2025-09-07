import React, { useRef } from 'react';
import { Drawer, Typography, Space } from 'antd';
import type { Bug } from '../services/bugsApi';
import BugForm, {type BugFormRef } from './BugForm';

interface BugDrawerProps {
  open: boolean;
  bug?: Bug | null;
  onClose: () => void;
  onSubmit: (bug: Bug) => void; // returns updated bug
  isLoading: boolean;
}

const BugDrawer: React.FC<BugDrawerProps> = ({ open, bug, onClose, onSubmit, isLoading }) => {
  const formRef = useRef<BugFormRef | null>(null);

  return (
    <Drawer
      title={<Space><Typography.Text strong>缺陷详情</Typography.Text></Space>}
      placement="right"
      width={1200}
      open={open}
      onClose={onClose}
      extra={<Space><Typography.Link onClick={() => formRef.current?.submit()}>{isLoading ? '保存中...' : '保存'}</Typography.Link></Space>}
      destroyOnClose
    >
      <BugForm
        ref={formRef}
        open={open}
        mode="edit"
        initialBug={bug || undefined}
        isLoading={isLoading}
        onSubmit={(payload) => onSubmit(payload as Bug)}
      />
    </Drawer>
  );
};

export default BugDrawer;
