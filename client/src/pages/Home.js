import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Row, Col, Spin, notification } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { listingService } from '../services/api'; // API সার্ভিস ইম্পোর্ট করুন
import ListingCard from '../components/listings/ListingCard';

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    location: '',
    dates: null,
    guests: 1
  });
  
  const navigate = useNavigate();

  const fetchFeaturedListings = async () => {
    setLoading(true);
    try {
      // API সার্ভিস ব্যবহার করে ডেটা ফেচ করুন
      const result = await listingService.getFeaturedListings();
      
      if (result.success) {
        setListings(result.data);
      } else {
        notification.error({
          message: 'Error',
          description: result.message || 'Failed to load featured listings.'
        });
        setListings([]);
      }
    } catch (err) {
      console.error('Failed to fetch listings:', err);
      notification.error({
        message: 'Error',
        description: 'Failed to load featured listings. Please try again later.'
      });
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedListings();
  }, []);

  const handleSearch = () => {
    navigate({
      pathname: '/search',
      search: `?location=${searchParams.location}&guests=${searchParams.guests}`
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <div style={{ 
        background: '#f0f2f5', 
        padding: 40, 
        borderRadius: 8,
        marginBottom: 40,
        textAlign: 'center'
      }}>
        <h1>Find your perfect stay</h1>
        <Row gutter={16} justify="center" style={{ marginTop: 24 }}>
          <Col span={8}>
            <input 
              type="text"
              placeholder="Where are you going?" 
              value={searchParams.location}
              onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
              style={{ width: '100%', padding: '8px' }}
            />
          </Col>
          <Col span={4}>
            <Button 
              type="primary" 
              icon={<SearchOutlined />} 
              onClick={handleSearch}
              style={{ width: '100%' }}
            >
              Search
            </Button>
          </Col>
        </Row>
      </div>

      <h2>Featured Listings</h2>
      {listings.length > 0 ? (
        <Row gutter={[24, 24]}>
          {listings.map(listing => (
            <Col key={listing._id || listing.id} xs={24} sm={12} md={8} lg={6}>
              <ListingCard listing={listing} />
            </Col>
          ))}
        </Row>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p>No featured listings available at the moment</p>
        </div>
      )}

      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <h3>Become a Host</h3>
        <p>Earn money by renting out your extra space</p>
        <Link to="/host/listings/new">
          <Button type="primary" size="large">List Your Property</Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;