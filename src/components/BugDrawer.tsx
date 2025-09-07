import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Drawer, Form, Input, Select, DatePicker, Typography, Space } from 'antd';
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
import dayjs from 'dayjs';

interface BugDrawerProps {
  open: boolean;
  bug?: Bug | null;
  onClose: () => void;
  onSubmit: (bug: Bug) => void; // returns updated bug
  isLoading: boolean;
}

const { TextArea } = Input;

const BugDrawer: React.FC<BugDrawerProps> = ({ open, bug, onClose, onSubmit, isLoading }) => {
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

  useEffect(() => {
    if (open && bug) {
      form.setFieldsValue({
        title: bug.title,
        description: bug.description,
        type: bug.type,
        assignee: bug.assignee,
        verifier: bug.verifier,
        priority: bug.priority,
        project: bug.project,
        iteration: bug.iteration,
        severity: bug.severity,
        participants: bug.participants,
        cc: bug.cc,
        tags: bug.tags,
        plannedStartDate: bug.plannedStartDate ? dayjs(bug.plannedStartDate) : undefined,
        plannedEndDate: bug.plannedEndDate ? dayjs(bug.plannedEndDate) : undefined,
        notFixReason: bug.notFixReason,
        customNotFixReason: bug.customNotFixReason,
      });
    } else if (open && !bug) {
      form.resetFields();
    }
  }, [open, bug, form]);

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    if (!bug) return;
    const updated: Bug = {
      ...bug,
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
      plannedStartDate: values.plannedStartDate ? values.plannedStartDate.format('YYYY-MM-DD') : '',
      plannedEndDate: values.plannedEndDate ? values.plannedEndDate.format('YYYY-MM-DD') : '',
      notFixReason: values.notFixReason || '',
      customNotFixReason: values.customNotFixReason || '',
    };
    onSubmit(updated);
  };

  const selectedNotFixIsCustom = Form.useWatch('notFixReason', form);
  useEffect(() => {
    const found = notFixReasons.find(r => r.id === selectedNotFixIsCustom);
    if (!found || !found.isCustom) {
      form.setFieldsValue({ customNotFixReason: '' });
    }
  }, [selectedNotFixIsCustom, notFixReasons, form]);

  return (
    <Drawer
      title={<Space><Typography.Text strong>缺陷详情</Typography.Text></Space>}
      placement="right"
      width={1000}
      open={open}
      onClose={handleClose}
      extra={<Space><Typography.Link onClick={handleOk}>{isLoading ? '保存中...' : '保存'}</Typography.Link></Space>}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}> 
          <Input placeholder="请输入标题" />
        </Form.Item>

        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <Form.Item label="描述" name="description" style={{ marginBottom: 0 }}>
              <MDEditor
                value={form.getFieldValue('description')}
                onChange={(v) => form.setFieldsValue({ description: v || '' })}
                preview="edit"
                height={400}
                extraCommands={[]}
              />
            </Form.Item>
          </div>
          <div style={{ width: 300, border: '1px solid var(--ant-color-border, #f0f0f0)', borderRadius: 8, padding: 12, overflow: 'auto' }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>基本信息</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Form.Item label="工作项类型" name="type" style={{ marginBottom: 0 }}>
                <Select allowClear options={bugTypes.map(t => ({ value: t.id, label: t.name }))} placeholder="请选择" />
              </Form.Item>
              <Form.Item label="负责人" name="assignee" style={{ marginBottom: 0 }}>
                <Select allowClear showSearch options={users.map(u => ({ value: u.id, label: u.name }))} placeholder="选择负责人" filterOption={(input, option) => (option?.label as string).toLowerCase().includes(input.toLowerCase())} />
              </Form.Item>
              <Form.Item label="验证者" name="verifier" style={{ marginBottom: 0 }}>
                <Select allowClear showSearch options={users.map(u => ({ value: u.id, label: u.name }))} placeholder="选择验证者" filterOption={(input, option) => (option?.label as string).toLowerCase().includes(input.toLowerCase())} />
              </Form.Item>
              <Form.Item label="严重程度" name="severity" style={{ marginBottom: 0 }}>
                <Select allowClear options={severities.map(s => ({ value: s.id, label: s.name }))} placeholder="请选择" />
              </Form.Item>
              <Form.Item label="优先级" name="priority" style={{ marginBottom: 0 }}>
                <Select allowClear options={priorities.map(p => ({ value: p.id, label: p.name }))} placeholder="请选择" />
              </Form.Item>
              <Form.Item label="归属项目" name="project" style={{ marginBottom: 0 }}>
                <Select allowClear options={projects.map(p => ({ value: p.id, label: p.name }))} placeholder="请选择" />
              </Form.Item>
              <Form.Item label="迭代" name="iteration" style={{ marginBottom: 0 }}>
                <Select allowClear options={iterations.map(i => ({ value: i.id, label: i.name }))} placeholder="请选择" />
              </Form.Item>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16, marginBottom: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Form.Item label="参与者" name="participants" style={{ marginBottom: 0 }}>
              <Select mode="multiple" allowClear options={users.map(u => ({ value: u.id, label: u.name }))} placeholder="选择参与者" />
            </Form.Item>
            <Form.Item label="抄送" name="cc" style={{ marginBottom: 0 }}>
              <Select mode="multiple" allowClear options={users.map(u => ({ value: u.id, label: u.name }))} placeholder="选择抄送人" />
            </Form.Item>
            <Form.Item label="标签" name="tags" style={{ marginBottom: 0 }}>
              <Select mode="tags" tokenSeparators={[',']} placeholder="输入并回车添加标签" />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Form.Item label="不修复理由" name="notFixReason" style={{ marginBottom: 0 }}>
              <Select allowClear options={notFixReasons.map(r => ({ value: r.id, label: r.name }))} placeholder="请选择" />
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
    </Drawer>
  );
};

export default BugDrawer;
