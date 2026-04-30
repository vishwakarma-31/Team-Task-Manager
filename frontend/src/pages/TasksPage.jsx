import { useState, useEffect } from 'react';
import { Row, Col, Select, Card, Table, Tag, Typography, Spin, message, Button, Space, Skeleton } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';

const { Title, Text } = Typography;

const TasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [projectFilter, setProjectFilter] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [assignedToMe, setAssignedToMe] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (projectFilter) params.append('projectId', projectFilter);
      if (priorityFilter) params.append('priority', priorityFilter);
      if (assignedToMe) params.append('assignedTo', user?.id);

      const response = await api.get(`/tasks?${params.toString()}`);
      setTasks(response.data);
    } catch (error) {
      message.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      // Ignore
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, projectFilter, priorityFilter, assignedToMe]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      message.success('Status updated');
      fetchTasks();
    } catch (error) {
      message.error(error.response?.data?.error || 'Failed to update status');
    }
  };

  const isTaskAssignee = (task) => {
    return task.assignedTo?._id === user?.id || task.assignedTo?.id === user?.id || user?.role === 'admin';
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status, record) => {
        const isOverdue = record.dueDate && new Date(record.dueDate) < new Date() && status !== 'done';
        return <StatusBadge status={status} isOverdue={isOverdue} />;
      }
    },
    { title: 'Priority', dataIndex: 'priority', key: 'priority', render: (p) => <Tag color={p === 'high' ? 'red' : p === 'medium' ? 'orange' : 'blue'}>{p}</Tag> },
    { title: 'Project', dataIndex: ['project', 'name'], key: 'project' },
    { 
      title: 'Assigned To', 
      dataIndex: ['assignedTo', 'name'], 
      key: 'assignedTo',
      render: (name) => name || <Text type="secondary">Unassigned</Text>
    },
    { 
      title: 'Due Date', 
      dataIndex: 'dueDate', 
      key: 'dueDate',
      render: (date) => {
        if (!date) return '-';
        const isOverdue = new Date(date) < new Date();
        return <Text type={isOverdue ? 'danger' : undefined}>{new Date(date).toLocaleDateString()}</Text>;
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        if (!isTaskAssignee(record)) return null;
        return (
          <Select
            value={record.status}
            style={{ width: 120 }}
            onChange={(value) => handleStatusChange(record._id, value)}
            options={[
              { value: 'todo', label: 'To Do' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'done', label: 'Done' }
            ]}
          />
        );
      }
    }
  ];

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <Skeleton.Input active style={{ width: 200, marginBottom: 24 }} size="large" />
        <Card style={{ marginBottom: 16 }}>
          <Space wrap>
            <Skeleton.Input active style={{ width: 150 }} />
            <Skeleton.Input active style={{ width: 200 }} />
            <Skeleton.Input active style={{ width: 150 }} />
            <Skeleton.Button active />
          </Space>
        </Card>
        <Card>
           <Skeleton active paragraph={{ rows: 8 }} />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Tasks</Title>

      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <FilterOutlined />
          <Select
            placeholder="Filter by status"
            allowClear
            style={{ width: 150 }}
            onChange={setStatusFilter}
            options={[
              { value: 'todo', label: 'To Do' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'done', label: 'Done' }
            ]}
          />
          <Select
            placeholder="Filter by project"
            allowClear
            style={{ width: 200 }}
            onChange={setProjectFilter}
            options={projects.map(p => ({ value: p.id, label: p.name }))}
          />
          <Select
            placeholder="Filter by priority"
            allowClear
            style={{ width: 150 }}
            onChange={setPriorityFilter}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' }
            ]}
          />
          <Button type={assignedToMe ? 'primary' : 'default'} onClick={() => setAssignedToMe(!assignedToMe)}>
            Assigned to Me
          </Button>
        </Space>
      </Card>

      {tasks.length > 0 ? (
        <Table
          dataSource={tasks}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      ) : (
        <Text type="secondary">No tasks found</Text>
      )}
    </div>
  );
};

export default TasksPage;