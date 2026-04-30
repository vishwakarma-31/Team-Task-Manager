import { Card, Avatar, Typography, Space } from 'antd';
import StatusBadge from './StatusBadge';
import { UserOutlined, CalendarOutlined } from '@ant-design/icons';

const { Text } = Typography;

const TaskCard = ({ task, onStatusChange, isAssignee }) => {
  const isOverdue = task.isOverdue || (task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done');

  return (
    <Card
      style={{
        borderColor: isOverdue ? '#ff4d4f' : undefined,
        borderWidth: isOverdue ? 2 : 1
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        <Text strong>{task.title}</Text>
        <StatusBadge status={task.status} isOverdue={isOverdue} />
        <Text type="secondary">{task.description?.substring(0, 100)}{task.description?.length > 100 ? '...' : ''}</Text>
        <Space>
          {task.project?.name && (
            <Text type="secondary">Project: {task.project.name}</Text>
          )}
        </Space>
        <Space>
          {task.assignedTo && (
            <>
              <Avatar size="small" icon={<UserOutlined />} />
              <Text type="secondary">{task.assignedTo.name}</Text>
            </>
          )}
          {task.dueDate && (
            <>
              <CalendarOutlined />
              <Text type="secondary">
                {new Date(task.dueDate).toLocaleDateString()}
              </Text>
            </>
          )}
        </Space>
        <Text type="secondary">Priority: {task.priority}</Text>
      </Space>
    </Card>
  );
};

export default TaskCard;