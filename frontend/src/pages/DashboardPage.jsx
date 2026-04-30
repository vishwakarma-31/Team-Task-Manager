import { useState, useEffect } from 'react';
import { Row, Col, Progress, Table, Typography, Spin, Card } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import StatsCard from '../components/StatsCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';

const { Title, Text } = Typography;

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  const pieData = [
    { name: 'To Do', value: stats?.todoTasks || 0, color: '#d9d9d9' },
    { name: 'In Progress', value: stats?.inProgressTasks || 0, color: '#1890ff' },
    { name: 'Done', value: stats?.completedTasks || 0, color: '#52c41a' }
  ].filter(item => item.value > 0);

  const columnKeys = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Project', dataIndex: 'projectName', key: 'projectName' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate', render: (date) => date ? new Date(date).toLocaleDateString() : '-' }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Dashboard</Title>
      <Text type="secondary">Welcome, {user?.name}</Text>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <StatsCard title="Total Tasks" value={stats?.totalTasks || 0} />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatsCard title="Completed" value={stats?.completedTasks || 0} color="#52c41a" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatsCard title="In Progress" value={stats?.inProgressTasks || 0} color="#1890ff" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatsCard title="Overdue" value={stats?.overdueTasks || 0} color="#ff4d4f" />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card title="Completion Progress">
            <Progress percent={stats?.completionPercentage || 0} status="active" />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card title="Tasks by Status">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Text type="secondary">No tasks yet</Text>
            )}
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Tasks by Project">
            {stats?.tasksByProject?.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.tasksByProject}>
                  <XAxis dataKey="projectName" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1890ff" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Text type="secondary">No projects yet</Text>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="Overdue Tasks">
            {stats?.overdueTaskList?.length > 0 ? (
              <Table
                dataSource={stats.overdueTaskList}
                columns={columnKeys}
                rowKey="_id"
                pagination={false}
              />
            ) : (
              <Text type="secondary">No overdue tasks</Text>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="Recent Activity">
            {stats?.recentActivity?.length > 0 ? (
              <Table
                dataSource={stats.recentActivity}
                columns={[
                  { title: 'Title', dataIndex: 'title', key: 'title' },
                  { title: 'Status', dataIndex: 'status', key: 'status' },
                  { title: 'Project', dataIndex: ['project', 'name'], key: 'project' },
                  { title: 'Updated', dataIndex: 'updatedAt', key: 'updatedAt', render: (date) => new Date(date).toLocaleDateString() }
                ]}
                rowKey="_id"
                pagination={false}
              />
            ) : (
              <Text type="secondary">No recent activity</Text>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;