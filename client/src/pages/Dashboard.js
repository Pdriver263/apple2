import { useState, useEffect, useCallback } from 'react';
import { Layout, Menu, Card, List, Spin, message } from 'antd';
import {
  DashboardOutlined,
  HomeOutlined,
  BookOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import ListingCard from '../components/listings/ListingCard';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserData = useCallback(() => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData) {
        navigate('/');
        return;
      }
      setUser(userData);
    } catch (err) {
      message.error('Failed to load user data');
      navigate('/');
    }
  }, [navigate]);

  const fetchListings = useCallback(async () => {
    if (user?.role !== 'host') return;
    
    try {
      const response = await api.get('/listings/my-listings');
      setListings(response.data);
    } catch (err) {
      message.error('Failed to fetch listings');
    }
  }, [user?.role]);

  const fetchBookings = useCallback(async () => {
    try {
      const endpoint = user?.role === 'host' 
        ? '/bookings/host' 
        : '/bookings/guest';
      const response = await api.get(endpoint);
      setBookings(response.data);
    } catch (err) {
      message.error('Failed to fetch bookings');
    }
  }, [user?.role]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (!user) return;

    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([fetchListings(), fetchBookings()]);
      setLoading(false);
    };

    loadAllData();
  }, [user, fetchListings, fetchBookings]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} breakpoint="lg" collapsedWidth="0">
        <div className="logo" style={{ 
          height: 32, 
          margin: 16, 
          background: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          textAlign: 'center',
          lineHeight: '32px'
        }}>
          {user?.name || 'Dashboard'}
        </div>
        <Menu 
          theme="dark" 
          mode="inline" 
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <DashboardOutlined />,
              label: 'Dashboard',
            },
            ...(user?.role === 'host' ? [{
              key: '2',
              icon: <HomeOutlined />,
              label: 'My Listings',
            }] : []),
            {
              key: '3',
              icon: <BookOutlined />,
              label: 'My Bookings',
            },
            {
              key: '4',
              icon: <UserOutlined />,
              label: 'Profile',
            },
            {
              key: '5',
              icon: <LogoutOutlined />,
              label: 'Logout',
              onClick: handleLogout,
            }
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: 0,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: 24
        }}>
          <span style={{ marginRight: 16 }}>Welcome, {user?.name}</span>
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div style={{ 
            padding: 24, 
            minHeight: 360,
            background: '#fff',
            borderRadius: 8
          }}>
            {user?.role === 'host' && (
              <>
                <h2 style={{ marginBottom: 16 }}>My Listings</h2>
                {listings.length > 0 ? (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                    gap: 16 
                  }}>
                    {listings.map(listing => (
                      <ListingCard 
                        key={listing._id} 
                        listing={listing} 
                        onUpdate={fetchListings}
                      />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <p>You don't have any listings yet.</p>
                  </Card>
                )}
              </>
            )}
            
            <h2 style={{ margin: '24px 0 16px' }}>Recent Bookings</h2>
            {bookings.length > 0 ? (
              <List
                dataSource={bookings}
                renderItem={booking => (
                  <List.Item>
                    <Card 
                      style={{ width: '100%' }}
                      actions={[
                        <span key="view">View Details</span>,
                        <span key="cancel">Cancel Booking</span>
                      ]}
                    >
                      <Card.Meta
                        title={booking.listing?.title || 'Deleted Listing'}
                        description={`${new Date(booking.checkIn).toLocaleDateString()} - ${new Date(booking.checkOut).toLocaleDateString()}`}
                      />
                      <p style={{ marginTop: 16 }}>
                        <strong>Status:</strong> {booking.status} <br />
                        <strong>Total:</strong> ${booking.totalPrice}
                      </p>
                    </Card>
                  </List.Item>
                )}
              />
            ) : (
              <Card>
                <p>No bookings found.</p>
              </Card>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}