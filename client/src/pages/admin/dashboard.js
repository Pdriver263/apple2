import { useState, useEffect } from 'react';
import { Layout, Menu, Card, Statistic, Table, Tag, Button } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  HomeOutlined,
  DollarOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import api from '../../services/api';

const { Header, Content, Sider } = Layout;

const columns = [
  {
    title: 'User',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    render: (role) => (
      <Tag color={role === 'admin' ? 'red' : role === 'host' ? 'blue' : 'green'}>
        {role.toUpperCase()}
      </Tag>
    )
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Button 
        type="link" 
        onClick={() => console.log('Edit user', record)}
      >
        Edit
      </Button>
    )
  }
];

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    totalBookings: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, listingsRes, bookingsRes, statsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/listings'),
        api.get('/admin/bookings'),
        api.get('/admin/stats')
      ]);
      
      setUsers(usersRes.data);
      setListings(listingsRes.data);
      setBookings(bookingsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200}>
        <div className="logo" style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            Users
          </Menu.Item>
          <Menu.Item key="3" icon={<HomeOutlined />}>
            Listings
          </Menu.Item>
          <Menu.Item key="4" icon={<DollarOutlined />}>
            Transactions
          </Menu.Item>
          <Menu.Item 
            key="5" 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
          >
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }} />
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, minHeight: 360 }}>
            <h1>Admin Dashboard</h1>
            
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card>
                  <Statistic 
                    title="Total Users" 
                    value={stats.totalUsers} 
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic 
                    title="Total Listings" 
                    value={stats.totalListings} 
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic 
                    title="Total Bookings" 
                    value={stats.totalBookings} 
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic 
                    title="Total Revenue" 
                    value={stats.totalRevenue} 
                    prefix="$" 
                  />
                </Card>
              </Col>
            </Row>
            
            <h2>Recent Users</h2>
            <Table 
              columns={columns} 
              dataSource={users} 
              rowKey="_id" 
              pagination={{ pageSize: 5 }} 
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}