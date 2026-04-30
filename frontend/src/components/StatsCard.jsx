import { Card, Statistic } from 'antd';

const StatsCard = ({ title, value, prefix, color }) => {
  return (
    <Card>
      <Statistic
        title={title}
        value={value}
        prefix={prefix}
        valueStyle={{ color: color || '#3f8600' }}
      />
    </Card>
  );
};

export default StatsCard;