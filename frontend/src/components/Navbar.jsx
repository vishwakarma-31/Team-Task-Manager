import { Layout, Menu, Button, Avatar, Dropdown, Typography, Tag } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserOutlined, LogoutOutlined, DashboardOutlined, ProjectOutlined, UnorderedListOutlined, SettingOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>
    },
    {
      key: '/projects',
      icon: <ProjectOutlined />,
      label: <Link to="/projects">Projects</Link>
    },
    {
      key: '/tasks',
      icon: <UnorderedListOutlined />,
      label: <Link to="/tasks">Tasks</Link>
    }
  ];

  if (user?.role === 'admin') {
    menuItems.push({
      key: '/admin',
      icon: <SettingOutlined />,
      label: <Link to="/admin">Admin</Link>
    });
  }

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ];

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.startsWith('/projects')) return '/projects';
    if (path.startsWith('/tasks')) return '/tasks';
    if (path.startsWith('/dashboard')) return '/dashboard';
    if (path.startsWith('/admin')) return '/admin';
    return '';
  };

  return (
    <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
      <Menu
        mode="horizontal"
        selectedKeys={[getSelectedKey()]}
        items={menuItems}
        style={{ border: 'none', flex: 1 }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Text strong>{user?.name}</Text>
        <Tag color={user?.role === 'admin' ? 'blue' : 'green'}>
          {user?.role}
        </Tag>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Avatar style={{ cursor: 'pointer' }} icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
};

export default Navbar;