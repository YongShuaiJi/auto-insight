import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
  Grid,
  Autocomplete,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Paper
} from '@mui/material';
import { 
  Close as CloseIcon, 
  BugReport as BugReportIcon,
  Edit as EditIcon, 
  Visibility as VisibilityIcon 
} from '@mui/icons-material';
import { 
  fetchUsers, 
  fetchProjects, 
  fetchIterations, 
  fetchPriorities, 
  fetchSeverities,
  fetchBugTypes,
  fetchNotFixReasons
} from '../services/bugsApi';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import MDEditor from "@uiw/react-md-editor";
import MarkdownPreview from "@uiw/react-markdown-preview";
import type { Bug, User, Project, Iteration, Priority, Severity, BugType, NotFixReason } from '../services/bugsApi';

// Enhanced Markdown editor component using @uiw/react-md-editor and @uiw/react-markdown-preview
const MarkdownEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder = '请输入描述（支持Markdown语法）' }) => {
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: 'edit' | 'preview' | null,
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          aria-label="markdown view mode"
          size="small"
        >
          <ToggleButton value="edit" aria-label="edit mode">
            <EditIcon fontSize="small" sx={{ mr: 0.5 }} />
            编辑
          </ToggleButton>
          <ToggleButton value="preview" aria-label="preview mode">
            <VisibilityIcon fontSize="small" sx={{ mr: 0.5 }} />
            预览
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {viewMode === 'edit' ? (
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || '')}
          preview="live"
          height={300}
        />
      ) : (
        <Paper 
          variant="outlined" 
          sx={{ 
            height: 300, 
            overflow: 'auto', 
            p: 2,
            backgroundColor: (theme) => 
              theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5'
          }}
        >
          {value ? (
            <MarkdownPreview source={value} />
          ) : (
            <Box sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
              无内容预览
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

interface NewBugModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (bugData: Omit<Bug, 'id' | 'createdAt'>) => void;
  isLoading: boolean;
}

const NewBugModal: React.FC<NewBugModalProps> = ({
  open,
  onClose,
  onSubmit,
  isLoading
}) => {
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<BugType | null>(null);
  const [assignee, setAssignee] = useState<User | null>(null);
  const [verifier, setVerifier] = useState<User | null>(null);
  const [priority, setPriority] = useState<Priority | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [iteration, setIteration] = useState<Iteration | null>(null);
  const [severity, setSeverity] = useState<Severity | null>(null);
  const [participants, setParticipants] = useState<User[]>([]);
  const [cc, setCc] = useState<User[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [plannedStartDate, setPlannedStartDate] = useState<string>('');
  const [plannedEndDate, setPlannedEndDate] = useState<string>('');
  const [notFixReason, setNotFixReason] = useState<NotFixReason | null>(null);
  const [customNotFixReason, setCustomNotFixReason] = useState('');

  // Options for dropdowns
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [iterations, setIterations] = useState<Iteration[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [severities, setSeverities] = useState<Severity[]>([]);
  const [bugTypes, setBugTypes] = useState<BugType[]>([]);
  const [notFixReasons, setNotFixReasons] = useState<NotFixReason[]>([]);

  // Fetch options on component mount
  useEffect(() => {
    if (open) {
      const fetchOptions = async () => {
        try {
          const [
            usersData,
            projectsData,
            iterationsData,
            prioritiesData,
            severitiesData,
            bugTypesData,
            notFixReasonsData
          ] = await Promise.all([
            fetchUsers(),
            fetchProjects(),
            fetchIterations(),
            fetchPriorities(),
            fetchSeverities(),
            fetchBugTypes(),
            fetchNotFixReasons()
          ]);
          
          setUsers(usersData);
          setProjects(projectsData);
          setIterations(iterationsData);
          setPriorities(prioritiesData);
          setSeverities(severitiesData);
          setBugTypes(bugTypesData);
          setNotFixReasons(notFixReasonsData);
        } catch (error) {
          console.error('Error fetching options:', error);
        }
      };
      
      fetchOptions();
    }
  }, [open]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType(null);
    setAssignee(null);
    setVerifier(null);
    setPriority(null);
    setProject(null);
    setIteration(null);
    setSeverity(null);
    setParticipants([]);
    setCc([]);
    setTags([]);
    setPlannedStartDate('');
    setPlannedEndDate('');
    setNotFixReason(null);
    setCustomNotFixReason('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    const bugData = {
      title,
      description,
      type: type?.id || '',
      assignee: assignee?.id || '',
      verifier: verifier?.id || '',
      priority: priority?.id || '',
      project: project?.id || '',
      iteration: iteration?.id || '',
      severity: severity?.id || '',
      participants: participants.map(p => p.id),
      cc: cc.map(c => c.id),
      tags,
      plannedStartDate,
      plannedEndDate,
      notFixReason: notFixReason?.id || '',
      customNotFixReason,
      status: 'new',
      creator: 'currentUser',
      completionDate: ''
    };
    
    onSubmit(bugData);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="lg" 
      fullWidth
      slotProps={{
        paper:{
          sx: { height: '80vh' }
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <BugReportIcon sx={{ mr: 1 }} />
          <Typography variant="h6">新建缺陷</Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{xs:12, md:8}}>
            {/* Title input */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BugReportIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <TextField
                fullWidth
                label="标题"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Box>
            
            {/* Description editor */}
            <MarkdownEditor
              value={description}
              onChange={setDescription}
            />
          </Grid>
          
          <Grid size={{xs:12, md:4}}>
            <Typography variant="subtitle1" gutterBottom>
              基础字典
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Bug Type */}
              <FormControl fullWidth>
                <InputLabel>工作项类型</InputLabel>
                <Select
                  value={type?.id || ''}
                  onChange={(e) => {
                    const selectedType = bugTypes.find(t => t.id === e.target.value);
                    setType(selectedType || null);
                  }}
                  label="工作项类型"
                >
                  {bugTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {/* Assignee */}
              <Autocomplete
                options={users}
                getOptionLabel={(option) => option.name}
                value={assignee}
                onChange={(_, newValue) => setAssignee(newValue)}
                renderInput={(params) => <TextField {...params} label="负责人" />}
              />
              
              {/* Verifier */}
              <Autocomplete
                options={users}
                getOptionLabel={(option) => option.name}
                value={verifier}
                onChange={(_, newValue) => setVerifier(newValue)}
                renderInput={(params) => <TextField {...params} label="验证者" />}
              />
              
              {/* Priority */}
              <FormControl fullWidth>
                <InputLabel>优先级</InputLabel>
                <Select
                  value={priority?.id || ''}
                  onChange={(e) => {
                    const selectedPriority = priorities.find(p => p.id === e.target.value);
                    setPriority(selectedPriority || null);
                  }}
                  label="优先级"
                >
                  {priorities.map((priority) => (
                    <MenuItem key={priority.id} value={priority.id}>
                      {priority.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {/* Project */}
              <FormControl fullWidth>
                <InputLabel>归属项目</InputLabel>
                <Select
                  value={project?.id || ''}
                  onChange={(e) => {
                    const selectedProject = projects.find(p => p.id === e.target.value);
                    setProject(selectedProject || null);
                  }}
                  label="归属项目"
                >
                  {projects.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {/* Iteration */}
              <FormControl fullWidth>
                <InputLabel>迭代</InputLabel>
                <Select
                  value={iteration?.id || ''}
                  onChange={(e) => {
                    const selectedIteration = iterations.find(i => i.id === e.target.value);
                    setIteration(selectedIteration || null);
                  }}
                  label="迭代"
                >
                  {iterations.map((iteration) => (
                    <MenuItem key={iteration.id} value={iteration.id}>
                      {iteration.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {/* Severity */}
              <FormControl fullWidth>
                <InputLabel>严重程度</InputLabel>
                <Select
                  value={severity?.id || ''}
                  onChange={(e) => {
                    const selectedSeverity = severities.find(s => s.id === e.target.value);
                    setSeverity(selectedSeverity || null);
                  }}
                  label="严重程度"
                >
                  {severities.map((severity) => (
                    <MenuItem key={severity.id} value={severity.id}>
                      {severity.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {/* Participants */}
              <Autocomplete
                multiple
                options={users}
                getOptionLabel={(option) => option.name}
                value={participants}
                onChange={(_, newValue) => setParticipants(newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option.name}
                      {...getTagProps({ index })}
                      key={option.id}
                    />
                  ))
                }
                renderInput={(params) => <TextField {...params} label="参与者" />}
              />
              
              {/* CC */}
              <Autocomplete
                multiple
                options={users}
                getOptionLabel={(option) => option.name}
                value={cc}
                onChange={(_, newValue) => setCc(newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option.name}
                      {...getTagProps({ index })}
                      key={option.id}
                    />
                  ))
                }
                renderInput={(params) => <TextField {...params} label="抄送" />}
              />
              
              {/* Tags */}
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={tags}
                onChange={(_, newValue) => setTags(newValue as string[])}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      key={index}
                    />
                  ))
                }
                renderInput={(params) => <TextField {...params} label="标签" />}
              />
              
              {/* Planned Start Date */}
              <TextField
                label="计划开始时间"
                type="date"
                value={plannedStartDate}
                onChange={(e) => setPlannedStartDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              
              {/* Planned End Date */}
              <TextField
                label="计划完成时间"
                type="date"
                value={plannedEndDate}
                onChange={(e) => setPlannedEndDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              
              {/* Not Fix Reason */}
              <Autocomplete
                options={notFixReasons}
                getOptionLabel={(option) => option.name}
                value={notFixReason}
                onChange={(_, newValue) => {
                  setNotFixReason(newValue);
                  if (!newValue) setCustomNotFixReason('');
                }}
                renderInput={(params) => <TextField {...params} label="不修复理由" />}
              />
              
              {/* Custom Not Fix Reason */}
              {notFixReason && notFixReason.isCustom && (
                <TextField
                  label="自定义不修复理由"
                  value={customNotFixReason}
                  onChange={(e) => setCustomNotFixReason(e.target.value)}
                  multiline
                  rows={2}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose}>取消</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={isLoading || !title.trim()}
        >
          {isLoading ? <CircularProgress size={24} /> : '新建'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewBugModal;
