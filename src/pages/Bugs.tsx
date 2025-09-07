import React, { useState, useEffect } from 'react';
import { Typography, Button } from '../ui';
import { PlusOutlined } from '../ui';
import BugsTable from '../components/BugsTable';
import NewBugModal from '../components/BugModal';
import { fetchBugs, createBug } from '../services/bugsApi';
import type { Bug } from '../services/bugsApi';

const Bugs: React.FC = () => {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewBugModalOpen, setIsNewBugModalOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'id', 'title', 'status', 'assignee', 'creator', 'createdAt', 'type', 
    'priority', 'iteration', 'plannedStartDate', 'completionDate'
  ]);

  // Fetch bugs on component mount
  useEffect(() => {
    fetchBugsData();
  }, []);

  const fetchBugsData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchBugs();
      setBugs(data);
    } catch (error) {
      console.error('Error fetching bugs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBug = async (bugData: Omit<Bug, 'id' | 'createdAt'>) => {
    setIsLoading(true);
    try {
      await createBug(bugData);
      // Refresh the bugs list after creating a new bug
      await fetchBugsData();
      // Close the modal
      setIsNewBugModalOpen(false);
    } catch (error) {
      console.error('Error creating bug:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleColumn = (columnName: string) => {
    setVisibleColumns(prev => 
      prev.includes(columnName)
        ? prev.filter(col => col !== columnName)
        : [...prev, columnName]
    );
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Typography.Title level={2} style={{ margin: 0 }}>
          缺陷
        </Typography.Title>
        <Button 
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsNewBugModalOpen(true)}
        >
          新建
        </Button>
      </div>

      <BugsTable 
        bugs={bugs} 
        isLoading={isLoading} 
        visibleColumns={visibleColumns}
        onToggleColumn={handleToggleColumn}
      />

      <NewBugModal 
        open={isNewBugModalOpen}
        onClose={() => setIsNewBugModalOpen(false)}
        onSubmit={handleCreateBug}
        isLoading={isLoading}
      />
    </>
  );
};

export default Bugs;