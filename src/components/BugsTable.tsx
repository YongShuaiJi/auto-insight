import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Menu,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress
} from "@mui/material";
import { BugReport as BugReportIcon, Settings as SettingsIcon } from '@mui/icons-material';
import type { Bug } from '../services/bugsApi';

interface BugsTableProps {
  bugs: Bug[];
  isLoading: boolean;
  visibleColumns: string[];
  onToggleColumn: (columnName: string) => void;
  title?: string;
  className?: string;
}

// Column definitions with display names
const columnDefinitions = [
  { id: 'id', label: '编号' },
  { id: 'title', label: '标题' },
  { id: 'status', label: '状态' },
  { id: 'assignee', label: '负责人' },
  { id: 'creator', label: '创建者' },
  { id: 'createdAt', label: '创建时间' },
  { id: 'type', label: '类型' },
  { id: 'priority', label: '优先级' },
  { id: 'iteration', label: '迭代' },
  { id: 'plannedStartDate', label: '计划开始时间' },
  { id: 'completionDate', label: '完成时间' }
];

const BugsTable: React.FC<BugsTableProps> = ({
  bugs,
  isLoading,
  visibleColumns,
  onToggleColumn,
  title = "缺陷列表",
  className = "bugs-table-card"
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Get visible columns in the order they are defined
  const visibleColumnDefs = columnDefinitions.filter(col => 
    visibleColumns.includes(col.id)
  );

  return (
    <Card className={className}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="primary" aria-label="bugs list">
              <BugReportIcon />
            </IconButton>
            <Typography variant="h6" gutterBottom sx={{ ml: 1, mb: 0 }}>
              {title}
            </Typography>
          </Box>
          <IconButton 
            color="primary" 
            aria-label="column settings"
            onClick={handleSettingsClick}
          >
            <SettingsIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: 300,
                width: '250px',
                padding: '8px'
              },
            }}
          >
            <Typography variant="subtitle1" sx={{ px: 2, py: 1 }}>
              显示/隐藏列
            </Typography>
            {columnDefinitions.map((column) => (
              <MenuItem key={column.id} dense sx={{ py: 0 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={visibleColumns.includes(column.id)}
                      onChange={() => onToggleColumn(column.id)}
                      color="primary"
                    />
                  }
                  label={column.label}
                  sx={{ width: '100%' }}
                />
              </MenuItem>
            ))}
          </Menu>
        </Box>
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {visibleColumnDefs.map((column) => (
                    <TableCell key={column.id}>{column.label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {bugs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={visibleColumnDefs.length} align="center">
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  bugs.map((bug) => (
                    <TableRow key={bug.id}>
                      {visibleColumnDefs.map((column) => (
                        <TableCell key={`${bug.id}-${column.id}`}>
                          {bug[column.id as keyof Bug]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default BugsTable;