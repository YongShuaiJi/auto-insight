import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Form, Input, Select, DatePicker } from 'antd';
import type { Bug, User, Project, Iteration, Priority, Severity, BugType, NotFixReason } from '../services/bugsApi';
import { fetchUsers, fetchProjects, fetchIterations, fetchPriorities, fetchSeverities, fetchBugTypes, fetchNotFixReasons } from '../services/bugsApi';
import dayjs, { Dayjs } from 'dayjs';
import { useThemeMode } from '../theme/ThemeModeContext';
import '../ui/inline-fields.css';
import { Crepe } from '@milkdown/crepe';
import '@milkdown/crepe/theme/common/style.css';
import '@milkdown/crepe/theme/frame.css';

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
  plannedDateRange?: [Dayjs, Dayjs];
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

type AppearanceMode = 'light' | 'dark';

const InnerCrepeEditor: React.FC<{
  appearance: AppearanceMode;
  onChange?: (md: string) => void;
  readOnly?: boolean;
}> = ({ appearance, onChange, readOnly }) => {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const crepeRef = React.useRef<InstanceType<typeof Crepe> | null>(null);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // 动态禁用所有可能导致“选区浮窗/气泡工具栏”的特性（兼容 symbol/string/number 键）
    const featuresCfg: Partial<Record<PropertyKey, boolean>> = {};
    const disable = (key: unknown) => {
      if (typeof key === 'string' || typeof key === 'number' || typeof key === 'symbol') {
        featuresCfg[key] = false;
      }
    };
    disable(Crepe.Feature.LinkTooltip);

    // 不同版本可能使用的键名，存在即禁用
    const FeatureEnum = Crepe.Feature as unknown as Record<string, unknown>;
    [
      'FormatTooltip',
      'SelectionTooltip',
      'InlineMenu',
      'InlineToolbar',
      'FormatFloating',
      'TextSelectionToolbar',
    ].forEach((name) => {
      disable(FeatureEnum[name]);
    });

    const crepe = new Crepe({
      root
    });
    crepeRef.current = crepe;

    crepe.create().then(() => {
      // 可选：通过容器属性标记外观，便于样式差异化（如需）
      try {
        root.setAttribute('data-appearance', appearance);
      } catch {
        // ignore
      }

      if (typeof readOnly === 'boolean') {
        crepe.setReadonly(!!readOnly);
      }
      // 监听变更：将最新 Markdown 回传
      crepe.on(() => {
        try {
          const md = crepe.getMarkdown?.() ?? '';
          onChange?.(md);
        } catch {
          // ignore
        }
      });
    });

    return () => {
      try {
        crepe.destroy();
      } catch {
        // ignore
      } finally {
        crepeRef.current = null;
      }
    };
  }, [appearance, readOnly, onChange]);

  return (
    <div className="crepe-editor-frame" data-appearance={appearance}>
      <div className="crepe-editor-body" ref={rootRef} />
    </div>
  );
};

const BugForm = forwardRef<BugFormRef, BugFormProps>(({
  open,
  initialBug,
  isLoading = false,
  onSubmit,
  onCancel,
  sidePanelAutoHeight = true,
  mode: formMode = 'create',
}, ref) => {
  const [form] = Form.useForm<BugFormValues>();
  const { mode } = useThemeMode();

  // 侧栏引用与高度（需在依赖它们的 effect 之前声明）
  const sideRef = useRef<HTMLDivElement | null>(null);
  const [sideHeight, setSideHeight] = useState<number>(300);

  // Milkdown does not require manual instance management here.
  // We keep sideHeight to control container height for consistent layout.

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

  // Milkdown editor value is controlled via props below; no imperative sync needed here.

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
        plannedDateRange: (initialBug.plannedStartDate && initialBug.plannedEndDate)
          ? [dayjs(initialBug.plannedStartDate), dayjs(initialBug.plannedEndDate)]
          : undefined,
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
        plannedDateRange: undefined,
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

  // sideRef 与 sideHeight 已提前声明，避免在声明前被使用的类型错误
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
        plannedStartDate: values.plannedDateRange && values.plannedDateRange[0] ? values.plannedDateRange[0].format('YYYY-MM-DD HH:mm') : '',
        plannedEndDate: values.plannedDateRange && values.plannedDateRange[1] ? values.plannedDateRange[1].format('YYYY-MM-DD HH:mm') : '',
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
        plannedStartDate: values.plannedDateRange && values.plannedDateRange[0] ? values.plannedDateRange[0].format('YYYY-MM-DD HH:mm') : '',
        plannedEndDate: values.plannedDateRange && values.plannedDateRange[1] ? values.plannedDateRange[1].format('YYYY-MM-DD HH:mm') : '',
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
          <div>
            <Form.Item label="描述" style={{ marginBottom: 8 }}>
              <Form.Item name="description" noStyle>
                <Input type="hidden" />
              </Form.Item>
              <div style={{ height: sidePanelAutoHeight ? Math.max(300, Math.round(sideHeight)) : 400 }}>
                <InnerCrepeEditor
                  appearance={mode === 'dark' ? 'dark' : 'light'}
                  readOnly={false}
                  onChange={(md) => {
                    form.setFieldsValue({ description: md || '' });
                  }}
                />
              </div>
            </Form.Item>
          </div>
        </div>
        <div ref={sideRef} className="side-card">
          <div className="side-card-title">基本信息</div>
          <div className="inline-section">
            <div className="inline-row">
              <span className="inline-label">归属项目：</span>
              <Form.Item name="project" className="inline-control" style={{ marginBottom: 0 }}>
                <Select
                  allowClear
                  options={projects.map(p => ({ value: p.id, label: p.name }))}
                  placeholder="请选择" />
              </Form.Item>
            </div>

            <div className="inline-row">
              <span className="inline-label">迭代：</span>
              <Form.Item name="iteration" className="inline-control" style={{ marginBottom: 0 }}>
                <Select
                  allowClear
                  options={iterations.map(i => ({ value: i.id, label: i.name }))}
                  placeholder="请选择" />
              </Form.Item>
            </div>

            <div className="inline-row">
              <span className="inline-label">工作项类型：</span>
              <Form.Item name="type" className="inline-control" style={{ marginBottom: 0 }}>
                <Select
                  allowClear
                  options={bugTypes.map(t => ({ value: t.id, label: t.name }))}
                  placeholder="请选择" />
              </Form.Item>
            </div>

            <div className="inline-row">
              <span className="inline-label">负责人：</span>
              <Form.Item name="assignee" className="inline-control" style={{ marginBottom: 0 }}>
                <Select
                  allowClear
                  showSearch
                  options={users.map(u => ({ value: u.id, label: u.name }))}
                  placeholder="选择负责人"
                  filterOption={(input, option) => (option?.label as string).toLowerCase().includes(input.toLowerCase())}
                />
              </Form.Item>
            </div>

            <div className="inline-row">
              <span className="inline-label">验证者：</span>
              <Form.Item name="verifier" className="inline-control" style={{ marginBottom: 0 }}>
                <Select
                  allowClear
                  showSearch
                  options={users.map(u => ({ value: u.id, label: u.name }))}
                  placeholder="选择验证者"
                  filterOption={(input, option) => (option?.label as string).toLowerCase().includes(input.toLowerCase())}
                />
              </Form.Item>
            </div>

            <div className="inline-row">
              <span className="inline-label">严重程度：</span>
              <Form.Item name="severity" className="inline-control" style={{ marginBottom: 0 }}>
                <Select
                  allowClear
                  options={severities.map(s => ({ value: s.id, label: s.name }))}
                  placeholder="请选择" />
              </Form.Item>
            </div>

            <div className="inline-row">
              <span className="inline-label">优先级：</span>
              <Form.Item name="priority" className="inline-control" style={{ marginBottom: 0 }}>
                <Select
                  allowClear
                  options={priorities.map(p => ({ value: p.id, label: p.name }))}
                  placeholder="请选择" />
              </Form.Item>
            </div>

            <div className="inline-row">
              <span className="inline-label">计划时间范围：</span>
              <Form.Item name="plannedDateRange" className="inline-control"  style={{ marginBottom: 0 }}>
                <DatePicker.RangePicker
                  style={{ width: '100%' }}
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  placeholder={['开始时间', '结束时间']}
                />
              </Form.Item>
            </div>

            <div className="inline-row">
              <span className="inline-label">参与者：</span>
              <Form.Item name="participants" className="inline-control" style={{ marginBottom: 0 }}>
                <Select
                  mode="multiple"
                  allowClear
                  options={users.map(u => ({ value: u.id, label: u.name }))}
                  placeholder="选择参与者"
                  showSearch
                  filterOption={(input, option) => (option?.label as string).toLowerCase().includes(input.toLowerCase())}
                />
              </Form.Item>
            </div>

            <div className="inline-row">
              <span className="inline-label">抄送：</span>
              <Form.Item name="cc" className="inline-control" style={{ marginBottom: 0 }}>
                <Select
                  mode="multiple"
                  allowClear
                  options={users.map(u => ({ value: u.id, label: u.name }))}
                  placeholder="选择抄送人"
                  showSearch
                  filterOption={(input, option) => (option?.label as string).toLowerCase().includes(input.toLowerCase())}
                />
              </Form.Item>
            </div>

            <div className="inline-row">
              <span className="inline-label">标签：</span>
              <Form.Item name="tags" className="inline-control" style={{ marginBottom: 0 }}>
                <Select mode="tags" tokenSeparators={[',']} placeholder="输入并回车添加标签" />
              </Form.Item>
            </div>

            {formMode !== 'create' && (
              <>
                <div className="inline-row">
                  <span className="inline-label">不修复理由：</span>
                  <Form.Item name="notFixReason" className="inline-control" style={{ marginBottom: 0 }}>
                    <Select
                      allowClear
                      options={notFixReasons.map(r => ({ value: r.id, label: r.name }))}
                      placeholder="请选择"
                      onChange={() => {/* handled by useWatch/useEffect to toggle custom field */}}
                      showSearch
                      filterOption={(input, option) => (option?.label as string).toLowerCase().includes(input.toLowerCase())}
                    />
                  </Form.Item>
                </div>
                {(() => {
                  const selected = notFixReasons.find(r => r.id === selectedNotFix);
                  if (selected && selected.isCustom) {
                    return (
                      <Form.Item label="自定义不修复理由" name="customNotFixReason" style={{ marginTop: 8 }}>
                        <TextArea rows={2} placeholder="请输入自定义理由" />
                      </Form.Item>
                    );
                  }
                  return null;
                })()}
              </>
            )}
          </div>
        </div>
      </div>
    </Form>
  );
});

export default BugForm;
