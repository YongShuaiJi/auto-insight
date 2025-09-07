import React, { useRef } from 'react';
import { Modal } from 'antd';
import type { Bug } from '../services/bugsApi';
import BugForm, {type BugFormRef } from './BugForm';

interface BugModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (bugData: Omit<Bug, 'id' | 'createdAt'>) => void;
  isLoading: boolean;
}

const BugModal: React.FC<BugModalProps> = ({ open, onClose, onSubmit, isLoading }) => {
  const formRef = useRef<BugFormRef | null>(null);

  return (
    <Modal
      title="新建缺陷"
      open={open}
      onCancel={onClose}
      onOk={() => formRef.current?.submit()}
      okText="新建"
      confirmLoading={isLoading}
      destroyOnClose
      width={1500}
    >
      <BugForm
        ref={formRef}
        open={open}
        mode="create"
        initialBug={null}
        isLoading={isLoading}
        onSubmit={(payload) => onSubmit(payload as Omit<Bug, 'id' | 'createdAt'>)}
        sidePanelAutoHeight
      />
    </Modal>
  );
};

export default BugModal;
