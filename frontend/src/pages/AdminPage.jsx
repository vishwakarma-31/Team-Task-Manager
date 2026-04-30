import { useState, useEffect } from 'react';
import { Table, Typography, Spin, Card, Button, Select, message, Popconfirm, Tag, Dropdown, Skeleton } from 'antd';
import { DeleteOutlined, DownOutlined } from '@ant-design/icons';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

const AdminPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, projectsRes] = await Promise.all([
        api.get('/users'),
        api.get('/projects')
      ]);
      setUsers(usersRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      message.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersOnly = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      message.error('Failed to fetch users');
    }
  };

  const handleUpdateProjectRole = async (projectId, userId, newRole) => {
    try {
      await api.patch(`/projects/${projectId}/members/${userId}/role`, { role: newRole });
      message.success('Project role updated successfully');
      fetchData();
    } catch (error) {
      message.error(error.response?.data?.error || 'Failed to update project role');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      message.success('User deleted successfully');
      fetchUsersOnly();
    } catch (error) {
      message.error(error.response?.data?.error || 'Failed to delete user');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Project Roles',
      key: 'projectRoles',
      render: (_, record) => {
        const userProjects = projects.filter(p => 
          p.members?.some(m => (m._id || m.id) === (record._id || record.id))
        );
        
        if (userProjects.length === 0) return <Text type="secondary">No Projects</Text>;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {userProjects.map(p => {
              const isProjectAdmin = p.projectAdmins?.some(a => (a._id || a.id) === (record._id || record.id));
              const isOwner = (p.createdBy?._id || p.createdBy) === (record._id || record.id);
              
              if (isOwner) {
                 return (
                   <div key={p._id || p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 220 }}>
                     <Text strong>{p.name}</Text>
                     <Tag color="purple" style={{ margin: 0 }}>Project Owner</Tag>
                   </div>
                 );
              }

              return (
                <div key={p._id || p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 220 }}>
                  <Text strong>{p.name}</Text>
                  <Select
                    size="small"
                    value={isProjectAdmin ? 'admin' : 'member'}
                    onChange={(val) => handleUpdateProjectRole(p._id || p.id, record._id || record.id, val)}
                    style={{ width: 130 }}
                  >
                    <Select.Option value="member">Member</Select.Option>
                    <Select.Option value="admin">Project Admin</Select.Option>
                  </Select>
                </div>
              );
            })}
          </div>
        );
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        const isCurrentUser = (record.id || record._id) === currentUser?.id;
        
        if (isCurrentUser) return null;

        return (
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDeleteUser(record.id || record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        );
      }
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <Skeleton.Input active style={{ width: 250, marginBottom: 24 }} size="large" />
        <Card>
          <Skeleton active paragraph={{ rows: 10 }} />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Admin Panel</Title>
      <Text type="secondary">Manage system users and access</Text>

      <Card style={{ marginTop: 24 }}>
        <Table 
          columns={columns} 
          dataSource={users} 
          rowKey={(record) => record.id || record._id} 
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default AdminPage;
