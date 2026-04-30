import { useState, useEffect } from 'react';
import { Row, Col, Button, Modal, Form, Input, message, Spin, Empty, Skeleton, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import ProjectCard from '../components/ProjectCard';

const ProjectsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      message.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values) => {
    setCreating(true);
    try {
      await api.post('/projects', values);
      message.success('Project created');
      setModalOpen(false);
      form.resetFields();
      fetchProjects();
    } catch (error) {
      message.error(error.response?.data?.error || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <Skeleton.Input active style={{ width: 200 }} size="large" />
          <Skeleton.Button active />
        </div>
        <Row gutter={[16, 16]}>
          {[1, 2, 3, 4].map(i => (
            <Col xs={24} sm={12} md={8} lg={6} key={i}>
              <Card>
                <Skeleton active title paragraph={{ rows: 3 }} />
                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                  <Skeleton.Button active size="small" style={{ marginRight: 8 }} />
                  <Skeleton.Button active size="small" />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Projects</h2>
        {user?.role === 'admin' && (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
            Create Project
          </Button>
        )}
      </div>

      {projects.length > 0 ? (
        <Row gutter={[16, 16]}>
          {projects.map(project => (
            <Col key={project.id || project._id} xs={24} sm={12} md={8} lg={6}>
              <ProjectCard project={project} />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="No projects yet" />
      )}

      <Modal
        title="Create Project"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={form.submit}
        confirmLoading={creating}
      >
        <Form form={form} onFinish={handleCreate} layout="vertical">
          <Form.Item
            label="Project Name"
            name="name"
            rules={[{ required: true, message: 'Please input project name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectsPage;