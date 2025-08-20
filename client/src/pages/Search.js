import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Row, Col, Card, Input, DatePicker, Slider, Select, Button, InputNumber, Spin, notification } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import ListingCard from '../components/listings/ListingCard';
import { listingService } from '../services/api'; // API সার্ভিস ব্যবহার করুন

const { RangePicker } = DatePicker;
const { Option } = Select;

const SearchPage = () => {
  const location = useLocation();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    dates: null,
    guests: 1,
    priceRange: [0, 1000],
    amenities: []
  });

  const searchListings = useCallback(async () => {
    setLoading(true);
    try {
      const searchParams = {
        location: filters.location,
        guests: filters.guests,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        amenities: filters.amenities.join(',')
      };

      // API সার্ভিস ব্যবহার করে সার্চ করুন
      const result = await listingService.searchListings(searchParams);
    
    if (result.success) {
      setListings(result.data);
    } else {
      notification.error({
        message: 'Search Error',
        description: result.message
      });
      setListings([]);
    }
  } catch (err) {
    console.error('Search error:', err);
    notification.error({
      message: 'Error',
      description: 'Failed to search listings. Please try again.'
    });
  } finally {
    setLoading(false);
  }
}, [filters]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const locationParam = searchParams.get('location');
    const guestsParam = searchParams.get('guests');

    if (locationParam || guestsParam) {
      setFilters(prev => ({
        ...prev,
        location: locationParam || prev.location,
        guests: guestsParam ? parseInt(guestsParam) : prev.guests
      }));
    }
  }, [location.search]);

  useEffect(() => {
    searchListings();
  }, [searchListings]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '24px' }}>Search Listings</h1>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={24} md={8} lg={6}>
          <Card title="Filters" style={{ marginBottom: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <h4>Location</h4>
              <Input
                placeholder="City or area"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                prefix={<SearchOutlined />}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <h4>Dates</h4>
              <RangePicker
                style={{ width: '100%' }}
                onChange={(dates) => handleFilterChange('dates', dates)}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <h4>Guests</h4>
              <InputNumber
                min={1}
                max={20}
                value={filters.guests}
                onChange={(value) => handleFilterChange('guests', value)}
                style={{ width: '100%' }}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <h4>Price Range ($)</h4>
              <Slider
                range
                min={0}
                max={5000}
                step={100}
                value={filters.priceRange}
                onChange={(value) => handleFilterChange('priceRange', value)}
              />
              <div style={{ textAlign: 'center', marginTop: '8px' }}>
                ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </div>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <h4>Amenities</h4>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Select amenities"
                value={filters.amenities}
                onChange={(value) => handleFilterChange('amenities', value)}
              >
                <Option value="wifi">Wi-Fi</Option>
                <Option value="ac">Air Conditioning</Option>
                <Option value="kitchen">Kitchen</Option>
                <Option value="parking">Parking</Option>
                <Option value="pool">Swimming Pool</Option>
                <Option value="tv">TV</Option>
              </Select>
            </div>
            
            <Button 
              type="primary" 
              onClick={searchListings} 
              loading={loading}
              icon={<SearchOutlined />}
              block
            >
              Search
            </Button>
          </Card>
        </Col>
        
        <Col xs={24} sm={24} md={16} lg={18}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Spin size="large" />
              <p>Searching listings...</p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '16px' }}>
                <h3>{listings.length} listings found</h3>
              </div>
              
              <Row gutter={[16, 16]}>
                {listings.length > 0 ? (
                  listings.map(listing => (
                    <Col key={listing._id || listing.id} xs={24} sm={12} md={12} lg={8} xl={6}>
                      <ListingCard listing={listing} />
                    </Col>
                  ))
                ) : (
                  <Col span={24} style={{ textAlign: 'center', padding: '40px' }}>
                    <h3>No listings found</h3>
                    <p>Try adjusting your search filters</p>
                  </Col>
                )}
              </Row>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default SearchPage;