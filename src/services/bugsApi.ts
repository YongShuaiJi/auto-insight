// API service for fetching and creating bugs

// Type definitions
export interface Bug {
  id: string;
  title: string;
  description: string;
  status: string;
  assignee: string;
  creator: string;
  createdAt: string;
  type: string;
  priority: string;
  iteration: string;
  plannedStartDate: string;
  plannedEndDate: string;
  completionDate: string;
  verifier: string;
  project: string;
  severity: string;
  participants: string[];
  cc: string[];
  tags: string[];
  notFixReason: string;
  customNotFixReason: string;
}

export interface User {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
}

export interface Iteration {
  id: string;
  name: string;
}

export interface Priority {
  id: string;
  name: string;
}

export interface Severity {
  id: string;
  name: string;
}

export interface BugType {
  id: string;
  name: string;
}

export interface NotFixReason {
  id: string;
  name: string;
  isCustom: boolean;
}

// Mock data
const mockBugs: Bug[] = [
  {
    id: 'BUG-001',
    title: '登录页面按钮样式错误',
    description: '登录页面的按钮颜色与设计稿不符',
    status: '待修复',
    assignee: 'user1',
    creator: 'user2',
    createdAt: '2023-10-15',
    type: 'bug',
    priority: 'high',
    iteration: 'iteration1',
    plannedStartDate: '2023-10-16',
    completionDate: '',
    verifier: 'user3',
    project: 'project1',
    severity: 'medium',
    participants: ['user1', 'user2'],
    cc: ['user4'],
    tags: ['UI', '前端'],
    notFixReason: '',
    customNotFixReason: '',
    plannedEndDate: ""
  },
  {
    id: 'BUG-002',
    title: '数据加载失败',
    description: '用户列表页面数据加载失败，显示404错误',
    status: '已修复',
    assignee: 'user3',
    creator: 'user1',
    createdAt: '2023-10-14',
    type: 'bug',
    priority: 'critical',
    iteration: 'iteration1',
    plannedStartDate: '2023-10-14',
    completionDate: '2023-10-15',
    verifier: 'user2',
    project: 'project1',
    severity: 'high',
    participants: ['user1', 'user3'],
    cc: [],
    tags: ['API', '后端'],
    notFixReason: '',
    customNotFixReason: '',
    plannedEndDate: ""
  },
  {
    id: 'BUG-003',
    title: '性能问题',
    description: '大数据量下页面加载缓慢',
    status: '待修复',
    assignee: 'user2',
    creator: 'user4',
    createdAt: '2023-10-13',
    type: 'bug',
    priority: 'medium',
    iteration: 'iteration2',
    plannedStartDate: '2023-10-17',
    completionDate: '',
    verifier: 'user1',
    project: 'project2',
    severity: 'low',
    participants: ['user2', 'user4'],
    cc: ['user3'],
    tags: ['性能', '前端'],
    notFixReason: '',
    customNotFixReason: '',
    plannedEndDate: ""
  }
];

const mockUsers: User[] = [
  { id: 'user1', name: '张三' },
  { id: 'user2', name: '李四' },
  { id: 'user3', name: '王五' },
  { id: 'user4', name: '赵六' }
];

const mockProjects: Project[] = [
  { id: 'project1', name: '项目一' },
  { id: 'project2', name: '项目二' }
];

const mockIterations: Iteration[] = [
  { id: 'iteration1', name: '迭代一' },
  { id: 'iteration2', name: '迭代二' }
];

const mockPriorities: Priority[] = [
  { id: 'low', name: '低' },
  { id: 'medium', name: '中' },
  { id: 'high', name: '高' },
  { id: 'critical', name: '紧急' }
];

const mockSeverities: Severity[] = [
  { id: 'low', name: '轻微' },
  { id: 'medium', name: '一般' },
  { id: 'high', name: '严重' },
  { id: 'critical', name: '致命' }
];

const mockBugTypes: BugType[] = [
  { id: 'bug', name: '缺陷' },
  { id: 'feature', name: '功能' },
  { id: 'improvement', name: '改进' }
];

const mockNotFixReasons: NotFixReason[] = [
  { id: 'duplicate', name: '重复问题', isCustom: false },
  { id: 'wontfix', name: '不会修复', isCustom: false },
  { id: 'notabug', name: '不是缺陷', isCustom: false },
  { id: 'custom', name: '其他原因', isCustom: true }
];

// API functions
export const fetchBugs = async (): Promise<Bug[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockBugs);
    }, 500);
  });
};

export const createBug = async (bugData: Omit<Bug, 'id' | 'createdAt'>): Promise<Bug> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newBug: Bug = {
        id: `BUG-${String(mockBugs.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString().split('T')[0],
        ...bugData
      };
      mockBugs.push(newBug);
      resolve(newBug);
    }, 500);
  });
};

export const updateBug = async (bug: Bug): Promise<Bug> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const idx = mockBugs.findIndex(b => b.id === bug.id);
      if (idx === -1) {
        reject(new Error('Bug not found'));
        return;
      }
      mockBugs[idx] = { ...mockBugs[idx], ...bug };
      resolve(mockBugs[idx]);
    }, 400);
  });
};

export const fetchUsers = async (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUsers);
    }, 300);
  });
};

export const fetchProjects = async (): Promise<Project[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProjects);
    }, 300);
  });
};

export const fetchIterations = async (): Promise<Iteration[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockIterations);
    }, 300);
  });
};

export const fetchPriorities = async (): Promise<Priority[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPriorities);
    }, 300);
  });
};

export const fetchSeverities = async (): Promise<Severity[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSeverities);
    }, 300);
  });
};

export const fetchBugTypes = async (): Promise<BugType[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockBugTypes);
    }, 300);
  });
};

export const fetchNotFixReasons = async (): Promise<NotFixReason[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockNotFixReasons);
    }, 300);
  });
};