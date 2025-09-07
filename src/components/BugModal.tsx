import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Typography, Space, Tag } from 'antd';
import type { Bug, User, Project, Iteration, Priority, Severity, BugType, NotFixReason } from '../services/bugsApi';
import {
  fetchUsers,
  fetchProjects,
  fetchIterations,
  fetchPriorities,
  fetchSeverities,
  fetchBugTypes,
  fetchNotFixReasons,
} from '../services/bugsApi';
import MDEditor from '@uiw/react-md-editor';


interface NewBugModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (bugData: Omit<Bug, 'id' | 'createdAt'>) => void;
  isLoading: boolean;
}

const { TextArea } = Input;

const BugModal: React.FC<NewBugModalProps> = ({ open, onClose, onSubmit, isLoading }) => {
  const [form] = Form.useForm();

  // Options
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [iterations, setIterations] = useState<Iteration[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [severities, setSeverities] = useState<Severity[]>([]);
  const [bugTypes, setBugTypes] = useState<BugType[]>([]);
  const [notFixReasons, setNotFixReasons] = useState<NotFixReason[]>([]);

  useEffect(() => {
    if (!open) return;
    const fetchOptions = async () => {
      try {
        const [usersData, projectsData, iterationsData, prioritiesData, severitiesData, bugTypesData, notFixReasonsData] = await Promise.all([
          fetchUsers(),
          fetchProjects(),
          fetchIterations(),
          fetchPriorities(),
          fetchSeverities(),
          fetchBugTypes(),
          fetchNotFixReasons(),
        ]);
        setUsers(usersData);
        setProjects(projectsData);
        setIterations(iterationsData);
        setPriorities(prioritiesData);
        setSeverities(severitiesData);
        setBugTypes(bugTypesData);
        setNotFixReasons(notFixReasonsData);
      } catch (e) {
        console.error('Error fetching options:', e);
      }
    };
    fetchOptions();
  }, [open]);

  const resetForm = () => form.resetFields();

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const handleOk = async () => {
    const values = await form.validateFields();

    const payload: Omit<Bug, 'id' | 'createdAt'> = {
      title: values.title,
      description: values.description || '',
      type: values.type || '',
      assignee: values.assignee || '',
      verifier: values.verifier || '',
      priority: values.priority || '',
      project: values.project || '',
      iteration: values.iteration || '',
      severity: values.severity || '',
      participants: (values.participants || []) as string[],
      cc: (values.cc || []) as string[],
      tags: (values.tags || []) as string[],
      plannedStartDate:values.plannedStartDate || '',
      plannedEndDate:values.plannedEndDate|| '',
      notFixReason: values.notFixReason || '',
      customNotFixReason: values.customNotFixReason || '',
      status: 'new',
      creator: 'currentUser',
      completionDate: '',
    };

    onSubmit(payload);
  };

  // When notFixReason changes and it's not custom, clear custom reason
  const selectedNotFixIsCustom = Form.useWatch('notFixReason', form);
  useEffect(() => {
    const found = notFixReasons.find(r => r.id === selectedNotFixIsCustom);
    if (!found || !found.isCustom) {
      form.setFieldsValue({ customNotFixReason: '' });
    }
  }, [selectedNotFixIsCustom, notFixReasons, form]);

  const sideRef = useRef<HTMLDivElement | null>(null);
  const [sideHeight, setSideHeight] = useState<number>(300);

  useEffect(() => {
    if (!open) return;
    const min = 300;
    const tick = () => {
      const el = sideRef.current;
      if (!el) return;
      const h = Math.max(min, Math.round(el.clientHeight || min));
      console.log('size',h);
      setSideHeight(h-30);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [
    open,
    users.length,
    projects.length,
    iterations.length,
    priorities.length,
    severities.length,
    bugTypes.length,
    notFixReasons.length,
  ]);

  return (
    <Modal
      title={<Space><Typography.Text strong>新建缺陷</Typography.Text></Space>}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText="新建"
      confirmLoading={isLoading}
      destroyOnClose
      width={1000}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          title: '',
          description: '',
          tags: [] as string[],
          participants: [] as string[],
          cc: [] as string[],
        }}
      >
        {/* Title */}
        <Form.Item
          label="标题"
          name="title"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input placeholder="请输入标题" />
        </Form.Item>

        {/* Description with right-side basic info */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          {/* Left: Make container match measured height */}
          <div style={{ flex: 1 }}>
            {/* Use measured height for editor */}
            <Form.Item label="描述" name="description" style={{ marginBottom: 0 }}>
              <MDEditor
                value={form.getFieldValue('description')}
                onChange={(v) => form.setFieldsValue({ description: v || '' })}
                preview="edit"
                height={ Math.max(300,Math.round(sideHeight))}
                // height={400}
                extraCommands={[]}
              />
            </Form.Item>
          </div>
          <div
            ref={sideRef}
            style={{
              width: 300,
              border: '1px solid var(--ant-color-border, #f0f0f0)',
              borderRadius: 8,
              padding: 12,
              overflow: 'auto' }}
          >
            <div style={{ fontWeight: 600, marginBottom: 8 }}>
              基本信息
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Form.Item label="工作项类型" name="type" style={{ marginBottom: 0 }}>
                <Select
                  allowClear
                  options={bugTypes.map(t => ({ value: t.id, label: t.name }))}
                  placeholder="请选择"
                />
              </Form.Item>
              <Form.Item label="负责人" name="assignee" style={{ marginBottom: 0 }}>
                <Select
                  allowClear
                  showSearch
                  options={users.map(u => ({ value: u.id, label: u.name }))}
                  placeholder="选择负责人"
                  filterOption={(input, option) => (option?.label as string).toLowerCase().includes(input.toLowerCase())}
                />
              </Form.Item>
              <Form.Item label="验证者" name="verifier" style={{ marginBottom: 0 }}>
                <Select
                  allowClear
                  showSearch
                  options={users.map(u => ({ value: u.id, label: u.name }))}
                  placeholder="选择验证者"
                  filterOption={(input, option) => (option?.label as string).toLowerCase().includes(input.toLowerCase())}
                />
              </Form.Item>
              <Form.Item label="严重程度" name="severity" style={{ marginBottom: 0 }}>
                <Select
                  allowClear
                  options={severities.map(s => ({ value: s.id, label: s.name }))}
                  placeholder="请选择"
                />
              </Form.Item>
              <Form.Item label="优先级" name="priority" style={{ marginBottom: 0 }}>
                <Select
                  allowClear
                  options={priorities.map(p => ({ value: p.id, label: p.name }))}
                  placeholder="请选择"
                />
              </Form.Item>
              <Form.Item label="归属项目" name="project" style={{ marginBottom: 0 }}>
                <Select
                  allowClear
                  options={projects.map(p => ({ value: p.id, label: p.name }))}
                  placeholder="请选择"
                />
              </Form.Item>
              <Form.Item label="迭代" name="iteration" style={{ marginBottom: 0 }}>
                <Select
                  allowClear
                  options={iterations.map(i => ({ value: i.id, label: i.name }))}
                  placeholder="请选择"
                />
              </Form.Item>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16, marginBottom: 32 }}>
          {/* Left column fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Form.Item label="参与者" name="participants" style={{ marginBottom: 0 }}>
              <Select
                mode="multiple"
                allowClear
                options={users.map(u => ({ value: u.id, label: u.name }))}
                placeholder="选择参与者"
              />
            </Form.Item>
            <Form.Item label="抄送" name="cc" style={{ marginBottom: 0 }}>
              <Select
                mode="multiple"
                allowClear
                options={users.map(u => ({ value: u.id, label: u.name }))}
                placeholder="选择抄送人"
              />
            </Form.Item>
            <Form.Item label="标签" name="tags" style={{ marginBottom: 0 }}>
              <Select
                mode="tags"
                tokenSeparators={[',']}
                placeholder="输入并回车添加标签"
              />
            </Form.Item>
          </div>

          {/* Right column fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Form.Item label="不修复理由" name="notFixReason" style={{ marginBottom: 0 }}>
              <Select
                allowClear
                options={notFixReasons.map(r => ({ value: r.id, label: r.name }))}
                placeholder="请选择"
              />
            </Form.Item>
            <Form.Item label="计划开始时间" name="plannedStartDate" style={{ marginBottom: 0 }}>
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item label="计划结束时间" name="plannedEndDate" style={{ marginBottom: 0 }}>
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>

            {(() => {
              const selected = notFixReasons.find(r => r.id === selectedNotFixIsCustom);
              if (selected && selected.isCustom) {
                return (
                  <Form.Item label="自定义不修复理由" name="customNotFixReason">
                    <TextArea rows={2} placeholder="请输入自定义理由" />
                  </Form.Item>
                );
              }
              return null;
            })()}
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default BugModal;
