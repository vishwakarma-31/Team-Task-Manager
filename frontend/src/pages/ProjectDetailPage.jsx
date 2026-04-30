import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Typography, Button, Modal, Form, Input, Select, Avatar, List, message, Spin, Table, Tag, Skeleton } from 'antd';
import { PlusOutlined, UserDeleteOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import TaskCard from '../components/TaskCard';

const { Title, Text } = Typography;

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [creatingTask, setCreatingTask] = useState(false);
  const [addingMember, setAddingMember] = useState(false);
  const [users, setUsers] = useState([]);
  const [taskForm] = Form.useForm();
  const [memberForm] = Form.useForm();
  const [statusFilter, setStatusFilter] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState(null);

  useEffect(() => {
    fetchProject();
    fetchAllUsers();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data.project);
      setTasks(response.data.tasks || []);
    } catch (error) {
      message.error('Failed to fetch project');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      // Ignore
    }
  };

  const handleCreateTask = async (values) => {
    setCreatingTask(true);
    try {
      await api.post('/tasks', { ...values, projectId: id });
      message.success('Task created');
      setTaskModalOpen(false);
      taskForm.resetFields();
      fetchProject();
    } catch (error) {
      message.error(error.response?.data?.error || 'Failed to create task');
    } finally {
      setCreatingTask(false);
    }
  };

  const handleAddMember = async (values) => {
    setAddingMember(true);
    try {
      await api.post(`/projects/${id}/members`, { userId: values.userId });
      message.success('Member added');
      setMemberModalOpen(false);
      memberForm.resetFields();
      fetchProject();
    } catch (error) {
      message.error(error.response?.data?.error || 'Failed to add member');
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await api.delete(`/projects/${id}/members/${userId}`);
      message.success('Member removed');
      fetchProject();
    } catch (error) {
      message.error(error.response?.data?.error || 'Failed to remove member');
    }
  };

  const handleUpdateMemberRole = async (userId, role) => {
    try {
      await api.patch(`/projects/${id}/members/${userId}/role`, { role });
      message.success('Role updated');
      fetchProject();
    } catch (error) {
      message.error(error.response?.data?.error || 'Failed to update member role');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      message.success('Status updated');
      fetchProject();
    } catch (error) {
      message.error(error.response?.data?.error || 'Failed to update status');
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (statusFilter && task.status !== statusFilter) return false;
    if (priorityFilter && task.priority !== priorityFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <Card style={{ marginBottom: 24 }}>
          <Skeleton active title paragraph={{ rows: 1 }} />
        </Card>
        
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={12}>
            <Card title={<Skeleton.Input active size="small" style={{ width: 100 }} />}>
              <List
                dataSource={[1, 2, 3]}
                renderItem={() => (
                  <List.Item>
                    <Skeleton avatar active title={false} paragraph={{ rows: 1 }} />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>

        <Card 
          title={<Skeleton.Input active size="small" style={{ width: 100 }} />}
          extra={<Skeleton.Button active />}
        >
          <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
            <Skeleton.Input active style={{ width: 150 }} size="small" />
            <Skeleton.Input active style={{ width: 150 }} size="small" />
          </div>
          <Row gutter={[16, 16]}>
            {[1, 2, 3].map(i => (
              <Col key={i} xs={24} sm={12} md={8}>
                <Card>
                  <Skeleton active title paragraph={{ rows: 2 }} />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ marginBottom: 24 }}>
        <Title level={2}>{project?.name}</Title>
        <Text type="secondary">{project?.description || 'No description'}</Text>
        <div style={{ marginTop: 8 }}>
          <Text type="secondary">Created by: {project?.createdBy?.name}</Text>
        </div>
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card title="Members">
            <List
              dataSource={project?.members || []}
              renderItem={member => {
                const isProjectAdmin = project?.projectAdmins?.some(a => (a._id || a.id) === (member._id || member.id)) || (member._id === project?.createdBy?._id);
                const currentUserIsProjectAdmin = project?.projectAdmins?.some(a => (a._id || a.id) === user?.id) || user?.role === 'admin';
                const canManageRoles = currentUserIsProjectAdmin && member._id !== project?.createdBy?._id;

                return (
                  <List.Item
                    actions={canManageRoles ? [
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Select 
                          value={isProjectAdmin ? 'admin' : 'member'}
                          size="small"
                          onChange={(val) => handleUpdateMemberRole(member._id, val)}
                          style={{ width: 130 }}
                        >
                          <Select.Option value="member">Member</Select.Option>
                          <Select.Option value="admin">Project Admin</Select.Option>
                        </Select>
                        <Button
                          type="text"
                          danger
                          icon={<UserDeleteOutlined />}
                          onClick={() => handleRemoveMember(member._id)}
                        />
                      </div>
                    ] : []}
                  >
                    <List.Item.Meta
                      avatar={<Avatar>{member.name?.charAt(0).toUpperCase()}</Avatar>}
                      title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {member.name}
                          {member._id === project?.createdBy?._id && (
                            <Tag color="purple" style={{ margin: 0 }}>Project Owner</Tag>
                          )}
                          {isProjectAdmin && member._id !== project?.createdBy?._id && (
                            <Tag color="volcano" style={{ margin: 0 }}>Project Admin</Tag>
                          )}
                        </div>
                      }
                      description={member.email}
                    />
                  </List.Item>
                );
              }}
            />
            {user?.role === 'admin' && (
              <Button type="dashed" block onClick={() => setMemberModalOpen(true)}>
                Add Member
              </Button>
            )}
          </Card>
        </Col>
      </Row>

      <Card
        title="Tasks"
        extra={
          user?.role === 'admin' && (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setTaskModalOpen(true)}>
              Create Task
            </Button>
          )
        }
      >
        <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
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
        </div>

        {filteredTasks.length > 0 ? (
          <Row gutter={[16, 16]}>
            {filteredTasks.map(task => (
              <Col key={task.id} xs={24} sm={12} md={8}>
                <TaskCard
                  task={task}
                  isAssignee={user?._id === task.assignedTo?._id || user?.role === 'admin'}
                  onStatusChange={handleStatusChange}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <Text type="secondary">No tasks yet</Text>
        )}
      </Card>

      <Modal
        title="Create Task"
        open={taskModalOpen}
        onCancel={() => setTaskModalOpen(false)}
        onOk={taskForm.submit}
        confirmLoading={creatingTask}
        width={600}
      >
        <Form form={taskForm} onFinish={handleCreateTask} layout="vertical">
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please input task title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Assigned To" name="assignedTo">
            <Select allowClear placeholder="Select user">
              {project?.members?.map(member => (
                <Select.Option key={member._id || member.id} value={member._id || member.id}>
                  {member.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Status" name="status" initialValue="todo">
            <Select>
              <Select.Option value="todo">To Do</Select.Option>
              <Select.Option value="in-progress">In Progress</Select.Option>
              <Select.Option value="done">Done</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Priority" name="priority" initialValue="medium">
            <Select>
              <Select.Option value="low">Low</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="high">High</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Due Date" name="dueDate">
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add Member"
        open={memberModalOpen}
        onCancel={() => setMemberModalOpen(false)}
        onOk={memberForm.submit}
        confirmLoading={addingMember}
      >
        <Form form={memberForm} onFinish={handleAddMember} layout="vertical">
          <Form.Item
            label="Select User"
            name="userId"
            rules={[{ required: true, message: 'Please select a user!' }]}
          >
            <Select placeholder="Select user">
              {users
                .filter(m => !project?.members?.some(em => (em._id || em.id) === (m._id || m.id)))
                .map(member => (
                  <Select.Option key={member.id || member._id} value={member.id || member._id}>
                    {member.name} ({member.email})
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectDetailPage;