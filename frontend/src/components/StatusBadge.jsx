import { Tag } from 'antd';

const StatusBadge = ({ status, isOverdue }) => {
  const statusColors = {
    'todo': { color: 'default', text: 'To Do' },
    'in-progress': { color: 'processing', text: 'In Progress' },
    'done': { color: 'success', text: 'Done' }
  };

  if (isOverdue) {
    return <Tag color="error">Overdue</Tag>;
  }

  const config = statusColors[status] || { color: 'default', text: status };
  return <Tag color={config.color}>{config.text}</Tag>;
};

export default StatusBadge;