import React, { useEffect, useMemo, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Form, Input, Select, DatePicker, Typography } from 'antd';
import type { Bug, User, Project, Iteration, Priority, Severity, BugType, NotFixReason } from '../services/bugsApi';
import { fetchUsers, fetchProjects, fetchIterations, fetchPriorities, fetchSeverities, fetchBugTypes, fetchNotFixReasons } from '../services/bugsApi';
import MDEditor from '@uiw/react-md-editor';
import dayjs, { Dayjs } from 'dayjs';
import { useThemeMode } from '../theme/ThemeModeContext';

export type BugFormMode = 'create' | 'edit';

export interface BugFormValues {
  title: string;
  description: string;
  type: string;
  assignee: string;
  verifier: string;
  priority: string;
  project: string;
  iteration: string;
  severity: string;
  participants: string[];
  cc: string[];
  tags: string[];
  plannedStartDate?: Dayjs;
  plannedEndDate?: Dayjs;
  notFixReason: string;
  customNotFixReason: string;
}

export interface BugFormRef {
  submit: () => Promise<void>;
  reset: () => void;
}

interface BugFormProps {
  open: boolean;
  mode: BugFormMode;
  initialBug?: Partial<Bug> | null;
  isLoading?: boolean;
  onSubmit: (payload: Omit<Bug, 'id' | 'createdAt'> | Bug) => void;
  onCancel?: () => void;
  sidePanelAutoHeight?: boolean;
}

const { TextArea } = Input;

const BugForm = forwardRef<BugFormRef, BugFormProps>(({
  open,
  initialBug,
  isLoading = false,
  onSubmit,
  onCancel,
  sidePanelAutoHeight = false,
}, ref) => {
  const [form] = Form.useForm<BugFormValues>();
  const { mode } = useThemeMode();

  // Options
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [iterations, setIterations] = useState<Iteration[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [severities, setSeverities] = useState<Severity[]>([]);
  const [bugTypes, setBugTypes] = useState<BugType[]>([]);
  const [notFixReasons, setNotFixReasons] = useState<NotFixReason[]>([]);

  useImperativeHandle(ref, () => ({
    submit: async () => {
      await handleSubmit();
    },
    reset: () => form.resetFields(),
  }));

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

  // init/reset values
  useEffect(() => {
    if (!open) return;
    if (mode === 'light' && initialBug) {
      form.setFieldsValue({
        title: initialBug.title || '',
        description: initialBug.description || '',
        type: initialBug.type || '',
        assignee: initialBug.assignee || '',
        verifier: initialBug.verifier || '',
        priority: initialBug.priority || '',
        project: initialBug.project || '',
        iteration: initialBug.iteration || '',
        severity: initialBug.severity || '',
        participants: initialBug.participants || [],
        cc: initialBug.cc || [],
        tags: initialBug.tags || [],
        plannedStartDate: initialBug.plannedStartDate ? dayjs(initialBug.plannedStartDate) : undefined,
        plannedEndDate: initialBug.plannedEndDate ? dayjs(initialBug.plannedEndDate) : undefined,
        notFixReason: initialBug.notFixReason || '',
        customNotFixReason: initialBug.customNotFixReason || '',
      });
    } else if (mode === 'light') {
      form.resetFields();
      form.setFieldsValue({
        title: '',
        description: '',
        type: '',
        assignee: '',
        verifier: '',
        priority: '',
        project: '',
        iteration: '',
        severity: '',
        participants: [],
        cc: [],
        tags: [],
        plannedStartDate: undefined,
        plannedEndDate: undefined,
        notFixReason: '',
        customNotFixReason: '',
      });
    }
  }, [open, mode, initialBug, form]);

  // When notFixReason changes and it's not custom, clear custom reason
  const selectedNotFix = Form.useWatch('notFixReason', form);
  useEffect(() => {
    const found = notFixReasons.find(r => r.id === selectedNotFix);
    if (!found || !found.isCustom) {
      form.setFieldsValue({ customNotFixReason: '' });
    }
  }, [selectedNotFix, notFixReasons, form]);

  const sideRef = useRef<HTMLDivElement | null>(null);
  const [sideHeight, setSideHeight] = useState<number>(300);
  useEffect(() => {
    if (!open || !sidePanelAutoHeight) return;
    const min = 300;
    const tick = () => {
      const el = sideRef.current;
      if (!el) return;
      const h = Math.max(min, Math.round(el.clientHeight || min));
      setSideHeight(h - 30);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [open, users.length, projects.length, iterations.length, priorities.length, severities.length, bugTypes.length, notFixReasons.length, sidePanelAutoHeight]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (mode === 'light') {
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
        plannedStartDate: values.plannedStartDate ? values.plannedStartDate.format('YYYY-MM-DD') : '',
        plannedEndDate: values.plannedEndDate ? values.plannedEndDate.format('YYYY-MM-DD') : '',
        notFixReason: values.notFixReason || '',
        customNotFixReason: values.customNotFixReason || '',
        status: 'new',
        creator: 'currentUser',
        completionDate: '',
      };
      onSubmit(payload);
    } else {
      const updated: Bug = {
        ...(initialBug as Bug),
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
    }
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}> 
        <Input placeholder="请输入标题" />
      </Form.Item>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <Form.Item label="描述" name="description" style={{ marginBottom: 0 }}>
            <div data-color-mode={mode}>
              <MDEditor
                value={form.getFieldValue('description')}
                onChange={(v) => form.setFieldsValue({ description: v || '' })}
                preview="edit"
                height={ sidePanelAutoHeight ? Math.max(300, Math.round(sideHeight)) : 400 }
                extraCommands={[]}
              />
            </div>
          </Form.Item>
        </div>
        <div ref={sideRef} style={{ width: 300, border: '1px solid var(--ant-color-border, #f0f0f0)', borderRadius: 8, padding: 12, overflow: 'auto' }}>
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
            const selected = notFixReasons.find(r => r.id === selectedNotFix);
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
  );
});

export default BugForm;
