import { Card, Avatar, Typography } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Text, Title } = Typography;

const ProjectCard = ({ project }) => {
  return (
    <Link to={`/projects/${project.id || project._id}`}>
      <Card hoverable style={{ height: '100%' }}>
        <Title level={4}>{project.name}</Title>
        <Text type="secondary">{project.description || 'No description'}</Text>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar.Group maxCount={3}>
            {(project.members || []).map((member, index) => (
              <Avatar key={index || member.id || member._id} style={{ backgroundColor: '#1890ff' }}>
                {member.name?.charAt(0).toUpperCase()}
              </Avatar>
            ))}
          </Avatar.Group>
          <Text type="secondary">
            <TeamOutlined /> {project.members?.length || 0} members
          </Text>
        </div>
        <div style={{ marginTop: 8 }}>
          <Text type="secondary">{project.taskCount || 0} tasks</Text>
        </div>
      </Card>
    </Link>
  );
};

export default ProjectCard;